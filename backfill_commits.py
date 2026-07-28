#!/usr/bin/env python3
"""
backfill_commits.py  (v3 — custom contexts)
────────────────────────────────────────────────────────────────────────────────
Backfill a GitHub repo's contribution graph with AI-generated code commits.
Now supports fully user-defined contexts in the config file.

Config file format (config.json):
  {
    "start_date":          "2025-01-01",
    "end_date":            "2025-12-31",
    "target_repo_path":    "/abs/path/to/repo",
    "commit_density":      0.45,
    "max_commits_per_day": 3,
    "gemini_api_key":      "optional-key",
    "use_builtin_contexts": false,
    "contexts": [
      {
        "name": "My Trading Bot",
        "weight": 2,
        "files": [
          {
            "path": "src/signals.py",
            "language": "Python",
            "description": "momentum signal functions using pandas/numpy",
            "replace": false
          },
          {
            "path": "config/strategy.json",
            "language": "JSON",
            "description": "strategy param snapshot with thresholds and toggles",
            "replace": true
          }
        ]
      }
    ]
  }

Fields:
  name        — display name shown in the commit log
  weight      — relative pick frequency (2 = twice as likely as 1), default 1
  files[].path        — relative path inside the repo (created if missing)
  files[].language    — language hint sent to Gemini (Python, Solidity, JSX, etc.)
  files[].description — what kind of code Gemini should write for this file
  files[].replace     — true = rewrite whole file (good for JSON), false = append
  use_builtin_contexts — include the built-in quant/dapp/web themes alongside yours
"""

import argparse
import json
import os
import random
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    from google import genai as _genai_sdk
    from google.genai import types as _genai_types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


# ─────────────────────────────────────────────────────────────────────────────
# Data model
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FileSpec:
    """Describes a single file that Gemini will write code into."""
    path: str          # relative path inside the repo
    language: str      # e.g. "Python", "Solidity ^0.8.24", "React JSX"
    description: str   # what kind of code to generate
    replace: bool = False  # True = rewrite whole file; False = append


@dataclass
class Context:
    """A thematic bucket of files that belong together."""
    name: str
    files: List[FileSpec]
    weight: int = 1            # relative probability weight
    fallback_messages: List[str] = field(default_factory=list)
    fallback_templates: List[str] = field(default_factory=list)


# ─────────────────────────────────────────────────────────────────────────────
# Built-in contexts (used when use_builtin_contexts=true or no custom ones set)
# ─────────────────────────────────────────────────────────────────────────────

