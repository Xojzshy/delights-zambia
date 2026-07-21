import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Search, 
  Menu, 
  X, 
  Heart, 
  Camera, 
  Coffee, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Send,
  MessageSquare
} from 'lucide-react';
import { initAuth } from './lib/firebase';
import { User } from 'firebase/auth';
import { GoogleSignInBtn } from './components/GoogleSignInBtn';
import { WorkspaceFeatures } from './components/WorkspaceFeatures';

// Import our generated high-quality assets
// @ts-ignore
import heroImage from './assets/images/delights_hero_banner_1784639330181.jpg';
// @ts-ignore
import chocolateShake from './assets/images/chocolate_shake_1784639348117.jpg';
// @ts-ignore
import strawberryWaffles from './assets/images/strawberry_waffles_1784639361181.jpg';
// @ts-ignore
import caramelIcedCoffee from './assets/images/caramel_iced_coffee_1784639375204.jpg';

// Menu items data
const MENU_CATEGORIES = ['all', 'milkshakes', 'ice cream', 'drinks & treats', 'customizer'];

const MENU_ITEMS = [
  // MILKSHAKES
  {
    id: 'shake-kitkat',
    name: 'Signature KitKat Milkshake',
    category: 'milkshakes',
    image: chocolateShake,
    description: 'Creamy milkshake blended with genuine KitKat bars, topped with fluffy whipped cream and a generous crisp wafer garnish.',
    tags: ['Best Seller', 'Signature'],
    price: 'K75'
  },
  {
    id: 'shake-oreo',
    name: 'Signature Oreo Milkshake',
    category: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=600',
    description: 'Luxurious cookies-and-cream shake loaded with real crushed Oreo cookies, finished with chocolate fudge drizzle and whipped cream.',
    tags: ['Local Favourite', 'Cookies & Cream'],
    price: 'K75'
  },
  {
    id: 'shake-chocolate',
    name: 'Classic Chocolate Milkshake',
    category: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    description: 'A creamy classic. Indulgent Belgian chocolate syrup blended into rich milk and vanilla ice cream, topped with cocoa powder.',
    tags: ['Classic', 'All-Time Favourite'],
    price: 'K70'
  },
  {
    id: 'shake-strawberry',
    name: 'Classic Strawberry Milkshake',
    category: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    description: 'Thick, sweet, and comforting milkshake made with real crushed strawberries and premium whipped topping.',
    tags: ['Classic', 'Fruity'],
    price: 'K70'
  },
  {
    id: 'shake-dairymilk',
    name: 'Signature Dairy Milk Shake',
    category: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600',
    description: 'Crafted with premium blended Cadbury Dairy Milk chocolate chunks, giving it an incredibly smooth, silky chocolate richness.',
    tags: ['Premium', 'Chocolate Lover'],
    price: 'K75'
  },
  {
    id: 'shake-snickers',
    name: 'Signature Snickers Shake',
    category: 'milkshakes',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&q=80&w=600',
    description: 'Rich blend of Snickers bars, creamy vanilla ice cream, chocolate syrup, caramel swirl, and chopped roasted peanuts.',
    tags: ['Nutty', 'Decadent'],
    price: 'K75'
  },
  {
    id: 'shake-coffee',
    name: 'Signature Coffee Milkshake',
    category: 'milkshakes',
    image: caramelIcedCoffee,
    description: 'The perfect caffeine kick and sweet craving combo. Premium house espresso blended with thick milk and sweet vanilla cream.',
    tags: ['Coffee', 'Energy Boost'],
    price: 'K75'
  },

  // ICE CREAM
  {
    id: 'icecream-kitkat',
    name: 'KitKat Crunch Cup',
    category: 'ice cream',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600',
    description: 'Velvety vanilla ice cream loaded with crushed KitKat wafers, rich milk chocolate fudge, and chocolate curls.',
    tags: ['Crunchy', 'Signature Cup'],
    price: 'K35 / K75'
  },
  {
    id: 'icecream-dairymilk',
    name: 'Dairy Milk Decadence Cup',
    category: 'ice cream',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600',
    description: 'Supreme Cadbury Dairy Milk chunks folded into creamy milk chocolate ice cream with gourmet caramel drizzles.',
    tags: ['Luxurious', 'Best Seller'],
    price: 'K39 / K75'
  },
  {
    id: 'icecream-caramel',
    name: 'Caramel Swirl Cup',
    category: 'ice cream',
    image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&q=80&w=600',
    description: 'Vanilla and sweet cream base layered with hot molten caramel, toasted crunchies, and golden chocolate chips.',
    tags: ['Sweet & Salty', 'Must Try'],
    price: 'K35 / K72'
  },
  {
    id: 'icecream-vanilla',
    name: 'Classic Vanilla Scoop',
    category: 'ice cream',
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=600',
    description: 'Pure, rich Madagascar vanilla bean ice cream. Simple, elegant, and exceptionally smooth.',
    tags: ['Classic', 'Gluten Free Option'],
    price: 'K25 / K35'
  },
  {
    id: 'icecream-chocolate',
    name: 'Classic Chocolate Scoop',
    category: 'ice cream',
    image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&q=80&w=600',
    description: 'Decadent, deep chocolate ice cream crafted with high-grade cocoa for a perfect velvety texture.',
    tags: ['Classic', 'Rich'],
    price: 'K30 / K40'
  },

  // DRINKS & TREATS
  {
    id: 'treat-waffles',
    name: 'Classic Custom Waffle Tower',
    category: 'drinks & treats',
    image: strawberryWaffles,
    description: 'Hot, freshly baked Belgian waffle crispy on the outside, fluffy inside. Choose your base, 1-3 toppings and sweet syrup drizzles!',
    tags: ['Chef Special', 'Warm Treat'],
    price: 'From K99'
  },
  {
    id: 'drink-cooler-passion',
    name: 'Passion Fruit Ice Cooler',
    category: 'drinks & treats',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    description: 'Symphony of tropical passion fruit pulp blended with crushed ice and soda for an ultimate Lusaka heat-beating refresher.',
    tags: ['Fruit Drink', 'Chilled', 'Zesty'],
    price: 'K55'
  },
  {
    id: 'drink-mocktail-sunrise',
    name: 'Delights Sunrise Mocktail',
    category: 'drinks & treats',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=600',
    description: 'Exquisite layered drink featuring orange citrus, sweet pomegranate grenadine, crushed mint, and sparkling soda.',
    tags: ['Instagrammable', 'Mocktail'],
    price: 'K55'
  },
  {
    id: 'drink-iced-mocha',
    name: 'Layered Iced Mocha',
    category: 'drinks & treats',
    image: caramelIcedCoffee,
    description: 'Cold rich espresso, premium dark chocolate cocoa, chilled whole milk, and sweet whipped cream swirl on top.',
    tags: ['Premium Coffee', 'Iced'],
    price: 'K55'
  },
  {
    id: 'treat-donut-donutella',
    name: 'Donutella Gourmet Donut',
    category: 'drinks & treats',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    description: 'Light, fluffy donut completely glazed and generously filled with warm Nutella chocolate spread.',
    tags: ['Artisanal Donut', 'Freshly Baked'],
    price: 'K30'
  },
  {
    id: 'drink-hot-cappuccino',
    name: 'Rich Hot Cappuccino',
    category: 'drinks & treats',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    description: 'Perfect double espresso pulled through thick micro-foamed milk, finished with a dusty crown of sweet organic cocoa.',
    tags: ['Hot Coffee', 'Espresso'],
    price: 'K43 / K53'
  }
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Gourmet Shake Creation',
    description: 'Our chocolate milkshakes are made with authentic, premium ingredients.',
    image: chocolateShake,
    category: 'Milkshakes'
  },
  {
    id: 2,
    title: 'Belgian Waffle Heaven',
    description: 'Crisp on the outside, light and fluffy on the inside, loaded with berries.',
    image: strawberryWaffles,
    category: 'Desserts'
  },
  {
    id: 3,
    title: 'Instagram-Worthy Coffee Moments',
    description: 'Rich layers of milk, coffee, and golden caramel drizzle.',
    image: caramelIcedCoffee,
    category: 'Coffee'
  },
  {
    id: 4,
    title: 'Sharing Sweet Memories',
    description: 'Friends gathering at Delights Arcades Shopping Mall in Lusaka.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    category: 'Ambience'
  },
  {
    id: 5,
    title: 'Arcades Store Vibes',
    description: 'A cozy place to indulge your cravings with your favorite people.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
    category: 'Interior'
  },
  {
    id: 6,
    title: 'The Perfect Sunday Sundae',
    description: 'Classic ice cream sundaes served with high-end premium chocolate syrup.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=600',
    category: 'Desserts'
  }
];

