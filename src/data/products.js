export const CATEGORIES = [
  { id: 'all', label: 'All Aviation Gear', icon: 'Sparkles' },
  { id: 'fpv-quads', label: 'FPV Racing & Freestyle', icon: 'Zap' },
  { id: 'cinematic', label: 'Cinematic & Mapping UAVs', icon: 'Camera' },
  { id: 'fixed-wing', label: 'Fixed-Wing & Gliders', icon: 'Plane' },
  { id: 'radios', label: 'Telemetry Radios & Transmitters', icon: 'Radio' },
  { id: 'goggles', label: 'FPV Goggles & Video', icon: 'Eye' },
  { id: 'components', label: 'Flight Controllers & Esc', icon: 'Cpu' },
  { id: 'batteries', label: 'Smart Lipo Batteries & Power', icon: 'BatteryCharging' }
];

export const PRODUCTS = [
  {
    id: 'drone-apex-5',
    title: 'Apex-5 Pro 6S FPV Freestyle Quad',
    category: 'fpv-quads',
    price: 389.99,
    originalPrice: 429.99,
    rating: 4.9,
    reviewsCount: 128,
    inStock: true,
    isFeatured: true,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '8-12 min',
      maxSpeed: '160 km/h',
      range: '10 km',
      payload: '350g (GoPro 12)',
      protocol: 'ExpressLRS 2.4GHz',
      videoSystem: 'DJI O3 HD Air Unit'
    },
    description: 'Ultra-durable carbon fiber 5-inch freestyle drone powered by 2207 1950KV brushless motors and STM32F722 flight controller. Engineered for extreme maneuvers and high-speed cinematic chasing.'
  },
  {
    id: 'drone-skyhunter-v2',
    title: 'SkyHunter X8 Long-Range Fixed-Wing UAV',
    category: 'fixed-wing',
    price: 549.00,
    originalPrice: 599.00,
    rating: 4.8,
    reviewsCount: 64,
    inStock: true,
    isFeatured: true,
    badge: 'Long Range',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '90 min',
      maxSpeed: '110 km/h',
      range: '45 km',
      payload: '1200g (LiDAR / Mapping)',
      protocol: 'MavLink / ArduPilot',
      videoSystem: 'Analog / Digital Telemetry'
    },
    description: 'High-efficiency EPO foam pusher fixed-wing aircraft equipped with dual-servos, ArduPilot APM flight controller support, and dedicated payload bays for cartography and environmental survey sensors.'
  },
  {
    id: 'drone-cinelog-35',
    title: 'CineLog35 V2 HD O3 Cinewhoop Drone',
    category: 'cinematic',
    price: 479.99,
    originalPrice: 519.99,
    rating: 4.95,
    reviewsCount: 94,
    inStock: true,
    isFeatured: false,
    badge: 'Pro Video',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '6-9 min',
      maxSpeed: '95 km/h',
      range: '8 km',
      payload: 'Full-size Naked GoPro',
      protocol: 'TBS Crossfire Nano',
      videoSystem: '4K/60fps O3 Air Unit'
    },
    description: 'Enclosed duct pusher cinewhoop designed to capture silky smooth cinematic video in tight spaces and near people without safety risks. Includes Gyroflow camera integration.'
  },
  {
    id: 'radio-radiomaster-tx16s',
    title: 'RadioMaster TX16S MKII EdgeTX Transmitter',
    category: 'radios',
    price: 219.95,
    originalPrice: 249.95,
    rating: 5.0,
    reviewsCount: 310,
    inStock: true,
    isFeatured: true,
    badge: 'Geek Favorite',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '12hr internal battery',
      maxSpeed: 'N/A',
      range: 'Internal ELRS 1W',
      payload: 'CNC Hall Gimbals V4.0',
      protocol: 'Multi-Protocol + ELRS',
      videoSystem: '4.3" Color Touchscreen'
    },
    description: 'The ultimate open-source transmitter featuring AG01 full CNC Hall sensor gimbals, dual speaker system, built-in ExpressLRS high power RF module, and EdgeTX color touch firmware.'
  },
  {
    id: 'goggles-dji-goggles-2',
    title: 'DJI Goggles 2 FPV Digital Video Glasses',
    category: 'goggles',
    price: 649.00,
    originalPrice: 699.00,
    rating: 4.9,
    reviewsCount: 152,
    inStock: true,
    isFeatured: false,
    badge: 'OLED 1080p',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '2hr Battery Belt Clip',
      maxSpeed: 'N/A',
      range: '10 km HD Link',
      payload: '290g Ultra Lightweight',
      protocol: 'O3 Video Transmission',
      videoSystem: 'Dual Micro-OLED 1080p 100Hz'
    },
    description: 'Experience ultra-low 30ms video latency with dual Micro-OLED screens, diopter adjustment wheels (+2.0 to -8.0 D), head tracking telemetry capability, and 100fps video feed.'
  },
  {
    id: 'battery-6s-1500mah',
    title: 'AeroPower 6S 1500mAh 120C Smart LiPo Pack',
    category: 'batteries',
    price: 38.50,
    originalPrice: 45.00,
    rating: 4.7,
    reviewsCount: 88,
    inStock: true,
    isFeatured: false,
    badge: 'High C-Rating',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: 'High Discharge Peak',
      maxSpeed: 'N/A',
      range: 'N/A',
      payload: '215g',
      protocol: 'XT60 Plug + Balance',
      videoSystem: 'N/A'
    },
    description: 'Industrial grade lithium polymer battery designed for extreme voltage stability under 180A peak current bursts. Built with internal resistance monitoring cell balance tabs.'
  },
  {
    id: 'fc-matek-f722',
    title: 'Matek System F722-PX Flight Controller',
    category: 'components',
    price: 64.90,
    originalPrice: 72.00,
    rating: 4.85,
    reviewsCount: 42,
    inStock: true,
    isFeatured: false,
    badge: 'STM32F7',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: 'N/A',
      maxSpeed: 'N/A',
      range: 'N/A',
      payload: '9.5g Micro Board',
      protocol: 'Betaflight / INAV / ArduPilot',
      videoSystem: 'Dual BEC + MAX7456 OSD'
    },
    description: 'Feature-packed flight control board with MPU6000 gyro, barometer, blackbox MicroSD slot, dual 5V/9V filtered BEC for video transmitters, and 8 PWM output pads.'
  },
  {
    id: 'drone-micro-toothpick',
    title: 'Flywoo Explorer LR 4" Micro Quad',
    category: 'fpv-quads',
    price: 299.00,
    originalPrice: 339.00,
    rating: 4.9,
    reviewsCount: 76,
    inStock: true,
    isFeatured: false,
    badge: 'Sub 250g',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80',
    specs: {
      flightTime: '18-25 min',
      maxSpeed: '110 km/h',
      range: '6 km',
      payload: 'Goku GPS + Rescue',
      protocol: 'ELRS 2.4G Dual Antenna',
      videoSystem: 'Caddx Vista Digital HD'
    },
    description: 'Ultra-lightweight sub-250 gram long-range cruiser capable of up to 25 minutes flight time on standard 4S 18650 LiIon packs. Built-in GPS return-to-home fail-safe mechanism.'
  }
];