BUILTIN_CONTEXTS: List[Context] = [
    Context(
        name="Quantitative Finance & Trading",
        weight=1,
        files=[
            FileSpec("indicators.txt",         "Python",          "a technical indicator using pandas/numpy (RSI, MACD, Bollinger Bands, ATR, etc.)"),
            FileSpec("backtest_log.py",         "Python",          "a backtesting utility — perf metric, trade executor, or OHLCV data loader"),
            FileSpec("strategies.pine",         "Pine Script v5",  "an entry/exit block or custom indicator using ta.* and strategy.entry/exit"),
            FileSpec("portfolio_valuation.json","JSON",            "portfolio snapshot with asset allocations and valuations", replace=True),
        ],
        fallback_messages=[
            "feat: add Bollinger Bands and RSI confluence logic to Pine Script v5",
            "fix: correct strike price calculation in options valuation module",
            "refactor: optimize data ingestion loop for historical BTC/USDT hourly bars",
            "docs: update backtesting metrics and Sharpe ratio logs",
            "feat: implement adaptive ATR-based position sizing for futures strategies",
            "perf: vectorize rolling-window Sharpe calculation with NumPy",
        ],
        fallback_templates=[
            "# [{ts}] RSI divergence on 4H BTC/USDT — long bias confirmed",
            "# [{ts}] Backtest: CAGR={cagr:.2f}%, MaxDD={dd:.2f}%, Sharpe={sharpe:.3f}",
        ],
    ),
    Context(
        name="Decentralized Applications",
        weight=1,
        files=[
            FileSpec("Factory.sol",         "Solidity ^0.8.24",          "a factory function, modifier, or event with NatSpec"),
            FileSpec("MappingStorage.json", "JSON",                       "contract deployment record with address, network, blockNumber", replace=True),
            FileSpec("deploy_rpc.py",       "Python with web3.py",        "a deployment or contract-interaction function"),
            FileSpec("MockToken.sol",       "Solidity ^0.8.24",           "an ERC20 helper or test utility with NatSpec"),
        ],
        fallback_messages=[
            "feat: implement global property mappings for contract ownership",
            "refactor: optimize gas usage in transfer functions",
            "test: add unit tests for custom RPC node connection stability",
            "fix: resolve compiler warning regarding state variable visibility",
            "feat: add reentrancy guard to withdrawal function",
        ],
        fallback_templates=[
            "// [{ts}] Factory deployed at {addr} on Sepolia — gas: {gas}",
            "// [{ts}] Slot[{slot}] verified: keccak256(owner ++ nonce)",
        ],
    ),
    Context(
        name="Web Development & Tooling",
        weight=1,
        files=[
            FileSpec("Dashboard.jsx",  "React JSX",                        "a reusable component or custom hook for a financial dashboard"),
            FileSpec("vite.config.js", "JavaScript (Vite config)",         "a Vite plugin, resolve alias, or chunk-splitting rule"),
            FileSpec("scraper.py",     "Python with requests/BeautifulSoup","a scraping function that extracts financial data"),
            FileSpec("package.json",   "JSON",                             "complete package.json for a React/Vite financial dashboard", replace=True),
        ],
        fallback_messages=[
            "feat: integrate responsive charting components for financial metrics",
            "perf: configure chunk splitting in vite.config for faster builds",
            "fix: update selectors in BeautifulSoup scraper to handle pagination",
            "chore: update dependencies and resolve breaking changes in react-router",
            "refactor: extract useMarketData hook for cleaner component separation",
        ],
        fallback_templates=[
            "// [{ts}] Dashboard v{major}.{minor}.{patch} — added {widget}",
            "# [{ts}] Scraper: {pages} pages crawled, {records} records saved",
        ],
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# Gemini generator
# ─────────────────────────────────────────────────────────────────────────────

class GeminiGenerator:
    MODEL = "gemini-2.0-flash"
    RATE_LIMIT_SLEEP = 4.5  # ~13 RPM — safe for free tier

    def __init__(self, api_key: str) -> None:
        if not GENAI_AVAILABLE:
            raise RuntimeError(
                "google-genai not installed.\n"
                "Fix: pip install google-genai"
            )
        self._client = _genai_sdk.Client(api_key=api_key)
        self._last_call: float = 0.0

    def _throttle(self) -> None:
        elapsed = time.monotonic() - self._last_call
        if elapsed < self.RATE_LIMIT_SLEEP:
            time.sleep(self.RATE_LIMIT_SLEEP - elapsed)
        self._last_call = time.monotonic()

    def _build_prompt(self, context_name: str, spec: FileSpec) -> str:
        if spec.replace:
            return (
                f"You are a {context_name} developer.\n\n"
                f"Generate {spec.description} for a file named `{spec.path}`.\n\n"
                f"Rules:\n"
                f"- The snippet will REPLACE the entire file, so it must be complete and valid {spec.language}.\n"
                f"- 10-40 lines, properly formatted and realistic.\n"
                f"- No markdown fences inside the snippet field.\n\n"
                f"Return ONLY a raw JSON object with exactly two string fields:\n"
                f'  {{"snippet": "<full file content>", "message": "<conventional commit msg, max 72 chars>"}}\n\n'
                f"No markdown, no explanation."
            )
        return (
            f"You are a {context_name} developer.\n\n"
            f"Generate {spec.description} to APPEND to `{spec.path}`.\n\n"
            f"Rules:\n"
            f"- Write 10-30 lines of realistic, professional {spec.language} code.\n"
            f"- Must stand alone as a complete function, class, or block.\n"
            f"- Include meaningful names and comments where a real dev would.\n"
            f"- Syntactically correct — no pseudocode, no placeholders.\n"
            f"- No markdown fences inside the snippet field.\n\n"
            f"Return ONLY a raw JSON object with exactly two string fields:\n"
            f'  {{"snippet": "<code to append>", "message": "<conventional commit msg, max 72 chars>"}}\n\n'
            f"No markdown, no explanation."
        )

    def _parse(self, raw: str) -> Optional[Tuple[str, str]]:
        text = raw.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            end = -1 if lines[-1].strip() == "```" else len(lines)
            text = "\n".join(lines[1:end]).strip()
        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            s, e = text.find("{"), text.rfind("}") + 1
            if s == -1 or e == 0:
                return None
            try:
                data = json.loads(text[s:e])
            except json.JSONDecodeError:
                return None
        snippet = str(data.get("snippet", "")).strip()
        message = str(data.get("message", "")).strip()
        return (snippet, message) if snippet and message else None

    def generate(self, context_name: str, spec: FileSpec) -> Optional[Tuple[str, str]]:
        self._throttle()
        try:
            response = self._client.models.generate_content(
                model=self.MODEL,
                contents=self._build_prompt(context_name, spec),
            )
            return self._parse(response.text)
        except Exception as exc:
            print(f"  [Gemini] Error for {spec.path}: {exc}", file=sys.stderr)
            return None


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def render_fallback(template: str, ts: str) -> str:
    return template.format(
        ts=ts,
        cagr=random.uniform(8.0, 42.0), dd=random.uniform(3.0, 18.0),
        sharpe=random.uniform(0.8, 2.6),
        addr="0x" + "".join(random.choices("0123456789abcdef", k=40)),
        gas=random.randint(120_000, 800_000), slot=random.randint(0, 255),
        major=random.randint(1, 3), minor=random.randint(0, 9), patch=random.randint(0, 20),
        widget=random.choice(["PnL Chart", "Order Book", "Volatility Heatmap"]),
        pages=random.randint(5, 200), records=random.randint(50, 5000),
    )


def weighted_choice(contexts: List[Context]) -> Context:
    total = sum(c.weight for c in contexts)
    r = random.uniform(0, total)
    acc = 0
    for ctx in contexts:
        acc += ctx.weight
        if r <= acc:
            return ctx
    return contexts[-1]


def ensure_file(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.touch()


def write_content(repo: Path, spec: FileSpec, snippet: str) -> None:
    target = repo / spec.path
    ensure_file(target)
    if spec.replace:
        target.write_text(snippet + "\n", encoding="utf-8")
    else:
        existing = target.read_text(encoding="utf-8")
        sep = "\n\n" if existing.strip() else ""
        target.write_text(existing + sep + snippet + "\n", encoding="utf-8")


def git(args: List[str], repo: Path, env: Optional[Dict] = None) -> None:
    result = subprocess.run(
        ["git", *args], cwd=str(repo),
        env={**os.environ, **(env or {})},
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)} failed:\n"
            f"  stdout: {result.stdout.strip()}\n"
            f"  stderr: {result.stderr.strip()}"
        )


def validate_repo(repo: Path) -> None:
    if not repo.exists():
        raise FileNotFoundError(f"Repo path does not exist: {repo}")
    if not repo.is_dir():
        raise NotADirectoryError(f"Not a directory: {repo}")
    if not (repo / ".git").exists():
        raise ValueError(f"No .git at {repo}. Run 'git init' first.")


def random_time(dt: date) -> datetime:
    h = random.randint(9, 22)
    m = random.randint(0, 59) if h < 22 else random.randint(0, 30)
    return datetime(dt.year, dt.month, dt.day, h, m, random.randint(0, 59))


# ─────────────────────────────────────────────────────────────────────────────
# Core commit engine
# ─────────────────────────────────────────────────────────────────────────────

def make_commit(
    repo: Path,
    ctx: Context,
    commit_dt: datetime,
    generator: Optional[GeminiGenerator],
) -> Tuple[str, bool]:
    ts = commit_dt.strftime("%Y-%m-%d %H:%M:%S")
    spec = random.choice(ctx.files)
    used_ai = False

    # Try Gemini first
    if generator:
        result = generator.generate(ctx.name, spec)
        if result:
            snippet, message = result
            write_content(repo, spec, snippet)
            used_ai = True

    # Fallback: append a template line
    if not used_ai:
        target = repo / spec.path
        ensure_file(target)
        if ctx.fallback_templates:
            line = render_fallback(random.choice(ctx.fallback_templates), ts)
        else:
            line = f"# [{ts}] update"
        existing = target.read_text(encoding="utf-8")
        target.write_text(existing + line + "\n", encoding="utf-8")
        message = (
            random.choice(ctx.fallback_messages)
            if ctx.fallback_messages
            else f"chore: update {spec.path}"
        )

    git(["add", spec.path], repo)
    git(["commit", "-m", message], repo,
        env={"GIT_AUTHOR_DATE": ts, "GIT_COMMITTER_DATE": ts})
    return message, used_ai


def backfill(
    start_date: date, end_date: date, repo: Path,
    density: float, max_cpd: int,
    contexts: List[Context],
    generator: Optional[GeminiGenerator],
) -> int:
    total_days = (end_date - start_date).days + 1
    total_commits = ai_commits = skipped = 0
    mode = f"Gemini {GeminiGenerator.MODEL} + fallback" if generator else "template only"

    ctx_summary = "\n".join(
        f"    [{c.weight}x] {c.name} → {', '.join(f.path for f in c.files)}"
        for c in contexts
    )
    print(
        f"\n{'─'*66}\n"
        f"  Backfill v3\n"
        f"{'─'*66}\n"
        f"  Repo    : {repo}\n"
        f"  Range   : {start_date} → {end_date}  ({total_days} days)\n"
        f"  Density : {density*100:.0f}%   Max/day: {max_cpd}\n"
        f"  Mode    : {mode}\n"
        f"  Contexts:\n{ctx_summary}\n"
        f"{'─'*66}\n"
    )

    current = start_date
    while current <= end_date:
        is_weekend = current.weekday() >= 5
        if (is_weekend and random.random() < 0.60) or random.random() > density:
            skipped += 1
            current += timedelta(days=1)
            continue

        times = sorted(random_time(current) for _ in range(random.randint(1, max_cpd)))
        for commit_dt in times:
            ctx = weighted_choice(contexts)
            try:
                msg, used_ai = make_commit(repo, ctx, commit_dt, generator)
                tag = "[AI]  " if used_ai else "[tmpl]"
                if used_ai:
                    ai_commits += 1
                print(
                    f"  {tag} {commit_dt.strftime('%Y-%m-%d %H:%M')} "
                    f"[{ctx.name[:24]:<24}] {msg[:54]}"
                )
                total_commits += 1
            except RuntimeError as exc:
                print(f"  [ERR]  {commit_dt.strftime('%Y-%m-%d %H:%M')} — {exc}", file=sys.stderr)

        current += timedelta(days=1)

    print(
        f"\n{'─'*66}\n"
        f"  Done!  {total_commits} commit(s) across {total_days - skipped} active day(s).\n"
        f"  AI: {ai_commits}   Template: {total_commits - ai_commits}   Skipped days: {skipped}\n"
        f"{'─'*66}\n"
    )
    return total_commits


# ─────────────────────────────────────────────────────────────────────────────
# Config parsing
# ─────────────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Backfill a git repo's contribution graph with Gemini-generated code.",
    )
    p.add_argument("--config", "-c", metavar="FILE")
    p.add_argument("--start-date",  metavar="YYYY-MM-DD")
    p.add_argument("--end-date",    metavar="YYYY-MM-DD")
    p.add_argument("--repo-path",   metavar="PATH")
    p.add_argument("--density",     type=float, metavar="0.0-1.0")
    p.add_argument("--max-per-day", type=int, metavar="N")
    p.add_argument("--api-key",     metavar="KEY",
                   help="Gemini API key. Overrides GEMINI_API_KEY env var and config.")
    return p.parse_args()