// Builder constants
const BUILDER_BASES = {
  waffle: ['Classic Golden Waffle Base', 'Chocolate Waffle Base', 'Red Velvet Waffle Base'],
  icecream: ['Classic Vanilla Base', 'Classic Chocolate Base', 'Classic Strawberry Base']
};

const BUILDER_TOPPINGS = [
  'Oreo Chunks',
  'KitKat Crumbles',
  'Milkybar White Chocolate',
  'Cadbury Dairy Milk Chunks',
  'Snickers Bits',
  'Twix Crumb',
  'Bar One',
  'Fresh Strawberries',
  'Rainbow Sprinkles',
  'Toasted Almonds',
  'Crushed Peanuts'
];

const BUILDER_DRIZZLES = [
  'Belgian Chocolate',
  'Rich Caramel Swirl',
  'Sweet Strawberry',
  'Nutella Drizzle',
  'Maple Golden Syrup',
  'Pure Honey',
  'Bubblegum Sauce'
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Customizer builder state
  const [customType, setCustomType] = useState<'waffle' | 'icecream'>('waffle');
  const [customBase, setCustomBase] = useState('Classic Golden Waffle Base');
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['Oreo Chunks']);
  const [selectedDrizzles, setSelectedDrizzles] = useState<string[]>(['Belgian Chocolate']);

  // Lead collection modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerClaimed, setOfferClaimed] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [offerPhone, setOfferPhone] = useState('');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filter menu items
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClaimOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerName && offerPhone) {
      setOfferClaimed(true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactMessage) {
      setContactSubmitted(true);
    }
  };

  const calculateCustomPrice = () => {
    const toppingCount = selectedToppings.length;
    if (toppingCount === 0) return 'Add Topping';
    
    if (customType === 'icecream') {
      if (toppingCount === 1) return 'K75';
      if (toppingCount === 2) return 'K90';
      return 'K99';
    } else {
      if (toppingCount === 1) return 'K99';
      if (toppingCount === 2) return 'K114';
      return 'K119';
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla text-chocolate selection:bg-raspberry selection:text-white relative">
      
      {/* GLOWING AMBIENCE BACKDROPS - Elegant & Minimal */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-cream opacity-40 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-[1200px] right-10 w-[400px] h-[400px] bg-cream opacity-50 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-[800px] left-10 w-[350px] h-[350px] bg-cream opacity-40 blur-3xl pointer-events-none rounded-full" />

      {/* PROMO TOP BAR */}
      <div className="bg-chocolate text-cream text-xs py-2 px-4 text-center tracking-wider font-semibold uppercase flex items-center justify-center gap-2 relative z-50">
        <Sparkles className="w-3.5 h-3.5 text-caramel animate-pulse" />
        <span>Visit Delights at Arcades Shopping Mall, Lusaka — Experience Dessert Paradise</span>
        <Sparkles className="w-3.5 h-3.5 text-caramel animate-pulse" />
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-vanilla/90 backdrop-blur-md border-b border-cream transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('home')} 
            className="flex items-center gap-2 group text-left cursor-pointer"
            id="nav-logo"
          >
            <span className="text-2xl font-black tracking-widest text-chocolate group-hover:text-raspberry transition-colors duration-300 font-display">
              DELIGHTS
            </span>
            <div className="w-2 h-2 rounded-full bg-strawberry animate-ping hidden md:block" />
          </button>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection('menu')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Menu</button>
            <button onClick={() => scrollToSection('about')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('gallery')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Gallery</button>
            <button onClick={() => scrollToSection('experience')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Experience</button>
            <button onClick={() => scrollToSection('visit')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Visit Us</button>
            <button onClick={() => scrollToSection('contact')} className="font-semibold text-sm hover:text-raspberry transition-colors cursor-pointer">Contact</button>
          </nav>

          {/* Action Button & Menu Icon */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <GoogleSignInBtn user={user} setUser={setUser} setToken={setToken} />
            </div>

            <button 
              onClick={() => setIsOfferModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-strawberry to-raspberry text-white font-bold py-2.5 px-5 rounded-full text-sm shadow-md shadow-raspberry/20 hover:shadow-lg hover:shadow-raspberry/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
              id="header-offer-btn"
            >
              <Sparkles className="w-4 h-4 text-cream animate-spin-slow" />
              Claim Welcome Treat
            </button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-chocolate hover:text-raspberry transition-colors"
              aria-label="Toggle Menu"
              id="hamburger-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-vanilla border-b border-cream absolute top-20 left-0 w-full z-30 shadow-xl px-6 py-8 flex flex-col gap-5 animate-fade-in" id="mobile-menu">
            <button onClick={() => scrollToSection('home')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">Home</button>
            <button onClick={() => scrollToSection('menu')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">Menu</button>
            <button onClick={() => scrollToSection('about')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">About</button>
            <button onClick={() => scrollToSection('gallery')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">Gallery</button>
            <button onClick={() => scrollToSection('experience')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">Experience</button>
            <button onClick={() => scrollToSection('visit')} className="text-left font-bold text-lg hover:text-raspberry py-1 border-b border-cream">Visit Us</button>
            <button onClick={() => scrollToSection('contact')} className="text-left font-bold text-lg hover:text-raspberry py-1">Contact</button>
            
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setIsOfferModalOpen(true);
              }}
              className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-strawberry to-raspberry text-white font-bold py-3.5 px-6 rounded-xl shadow-md cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-cream" />
              Claim Welcome Treat
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION - Large cinematic background style */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-6">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Delights Lusaka Dessert Spread" 
            className="w-full h-full object-cover scale-[1.02] transform transition-transform duration-10000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-chocolate/95 via-chocolate/80 to-transparent md:to-chocolate/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-vanilla via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8 text-cream">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 bg-strawberry/20 backdrop-blur-md border border-strawberry/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase text-strawberry-100">
              <span className="w-2 h-2 rounded-full bg-strawberry animate-pulse" />
              <span>Zambia's Most Instagrammable Dessert Spot</span>
            </div>

            {/* Typography Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white max-w-4xl">
              Sweet Moments <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-strawberry via-raspberry to-caramel drop-shadow-sm font-display">
                Begin Here.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-cream/90 max-w-2xl font-light leading-relaxed">
              Premium desserts, handcrafted drinks, and viral creations crafted for your sweet memories. Visit Zambia's ultimate treat paradise inside <span className="font-semibold text-white underline decoration-caramel underline-offset-4">Arcades Shopping Mall, Lusaka</span>.
            </p>

            {/* Social Proof Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a 
                href="https://www.tiktok.com/@delightszm" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl transition-all border border-white/10 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-black font-display tracking-tight shrink-0">
                  <span>T</span>
                </div>
                <div>
                  <div className="text-xs text-cream/70 font-semibold uppercase tracking-wider">TikTok Viral</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1 group-hover:text-strawberry transition-colors">
                    @delightszm <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-chocolate bg-strawberry/80 flex items-center justify-center text-[10px] text-white font-bold">Z1</div>
                  <div className="w-8 h-8 rounded-full border-2 border-chocolate bg-caramel/80 flex items-center justify-center text-[10px] text-white font-bold">Z2</div>
                  <div className="w-8 h-8 rounded-full border-2 border-chocolate bg-raspberry/80 flex items-center justify-center text-[10px] text-white font-bold">20K</div>
                </div>
                <div className="text-xs md:text-sm">
                  <div className="font-bold text-white">Loved by 20,000+ Fans</div>
                  <div className="text-cream/70">Zambia's sweetest community</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('menu')}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-strawberry to-raspberry text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg shadow-raspberry/30 hover:shadow-xl hover:shadow-raspberry/40 hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                id="hero-primary-btn"
              >
                Explore Our Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => scrollToSection('visit')}
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-bold text-lg py-4 px-8 rounded-full hover:scale-[1.02] active:scale-98 transition-all duration-300 cursor-pointer"
                id="hero-secondary-btn"
              >
                Visit Us Today
                <MapPin className="w-5 h-5 text-caramel" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CORE EXPERIENCE / SELLING THE FEELING */}
      <section id="experience" className="py-24 px-6 bg-cream/30 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">What Awaits You</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display">The Delights Experience</h3>
            <p className="text-chocolate/70 leading-relaxed text-sm md:text-base">
              Step into a premium haven where we combine artisanal skill, high-quality ingredients, and breathtaking aesthetics to give Lusaka a world-class dessert boutique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-vanilla p-8 rounded-3xl border border-cream hover:border-caramel/30 hover:shadow-xl transition-all duration-300 group" id="exp-card-1">
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-strawberry mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 font-display">🍦 Premium Desserts</h4>
              <p className="text-chocolate/70 text-sm leading-relaxed">
                Handcrafted with absolute love, premium chocolates, fresh organic fruits, and secret recipes that taste as rich as they look.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-vanilla p-8 rounded-3xl border border-cream hover:border-caramel/30 hover:shadow-xl transition-all duration-300 group" id="exp-card-2">
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-caramel mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coffee className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 font-display">☕ Crafted Drinks</h4>
              <p className="text-chocolate/70 text-sm leading-relaxed">
                From iced, layered caramel macchiatos to rich creamy milkshakes, each sip is an indulgence designed to refresh and inspire.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-vanilla p-8 rounded-3xl border border-cream hover:border-caramel/30 hover:shadow-xl transition-all duration-300 group" id="exp-card-3">
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-raspberry mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 font-display">📸 Instagram Ready</h4>
              <p className="text-chocolate/70 text-sm leading-relaxed">
                Every dish is a work of art. From the drizzles to the toppings, your camera will eat first.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-vanilla p-8 rounded-3xl border border-cream hover:border-caramel/30 hover:shadow-xl transition-all duration-300 group" id="exp-card-4">
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-chocolate mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold mb-3 font-display">❤️ Made for Sharing</h4>
              <p className="text-chocolate/70 text-sm leading-relaxed">
                Creating warm memories and bringing people together in Lusaka through sweet treats and vibrant conversations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC, FILTERABLE MENU SECTION */}
      <section id="menu" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">Explore Culinary Delights</h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display">Our Handcrafted Menu</h3>
              <p className="text-chocolate/70 text-sm md:text-base leading-relaxed">
                Whether you crave thick, loaded milkshakes, crisp buttery waffles, or chilled coffees, we have something to make your day wonderful.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-chocolate/40">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search desserts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream/40 border border-cream focus:border-caramel/50 focus:bg-white outline-none rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold transition-all"
                id="menu-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-chocolate/40 hover:text-chocolate"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b border-cream">
            {MENU_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-2 px-6 rounded-full text-sm font-bold capitalize transition-all cursor-pointer ${
                  selectedCategory === category 
                    ? 'bg-chocolate text-cream shadow-md scale-[1.02]' 
                    : 'bg-cream/40 text-chocolate hover:bg-cream hover:text-raspberry'
                }`}
                id={`tab-${category}`}
              >
                {category === 'all' ? '✨ All Delights' : category}
              </button>
            ))}
          </div>

          {/* Grid of Product Cards or Customizer Builder */}
          {selectedCategory === 'customizer' ? (
            <div className="bg-vanilla p-6 md:p-10 rounded-3xl border border-cream shadow-lg text-left animate-fade-in" id="customizer-block">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left controls: 7 cols */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <h4 className="text-2xl font-bold font-display text-chocolate">Interactive Waffle & Cup Builder</h4>
                    <p className="text-xs text-chocolate/70 mt-1">Design your custom dessert dream. We will calculate the official price in real time based on our Lusaka menu.</p>
                  </div>

                  {/* Control 1: Type Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-raspberry block">1. Select Dessert Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => {
                          setCustomType('waffle');
                          setCustomBase('Classic Golden Waffle Base');
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          customType === 'waffle' 
                            ? 'border-caramel bg-cream/30 ring-2 ring-caramel/20' 
                            : 'border-cream hover:bg-cream/10'
                        }`}
                      >
                        <div>
                          <h5 className="font-bold text-chocolate text-sm md:text-base">🥞 Hot Waffle Tower</h5>
                          <p className="text-[11px] text-chocolate/60 mt-0.5">Fresh baked, warm, golden</p>
                        </div>
                        <span className="text-xs font-black text-raspberry bg-vanilla px-2 py-1 rounded-md border border-cream">From K99</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          setCustomType('icecream');
                          setCustomBase('Classic Vanilla Base');
                        }}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          customType === 'icecream' 
                            ? 'border-caramel bg-cream/30 ring-2 ring-caramel/20' 
                            : 'border-cream hover:bg-cream/10'
                        }`}
                      >
                        <div>
                          <h5 className="font-bold text-chocolate text-sm md:text-base">🍨 Ice Cream Cup</h5>
                          <p className="text-[11px] text-chocolate/60 mt-0.5">Gourmet churned luxury scoops</p>
                        </div>
                        <span className="text-xs font-black text-raspberry bg-vanilla px-2 py-1 rounded-md border border-cream">From K75</span>
                      </button>
                    </div>
                  </div>

                  {/* Control 2: Base Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-raspberry block">2. Select Your Base Flavour</label>
                    <div className="flex flex-wrap gap-2.5">
                      {BUILDER_BASES[customType].map((base) => (
                        <button
                          key={base}
                          type="button"
                          onClick={() => setCustomBase(base)}
                          className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            customBase === base 
                              ? 'bg-chocolate text-cream shadow-md scale-[1.02]' 
                              : 'bg-cream/40 text-chocolate hover:bg-cream'
                          }`}
                        >
                          {base}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control 3: Toppings selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-raspberry">3. Add Toppings (1 to 3 items)</label>
                      <span className="text-[11px] font-bold text-chocolate/50 bg-cream/40 px-2.5 py-1 rounded">
                        Selected: {selectedToppings.length} / 3
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BUILDER_TOPPINGS.map((topping) => {
                        const isSelected = selectedToppings.includes(topping);
                        return (
                          <button
                            key={topping}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedToppings(selectedToppings.filter(t => t !== topping));
                              } else if (selectedToppings.length < 3) {
                                setSelectedToppings([...selectedToppings, topping]);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected 
                                ? 'bg-strawberry text-white border-strawberry shadow-sm' 
                                : selectedToppings.length >= 3 
                                  ? 'bg-cream/10 border-cream opacity-50 cursor-not-allowed'
                                  : 'bg-cream/30 border-cream hover:bg-cream/50 text-chocolate'
                            }`}
                            disabled={!isSelected && selectedToppings.length >= 3}
                          >
                            <span className="truncate">{topping}</span>
                            {isSelected ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-chocolate/25 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Control 4: Drizzle selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-wider text-raspberry block">4. Select Your Drizzle Sauce</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {BUILDER_DRIZZLES.map((drizzle) => {
                        const isSelected = selectedDrizzles.includes(drizzle);
                        return (
                          <button
                            key={drizzle}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDrizzles(selectedDrizzles.filter(d => d !== drizzle));
                              } else {
                                setSelectedDrizzles([...selectedDrizzles, drizzle]);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              isSelected 
                                ? 'bg-caramel text-white border-caramel shadow-sm' 
                                : 'bg-cream/30 border-cream hover:bg-cream/50 text-chocolate'
                            }`}
                          >
                            <span className="truncate">{drizzle}</span>
                            {isSelected ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-chocolate/25 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Live visualizer bento box: 5 cols */}
                <div className="lg:col-span-5 bg-gradient-to-br from-cream to-vanilla rounded-3xl border border-caramel/20 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-inner">
                  
                  {/* Background visual graphics */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#e0533c_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                  
                  <div className="relative z-10 space-y-6 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-chocolate/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-chocolate">
                      <Sparkles className="w-3.5 h-3.5 text-caramel animate-spin-slow" />
                      <span>Interactive Live Plate</span>
                    </div>

                    {/* Virtual Dessert Representation Card */}
                    <div className="aspect-square w-full max-w-[180px] mx-auto bg-white rounded-full border border-cream flex items-center justify-center shadow-md relative group hover:scale-[1.03] transition-transform duration-500">
                      {/* Plates illustration layout */}
                      <div className="absolute inset-2 rounded-full border border-dashed border-caramel/20 animate-spin-slow" />
                      <div className="absolute inset-6 rounded-full bg-cream/20 flex flex-col items-center justify-center p-4">
                        
                        {/* Dynamic emoji dessert icon */}
                        <span className="text-5xl filter drop-shadow-md select-none transform group-hover:rotate-12 transition-transform duration-300">
                          {customType === 'waffle' ? '🥞' : '🍨'}
                        </span>

                        {/* Dynamic drizzle strings in circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="absolute text-2xl opacity-30 select-none animate-pulse">〰️</span>
                        </div>
                      </div>

                      {/* Float badges for added toppings */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-chocolate text-cream text-[9px] uppercase font-black tracking-wider py-1 px-3 rounded-full border border-cream shadow-md truncate max-w-[150px]">
                        {customBase.replace(' Base', '')}
                      </div>
                    </div>

                    {/* Summary lists */}
                    <div className="space-y-3 pt-2 text-left bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-cream">
                      <div className="text-[10px] uppercase font-black tracking-widest text-chocolate/40 border-b border-cream pb-1.5">Design Specification</div>
                      
                      <div className="text-xs space-y-2">
                        <p className="flex justify-between gap-4">
                          <span className="text-chocolate/60 shrink-0">Base:</span>
                          <span className="font-extrabold text-chocolate truncate text-right">{customBase}</span>
                        </p>
                        <p className="flex justify-between gap-4">
                          <span className="text-chocolate/60 shrink-0">Toppings:</span>
                          <span className="font-extrabold text-chocolate truncate text-right">
                            {selectedToppings.length > 0 ? selectedToppings.join(', ') : 'None selected'}
                          </span>
                        </p>
                        <p className="flex justify-between gap-4">
                          <span className="text-chocolate/60 shrink-0">Drizzles:</span>
                          <span className="font-extrabold text-chocolate truncate text-right">
                            {selectedDrizzles.length > 0 ? selectedDrizzles.join(', ') : 'None selected'}
                          </span>
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Calculation & submission block */}
                  <div className="relative z-10 space-y-4 pt-4 border-t border-caramel/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-black tracking-widest text-chocolate/50 block">Official Menu Price</span>
                        <span className="text-3xl font-black text-raspberry font-display leading-tight">
                          {calculateCustomPrice()}
                        </span>
                      </div>
                      
                      {/* Pricing notes */}
                      <div className="text-right text-[10px] text-chocolate/50 font-semibold leading-relaxed max-w-[140px]">
                        {selectedToppings.length === 0 ? 'Add at least 1 topping' : 'Includes base & toppings'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        // Prefill the voucher flow!
                        setOfferName(`${customType === 'waffle' ? 'Custom Waffle' : 'Custom Cup'}`);
                        setIsOfferModalOpen(true);
                      }}
                      disabled={selectedToppings.length === 0}
                      className={`w-full text-center py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        selectedToppings.length === 0 
                          ? 'bg-chocolate/20 text-chocolate/40 cursor-not-allowed shadow-none' 
                          : 'bg-gradient-to-r from-strawberry to-raspberry hover:from-raspberry hover:to-strawberry text-white hover:scale-[1.01] active:scale-98'
                      }`}
                    >
                      <span>Lock In Build & Claim Offer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ) : filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMenuItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-vanilla rounded-3xl border border-cream overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                  id={`product-card-${item.id}`}
                >
                  
                  {/* Image wrapper */}
                  <div className="relative h-64 overflow-hidden bg-cream/50 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Tags overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="bg-vanilla/90 backdrop-blur-sm text-chocolate text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-cream">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick inquiry bookmark */}
                    <div className="absolute bottom-4 right-4 bg-raspberry text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md shadow-raspberry/20">
                      {item.price}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold font-display tracking-tight text-chocolate leading-snug group-hover:text-raspberry transition-colors duration-300">
                        {item.name}
                      </h4>
                      <p className="text-chocolate/70 text-xs leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => {
                        setIsOfferModalOpen(true);
                      }}
                      className="w-full text-center py-2.5 px-4 bg-cream/40 hover:bg-strawberry hover:text-white rounded-xl text-xs font-black tracking-wider uppercase text-chocolate transition-all duration-300 cursor-pointer"
                    >
                      Inquire / Claim Offer
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-cream/10 rounded-3xl border border-dashed border-cream">
              <p className="text-chocolate/50 font-medium">No sweet treats found matching your search.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 text-sm text-raspberry font-bold underline"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* PDF Menu Notice Card */}
          <div className="mt-16 bg-gradient-to-r from-cream to-vanilla p-8 rounded-3xl border border-caramel/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-caramel shadow-sm shrink-0">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg font-display">Special Catering or Large Orders?</h4>
                <p className="text-chocolate/70 text-sm">We provide customized dessert bars, milkshakes, and waffle towers for Lusaka events.</p>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-chocolate text-cream font-bold py-3 px-6 rounded-full text-sm hover:bg-caramel transition-colors cursor-pointer shrink-0"
            >
              Get Event Quote
            </button>
          </div>

        </div>
      </section>

      {/* INSTAGRAM & TIKTOK VIRAL SOCIAL CORNER */}
      <section className="py-24 px-6 bg-chocolate text-cream relative overflow-hidden">
        
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-strawberry/10 opacity-30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left pitch text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-strawberry/20 border border-strawberry/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-strawberry">
                <span className="w-2 h-2 rounded-full bg-strawberry animate-ping" />
                <span>Viral Sensation</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight font-display text-white">
                Lusaka's Favourite Dessert Hub on TikTok
              </h3>
              
              <p className="text-cream/80 text-sm md:text-base leading-relaxed">
                Join our vibrant sweet tooth community. From mesmerising waffle syrup pours to milk chocolate blending, we document the joy of desserts daily! Our customers love recording their Delights moments.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">20K</div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Growing TikTok Audience</h5>
                    <p className="text-xs text-cream/60">Connecting sweet tooths from across Lusaka</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">❤️</div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Viral Dessert Videos</h5>
                    <p className="text-xs text-cream/60">Indulgent visual delights that spark happiness</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://www.tiktok.com/@delightszm" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-chocolate hover:bg-strawberry hover:text-white font-extrabold py-3.5 px-8 rounded-full text-sm shadow-md transition-all duration-300 cursor-pointer"
                >
                  Follow Us @delightszm
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right mock smartphone showcasing TikTok vibes */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-[420px] bg-chocolate border border-cream/10 p-4 rounded-[40px] shadow-2xl">
                
                {/* Simulated Smartphone Screen */}
                <div className="bg-black aspect-[9/16] rounded-[32px] overflow-hidden relative border border-white/10 group">
                  
                  {/* Smartphone camera punch-hole */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>

                  {/* Main video background */}
                  <img 
                    src={chocolateShake} 
                    alt="Mock TikTok Dessert Video" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/30" />

                  {/* TikTok Overlays */}
                  <div className="absolute top-10 left-0 w-full px-6 flex justify-between items-center z-20">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <span className="text-strawberry">●</span> LIVE
                    </div>
                    <div className="flex gap-4 text-white text-xs opacity-80 font-bold">
                      <span className="border-b border-white pb-1">Following</span>
                      <span>For You</span>
                    </div>
                  </div>

                  {/* Play Button Mock */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:scale-110 active:scale-90 transition-all cursor-pointer">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-white ml-1" />
                    </div>
                  </div>

                  {/* Bottom Video metadata */}
                  <div className="absolute bottom-6 left-6 right-16 text-white text-left space-y-2 z-20">
                    <h5 className="font-bold text-sm">@delightszm</h5>
                    <p className="text-xs text-white/80 font-light">
                      Creamy chocolate goodness dripping to perfection. Who are you sharing this Waffle with? 🤤🍓🥛 #lusaka #delights #desserts #zambia #waffles
                    </p>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full py-1 px-3 w-fit text-[10px] font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-caramel animate-pulse" />
                      <span>Original Sound - Delights</span>
                    </div>
                  </div>

                  {/* Right hand interaction buttons */}
                  <div className="absolute bottom-6 right-3 flex flex-col gap-4 items-center z-20 text-white">
                    
                    {/* Profile */}
                    <div className="w-10 h-10 rounded-full border border-white bg-strawberry flex items-center justify-center font-bold text-xs shadow-md">
                      D
                    </div>
                    
                    {/* Heart */}
                    <div className="flex flex-col items-center gap-0.5">
                      <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-strawberry hover:bg-black/60 transition-colors">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                      <span className="text-[10px] font-bold">14.2K</span>
                    </div>

                    {/* Coffee */}
                    <div className="flex flex-col items-center gap-0.5">
                      <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-caramel hover:bg-black/60 transition-colors">
                        <Coffee className="w-5 h-5" />
                      </button>
                      <span className="text-[10px] font-bold">1.8K</span>
                    </div>
                    
                    {/* Share */}
                    <div className="flex flex-col items-center gap-0.5">
                      <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:text-cream hover:bg-black/60 transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </button>
                      <span className="text-[10px] font-bold">4.2K</span>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BRAND STORY / ABOUT SECTION */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left - Image collage */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-cream shadow-xl bg-cream/30">
                <img 
                  src={heroImage} 
                  alt="Delights Interior Ambience" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating review card */}
              <div className="absolute -bottom-8 -right-4 md:right-8 bg-vanilla p-6 rounded-2xl border border-cream shadow-2xl max-w-[280px] space-y-3 animate-bounce-slow">
                <div className="flex text-caramel gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs text-chocolate/80 italic font-medium leading-relaxed">
                  "The best waffles in Lusaka! The strawberry waffles are a masterpiece. The vibe is so beautiful."
                </p>
                <div className="text-[10px] font-bold text-chocolate/50 uppercase tracking-widest">— Happy Customer, Lusaka</div>
              </div>

              {/* Smaller overlapping design element */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-cream rounded-3xl -z-10 border border-caramel/10" />
            </div>

            {/* Right - Story Text */}
            <div className="lg:col-span-6 space-y-6 lg:pl-8 text-left">
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">Our Sweet Origin</h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display text-chocolate">
                  Moments Worth Remembering
                </h3>
              </div>

              <p className="text-chocolate/80 leading-relaxed text-sm md:text-base">
                At <span className="font-bold text-raspberry">Delights</span>, every dessert is crafted to create moments worth remembering. From indulgent treats to refreshing drinks, we bring people together through unforgettable flavours.
              </p>

              <p className="text-chocolate/70 leading-relaxed text-sm">
                We believe that dessert is not just a food category — it is a celebration. Our modern boutique at Arcades Shopping Mall provides the perfect backdrop to escape the busy day, laugh with friends, share stories, and indulge in pure sweet joy.
              </p>

              {/* Unique attributes list */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cream">
                <div className="space-y-1">
                  <h5 className="font-extrabold text-chocolate font-display text-sm md:text-base">📍 Arcades Mall</h5>
                  <p className="text-xs text-chocolate/60">Lusaka's central premium meeting spot.</p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-chocolate font-display text-sm md:text-base">🍒 Freshness First</h5>
                  <p className="text-xs text-chocolate/60">Finest fruits & high-quality toppings.</p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-chocolate font-display text-sm md:text-base">🎨 Dessert Craft</h5>
                  <p className="text-xs text-chocolate/60">Artisanal detail in every drizzle.</p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-extrabold text-chocolate font-display text-sm md:text-base">✨ Aesthetic Vibe</h5>
                  <p className="text-xs text-chocolate/60">Made for memorable social media moments.</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => scrollToSection('visit')}
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-raspberry hover:text-chocolate hover:underline underline-offset-4 transition-all cursor-pointer"
                >
                  Plan Your Visit <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* PHOTO GALLERY SECTION - MASONRY/GRID WITH LIGHTBOX */}
      <section id="gallery" className="py-24 px-6 bg-cream/30 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">Social Gallery</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display">A Feast For Your Eyes</h3>
            <p className="text-chocolate/70 leading-relaxed text-sm md:text-base">
              Explore snapshots of our handcrafted desserts, refreshing milkshakes, and welcoming ambience. Tap on any photo to take a closer look!
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_ITEMS.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-square rounded-3xl overflow-hidden border border-cream shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
                id={`gallery-item-${item.id}`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-chocolate/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <span className="text-xs font-bold text-strawberry uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-white font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cream/80 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-white font-semibold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>View Photo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LOCATION & ACTIVE HOURS SECTION */}
      <section id="visit" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left details */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between text-left">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">Visit Us</h2>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display text-chocolate">
                    Where Sweetness Finds You
                  </h3>
                </div>
                
                <p className="text-chocolate/80 text-sm md:text-base leading-relaxed">
                  We are conveniently situated inside the bustling <span className="font-bold">Arcades Shopping Mall</span> along Great East Road in Lusaka. Whether you are shopping, meeting friends, or finishing lunch, stop by to end on a perfect sweet note!
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-strawberry shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-chocolate text-sm md:text-base">Our Location</h5>
                      <p className="text-xs md:text-sm text-chocolate/70">Delights, Arcades Shopping Mall, Great East Rd, Lusaka, Zambia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-caramel shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-chocolate text-sm md:text-base">Opening Hours</h5>
                      <div className="text-xs md:text-sm text-chocolate/70 space-y-1">
                        <p>Monday – Sunday: <span className="font-bold text-chocolate">10:00 AM – 10:00 PM</span></p>
                        <p className="text-[11px] text-strawberry font-medium">Open on all public holidays</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* High-converting prompt to plan navigation */}
              <div className="bg-cream/40 p-6 rounded-3xl border border-cream space-y-4">
                <h4 className="font-bold font-display text-chocolate">Driving to Arcades?</h4>
                <p className="text-xs text-chocolate/70 leading-relaxed">
                  Find us in the central dining corridor. Plenty of secured mall parking is available. Simply copy our address or show this card to your taxi driver.
                </p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("Delights, Arcades Shopping Mall, Lusaka, Zambia");
                    alert("Delights address copied to your clipboard!");
                  }}
                  className="inline-flex items-center gap-2 bg-chocolate text-cream hover:bg-caramel font-bold text-xs py-2.5 px-5 rounded-full transition-colors cursor-pointer"
                >
                  Copy Address To Clipboard
                </button>
              </div>
            </div>

            {/* Right Map Placeholder & Contact Block */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-cream p-6 rounded-[32px] border border-cream shadow-lg min-h-[400px]">
              
              {/* Architectural Graphic Map Placeholder */}
              <div className="bg-vanilla rounded-2xl p-6 flex-grow flex flex-col items-center justify-center text-center border border-cream space-y-4 min-h-[250px] relative overflow-hidden group">
                
                {/* Background design grids */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3a1f1d_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Map Pins and visual illustration */}
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center border-2 border-dashed border-caramel/40 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-strawberry to-raspberry flex items-center justify-center text-white shadow-md shadow-raspberry/20">
                      <MapPin className="w-5 h-5 animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-chocolate font-display text-base">Arcades Mall Corridor Map</h5>
                    <p className="text-xs text-chocolate/60 max-w-sm mx-auto">
                      Interactive Google Map directions placeholder. Delights is located near the main courtyard dining pavilion.
                    </p>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Arcades+Shopping+Mall+Lusaka+Zambia" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-strawberry to-raspberry text-white font-bold text-xs py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Open Google Maps Directions
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Simulated coordinate info badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-chocolate text-cream/90 text-[10px] uppercase font-bold tracking-widest py-1.5 px-3 rounded-lg flex items-center justify-between">
                  <span>LAT: -15.3949 | LON: 28.3248</span>
                  <span>LUSAKA, ZM</span>
                </div>
              </div>

              {/* Invitation message */}
              <div className="pt-6 text-center">
                <p className="text-chocolate/80 text-sm font-semibold italic">
                  "Come experience your next favourite dessert today."
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CONTACT & CONNECT SECTION */}
      <section id="contact" className="py-24 px-6 bg-cream/20 border-t border-cream relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left details: Placeholders clearly marked */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-raspberry">Connect With Us</h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight font-display text-chocolate">
                  Get In Touch
                </h3>
                <p className="text-chocolate/70 leading-relaxed text-sm md:text-base">
                  Have questions about catering, private bookings, or special orders? Fill out our inquiry form. 
                </p>
              </div>

              {/* Placeholders strictly marked with NO fictitious info as requested */}
              <div className="space-y-6">
                
                <div className="p-5 bg-vanilla rounded-2xl border border-cream flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-chocolate/50 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-chocolate/50">Official Email</h5>
                    <p className="text-sm font-bold text-chocolate italic">Contact information coming soon</p>
                  </div>
                </div>

                <div className="p-5 bg-vanilla rounded-2xl border border-cream flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-chocolate/50 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-chocolate/50">Phone Line</h5>
                    <p className="text-sm font-bold text-chocolate italic">Contact information coming soon</p>
                  </div>
                </div>

                {/* Active TikTok Channel and non-active buttons clearly marked */}
                <div className="space-y-3">
                  <h5 className="font-bold text-sm text-chocolate/80">Follow Our Social Journey</h5>
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Active TikTok */}
                    <a 
                      href="https://www.tiktok.com/@delightszm" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 bg-black text-white hover:bg-raspberry font-extrabold text-xs py-2.5 px-5 rounded-full shadow transition-colors cursor-pointer"
                    >
                      <span className="font-bold">TikTok:</span> @delightszm
                    </a>

                    {/* Active Instagram */}
                    <a 
                      href="https://www.instagram.com/delightszm/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 bg-gradient-to-tr from-pink-500 to-amber-500 text-white hover:opacity-90 font-extrabold text-xs py-2.5 px-5 rounded-full shadow transition-all cursor-pointer"
                    >
                      <span className="font-bold">Instagram:</span> @delightszm
                    </a>

                    <div className="group relative">
                      <span className="inline-flex items-center gap-1 bg-cream/50 text-chocolate/50 font-bold text-xs py-2.5 px-4 rounded-full border border-cream cursor-not-allowed">
                        Facebook <span className="text-[10px] opacity-75 font-normal">(Coming Soon)</span>
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Right form submission with success feedback */}
            <div className="lg:col-span-7 bg-vanilla p-8 md:p-10 rounded-[32px] border border-cream shadow-lg text-left">
              <WorkspaceFeatures user={user} token={token} setUser={setUser} setToken={setToken} />
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-chocolate text-cream/90 py-16 px-6 border-t border-cream/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-2 text-left">
              <h4 className="text-2xl font-black tracking-widest text-white font-display">DELIGHTS</h4>
              <p className="text-xs md:text-sm text-cream/70 max-w-sm leading-relaxed">
                "Sweet moments. Beautiful memories." <br />
                Dedicated to serving Lusaka's most exquisite dessert creations inside Arcades Shopping Mall.
              </p>
              <div className="flex items-center gap-3 pt-2 text-cream/60 text-xs">
                <span>📍 Arcades Mall, Lusaka, Zambia</span>
              </div>
            </div>

            {/* Links Column */}
            <div className="space-y-4 text-left">
              <h5 className="font-extrabold text-white text-sm uppercase tracking-wider font-display">Explore</h5>
              <div className="flex flex-col gap-2.5 text-xs">
                <button onClick={() => scrollToSection('home')} className="text-left hover:text-strawberry transition-colors">Home</button>
                <button onClick={() => scrollToSection('menu')} className="text-left hover:text-strawberry transition-colors">Dessert Menu</button>
                <button onClick={() => scrollToSection('about')} className="text-left hover:text-strawberry transition-colors">Our Story</button>
                <button onClick={() => scrollToSection('gallery')} className="text-left hover:text-strawberry transition-colors">Gallery</button>
                <button onClick={() => scrollToSection('visit')} className="text-left hover:text-strawberry transition-colors">Find Store</button>
              </div>
            </div>

            {/* Community Column */}
            <div className="space-y-4 text-left">
              <h5 className="font-extrabold text-white text-sm uppercase tracking-wider font-display">Community</h5>
              <div className="flex flex-col gap-2.5 text-xs">
                <a href="https://www.tiktok.com/@delightszm" target="_blank" rel="noreferrer" className="hover:text-strawberry transition-colors flex items-center gap-1.5">
                  TikTok: @delightszm <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://www.instagram.com/delightszm/" target="_blank" rel="noreferrer" className="hover:text-strawberry transition-colors flex items-center gap-1.5">
                  Instagram: @delightszm <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-cream/40 cursor-not-allowed">Facebook (Coming Soon)</span>
                <button onClick={() => setIsOfferModalOpen(true)} className="text-left text-strawberry font-bold hover:underline">
                  Claim Member Treat
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Outreach Pitch Bar */}
          <div className="pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
            <p>© {new Date().getFullYear()} Delights Zambia. All rights reserved.</p>
            <div className="flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-caramel animate-pulse" />
              <span>Demonstration Concept for Delights Pitch</span>
            </div>
          </div>

        </div>
      </footer>


      {/* INTERACTIVE WELCOME OFFER MODAL */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" id="welcome-modal">
          
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setIsOfferModalOpen(false)} />

          {/* Modal box */}
          <div className="bg-vanilla w-full max-w-lg rounded-[32px] border border-cream shadow-2xl relative overflow-hidden z-10 text-left p-6 md:p-8 animate-scale-up">
            
            {/* Close button */}
            <button 
              onClick={() => setIsOfferModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-cream hover:bg-chocolate hover:text-cream transition-all text-chocolate cursor-pointer"
              id="close-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>

            {!offerClaimed ? (
              <form onSubmit={handleClaimOfferSubmit} className="space-y-6">
                
                <div className="space-y-2 text-center">
                  <div className="w-14 h-14 rounded-full bg-cream mx-auto flex items-center justify-center text-strawberry border border-caramel/10">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black font-display tracking-tight text-chocolate">
                    Get Your Welcome Scoop!
                  </h3>
                  <p className="text-xs text-chocolate/70 max-w-sm mx-auto">
                    Join the <span className="font-bold text-raspberry">@delightszm</span> sweet tooth club and receive a complimentary topping or 10% off your next waffle creation at Arcades Mall!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-chocolate/80">Your Sweet Tooth Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Chileshe"
                      value={offerName}
                      onChange={(e) => setOfferName(e.target.value)}
                      className="w-full bg-cream/30 border border-cream rounded-xl py-3 px-4 text-sm focus:border-caramel/50 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-chocolate/80">Mobile Number (WhatsApp) *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +260 97XXXXXXX"
                      value={offerPhone}
                      onChange={(e) => setOfferPhone(e.target.value)}
                      className="w-full bg-cream/30 border border-cream rounded-xl py-3 px-4 text-sm focus:border-caramel/50 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3.5 bg-cream/40 rounded-xl border border-cream">
                    <CheckCircle className="w-4 h-4 text-caramel shrink-0" />
                    <p className="text-[11px] text-chocolate/70 leading-relaxed">
                      Simply present your digital voucher code on your phone when ordering in our store.
                    </p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-strawberry to-raspberry text-white font-black py-4 rounded-xl text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition-all duration-300 cursor-pointer"
                  id="claim-offer-submit-btn"
                >
                  Generate My Digital Voucher
                </button>

              </form>
            ) : (
              <div className="text-center py-6 space-y-6">
                
                <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-strawberry border border-caramel/10">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black font-display text-chocolate">Congratulations, {offerName}!</h3>
                  <p className="text-xs text-chocolate/70">
                    Your exclusive dessert voucher code has been dynamically generated for <span className="font-bold text-chocolate">{offerPhone}</span>.
                  </p>
                </div>

                {/* Simulated high-end QR / barcode ticket */}
                <div className="bg-white border-2 border-dashed border-cream p-6 rounded-2xl space-y-4 max-w-sm mx-auto shadow-sm">
                  <div className="text-[10px] text-chocolate/50 font-black tracking-widest uppercase">Delights Arcades Mall Pass</div>
                  
                  {/* Decorative Barcode Lines */}
                  <div className="h-12 flex justify-center items-center gap-1 opacity-70">
                    <div className="w-1 h-full bg-chocolate" />
                    <div className="w-2.5 h-full bg-chocolate" />
                    <div className="w-0.5 h-full bg-chocolate" />
                    <div className="w-2 h-full bg-chocolate" />
                    <div className="w-1.5 h-full bg-chocolate" />
                    <div className="w-0.5 h-full bg-chocolate" />
                    <div className="w-2.5 h-full bg-chocolate" />
                    <div className="w-1 h-full bg-chocolate" />
                    <div className="w-2 h-full bg-chocolate" />
                    <div className="w-0.5 h-full bg-chocolate" />
                    <div className="w-1.5 h-full bg-chocolate" />
                  </div>

                  <div className="text-base font-black tracking-widest text-chocolate font-display">
                    DELIGHTS-ZM-9942
                  </div>
                  
                  <div className="text-[10px] bg-strawberry/15 text-strawberry px-3 py-1 rounded-full font-bold w-fit mx-auto">
                    Active & Ready to Redeem
                  </div>
                </div>

                <p className="text-[11px] text-chocolate/50">
                  Voucher code is saved to your session. Take a screenshot or show this screen to our store team.
                </p>

                <button 
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setOfferClaimed(false);
                    setOfferName('');
                    setOfferPhone('');
                  }}
                  className="bg-chocolate text-cream hover:bg-caramel font-bold text-xs py-2.5 px-6 rounded-full transition-colors cursor-pointer"
                >
                  Return to Website
                </button>

              </div>
            )}

          </div>

        </div>
      )}


      {/* INTERACTIVE GALLERY LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" id="lightbox">
          
          {/* Close trigger overlay */}
          <div className="absolute inset-0" onClick={() => setLightboxIndex(null)} />

          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10 cursor-pointer"
            id="close-lightbox-btn"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content container */}
          <div className="max-w-4xl w-full relative z-10 flex flex-col items-center justify-center space-y-4">
            
            <div className="relative aspect-auto max-h-[70vh] rounded-2xl overflow-hidden border border-white/10">
              <img 
                src={GALLERY_ITEMS[lightboxIndex].image} 
                alt={GALLERY_ITEMS[lightboxIndex].title} 
                className="max-h-[70vh] max-w-full object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-center text-white max-w-xl space-y-2">
              <span className="text-xs font-bold text-strawberry uppercase tracking-wider">
                {GALLERY_ITEMS[lightboxIndex].category}
              </span>
              <h4 className="text-xl font-bold font-display">
                {GALLERY_ITEMS[lightboxIndex].title}
              </h4>
              <p className="text-sm text-white/70">
                {GALLERY_ITEMS[lightboxIndex].description}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 pt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-5 rounded-full text-xs transition-colors cursor-pointer"
              >
                ◀ Previous
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % GALLERY_ITEMS.length);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-5 rounded-full text-xs transition-colors cursor-pointer"
              >
                Next ▶
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
