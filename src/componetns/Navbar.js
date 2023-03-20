export default function Navbar() {
    const path  = window.location.pathname
    return (
        <nav className='nav'>
            <a href='/' className='site-title'>
                Nife
            </a>
            <ul>
                <li className='active'>
                    <a href='/pricing'>Pricing</a>
                </li>
                <li>
                    <a href='/about'>About</a>
                </li>
            </ul>
        </nav>
    )
}