def parse_custom_contexts(raw: list) -> List[Context]:
    """Parse the 'contexts' array from the config JSON into Context objects."""
    contexts = []
    for i, item in enumerate(raw):
        name = item.get("name", f"Context {i+1}")
        weight = int(item.get("weight", 1))
        if weight < 1:
            raise ValueError(f"Context '{name}': weight must be >= 1")
        raw_files = item.get("files", [])
        if not raw_files:
            raise ValueError(f"Context '{name}': 'files' list is empty or missing")
        files = []
        for j, f in enumerate(raw_files):
            path = f.get("path", "").strip()
            lang = f.get("language", "").strip()
            desc = f.get("description", "").strip()
            if not path:
                raise ValueError(f"Context '{name}', file #{j+1}: 'path' is required")
            if not lang:
                raise ValueError(f"Context '{name}', file '{path}': 'language' is required")
            if not desc:
                raise ValueError(f"Context '{name}', file '{path}': 'description' is required")
            files.append(FileSpec(
                path=path, language=lang, description=desc,
                replace=bool(f.get("replace", False)),
            ))
        contexts.append(Context(name=name, files=files, weight=weight))
    return contexts


def load_and_validate(args: argparse.Namespace):
    cfg: dict = {}
    if args.config:
        p = Path(args.config).expanduser().resolve()
        if not p.exists():
            raise FileNotFoundError(f"Config file not found: {p}")
        with open(p) as f:
            cfg = json.load(f)

    # CLI overrides
    if args.start_date:          cfg["start_date"]          = args.start_date
    if args.end_date:            cfg["end_date"]             = args.end_date
    if args.repo_path:           cfg["target_repo_path"]     = args.repo_path
    if args.density is not None: cfg["commit_density"]       = args.density
    if args.max_per_day is not None: cfg["max_commits_per_day"] = args.max_per_day
    if args.api_key:             cfg["gemini_api_key"]       = args.api_key

    # Required fields
    missing = [k for k in ("start_date", "end_date", "target_repo_path") if k not in cfg]
    if missing:
        raise ValueError(f"Missing required config keys: {', '.join(missing)}")

    try:
        start = date.fromisoformat(cfg["start_date"])
    except ValueError:
        raise ValueError(f"Invalid start_date '{cfg['start_date']}' — expected YYYY-MM-DD")
    try:
        end = date.fromisoformat(cfg["end_date"])
    except ValueError:
        raise ValueError(f"Invalid end_date '{cfg['end_date']}' — expected YYYY-MM-DD")

    if start > end:
        raise ValueError(f"start_date ({start}) must be <= end_date ({end})")
    if end > date.today():
        raise ValueError(f"end_date ({end}) is in the future — GitHub ignores future commits.")

    repo   = Path(cfg["target_repo_path"]).expanduser().resolve()
    density = float(cfg.get("commit_density", 0.4))
    if not 0.0 < density <= 1.0:
        raise ValueError(f"commit_density must be in (0,1] — got {density}")
    max_cpd = int(cfg.get("max_commits_per_day", 3))
    if max_cpd < 1:
        raise ValueError(f"max_commits_per_day must be >= 1 — got {max_cpd}")

    api_key: Optional[str] = cfg.get("gemini_api_key") or os.environ.get("GEMINI_API_KEY")

    # Build context list
    custom_raw = cfg.get("contexts", [])
    use_builtin = bool(cfg.get("use_builtin_contexts", not custom_raw))

    contexts: List[Context] = []
    if custom_raw:
        contexts.extend(parse_custom_contexts(custom_raw))
    if use_builtin:
        contexts.extend(BUILTIN_CONTEXTS)
    if not contexts:
        raise ValueError("No contexts defined. Add a 'contexts' array to your config or enable use_builtin_contexts.")

    return start, end, repo, density, max_cpd, api_key, contexts


# ─────────────────────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    try:
        start, end, repo, density, max_cpd, api_key, contexts = load_and_validate(args)
        validate_repo(repo)
    except (FileNotFoundError, NotADirectoryError, ValueError) as exc:
        print(f"\n[ERROR] {exc}\n", file=sys.stderr)
        sys.exit(1)

    generator: Optional[GeminiGenerator] = None
    if api_key:
        if not GENAI_AVAILABLE:
            print("[WARN] google-genai not installed — template mode.\n"
                  "       Fix: pip install google-genai", file=sys.stderr)
        else:
            try:
                generator = GeminiGenerator(api_key)
                print(f"[OK]  Gemini {GeminiGenerator.MODEL} ready.\n")
            except Exception as exc:
                print(f"[WARN] Gemini init failed: {exc}\n       Using template mode.", file=sys.stderr)
    else:
        print("[INFO] No API key — template-only mode.\n"
              "       Set GEMINI_API_KEY or pass --api-key to enable AI.\n")

    try:
        backfill(start, end, repo, density, max_cpd, contexts, generator)
    except KeyboardInterrupt:
        print("\n[Interrupted]", file=sys.stderr)
        sys.exit(130)


if __name__ == "__main__":
    main()
