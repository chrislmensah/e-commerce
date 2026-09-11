import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen =
  | "login"
  | "signup"
  | "home"
  | "shop"
  | "product"
  | "cart"
  | "checkout"
  | "orderConfirmation"
  | "orderHistory"
  | "orderDetail"
  | "account"
  | "addresses"
  | "savedItems"
  | "settings"
  | "search";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  stock: number;
  description: string;
}

interface CartItem {
  product: Product;
  size: string;
  color: string;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Senator Linen Shirt",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=700&fit=crop&auto=format",
    category: "Shirts",
    colors: ["#1a3d2b", "#f5efe3", "#c9a84c"],
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    description:
      "Crafted from premium Ghanaian linen. Cool, breathable, and effortlessly distinguished.",
  },
  {
    id: 2,
    name: "Classic Chino Trousers",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=700&fit=crop&auto=format",
    category: "Trousers",
    colors: ["#8B7355", "#1a1a1a", "#2d6147"],
    sizes: ["S", "M", "L", "XL"],
    stock: 3,
    description:
      "Tailored chinos with a clean, structured silhouette. Office to evening.",
  },
  {
    id: 3,
    name: "Ankara Print Tee",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=700&fit=crop&auto=format",
    category: "Shirts",
    colors: ["#c9a84c", "#1a3d2b", "#8B1a1a"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    description:
      "Bold Ankara-inspired print on a soft cotton base. Proudly Ghanaian.",
  },
  {
    id: 4,
    name: "Senator Derby Shoe",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=700&fit=crop&auto=format",
    category: "Shoes",
    colors: ["#3d2b1a", "#1a1a1a"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 5,
    description:
      "Handcrafted leather derby with a refined toe cap. Uncompromising quality.",
  },
  {
    id: 5,
    name: "Kente Blend Jacket",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=700&fit=crop&auto=format",
    category: "Jackets",
    colors: ["#1a3d2b", "#c9a84c"],
    sizes: ["S", "M", "L", "XL"],
    stock: 4,
    description:
      "A structured jacket with subtle kente-woven details on the lapel. Statement heritage.",
  },
  {
    id: 6,
    name: "Slim Fit Dress Trousers",
    price: 460,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=700&fit=crop&auto=format",
    category: "Trousers",
    colors: ["#1a1a1a", "#3d2b1a", "#1a3d2b"],
    sizes: ["S", "M", "L", "XL"],
    stock: 7,
    description:
      "Ultra-slim silhouette with a matte finish. Pairs perfectly with the Senator Linen Shirt.",
  },
  {
    id: 7,
    name: "Leather Loafer",
    price: 580,
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=700&fit=crop&auto=format",
    category: "Shoes",
    colors: ["#3d2b1a", "#1a1a1a", "#c9a84c"],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 6,
    description:
      "Polished leather loafer with a gold-toned bit detail. Business meets weekend ease.",
  },
  {
    id: 8,
    name: "Premium Polo Shirt",
    price: 290,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=700&fit=crop&auto=format",
    category: "Shirts",
    colors: ["#1a3d2b", "#f5efe3", "#1a1a1a"],
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    description:
      "Fine-knit piqué polo with embroidered senator crest at chest. Refined casual.",
  },
];

const ORDERS: Order[] = [
  {
    id: "TSB-20241101",
    date: "1 Nov 2024",
    items: [{ product: PRODUCTS[0], size: "L", color: "#1a3d2b", qty: 1 }],
    total: 380,
    status: "Delivered",
  },
  {
    id: "TSB-20241215",
    date: "15 Dec 2024",
    items: [
      { product: PRODUCTS[3], size: "42", color: "#3d2b1a", qty: 1 },
      { product: PRODUCTS[1], size: "M", color: "#8B7355", qty: 1 },
    ],
    total: 1070,
    status: "Shipped",
  },
  {
    id: "TSB-20250108",
    date: "8 Jan 2025",
    items: [{ product: PRODUCTS[4], size: "M", color: "#1a3d2b", qty: 1 }],
    total: 890,
    status: "Processing",
  },
  {
    id: "TSB-20250120",
    date: "20 Jan 2025",
    items: [{ product: PRODUCTS[2], size: "L", color: "#c9a84c", qty: 2 }],
    total: 420,
    status: "Pending",
  },
];

const ADDRESSES = [
  {
    id: 1,
    label: "Home",
    region: "Greater Accra",
    city: "East Legon",
    landmark: "Near Accra Mall, House 14B",
    phone: "0244 123 456",
  },
  {
    id: 2,
    label: "Office",
    region: "Greater Accra",
    city: "Cantonments",
    landmark: "Independence Avenue, 3rd Floor",
    phone: "0302 987 654",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

// ─── Shared Components ────────────────────────────────────────────────────────

function TabBar({
  active,
  navigate,
}: {
  active: Screen;
  navigate: (s: Screen) => void;
}) {
  const tabs: { screen: Screen; label: string; icon: React.ReactNode }[] = [
    {
      screen: "home",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
    },
    {
      screen: "shop",
      label: "Shop",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      screen: "cart",
      label: "Cart",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      screen: "orderHistory",
      label: "Orders",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      ),
    },
    {
      screen: "account",
      label: "Account",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex z-50 safe-area-bottom">
      {tabs.map((t) => {
        const isActive = active === t.screen;
        return (
          <button
            key={t.screen}
            onClick={() => navigate(t.screen)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              isActive
                ? "text-[#1a3d2b] dark:text-[#c9a84c]"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {t.icon}
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ProductCard({
  product,
  onClick,
  saved,
  onToggleSave,
}: {
  product: Product;
  onClick: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer active:scale-95 transition-transform"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover bg-gray-200"
        />
        {onToggleSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill={saved ? "#c9a84c" : "none"} stroke="#c9a84c" strokeWidth={2} className="w-4 h-4">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-[#c9a84c] font-medium mb-0.5">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-[#1a3d2b] dark:text-[#c9a84c] mt-1">
          GHC {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function HomeScreen({
  navigate,
  setSelectedProduct,
  darkMode,
}: {
  navigate: (s: Screen) => void;
  setSelectedProduct: (p: Product) => void;
  darkMode: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Shirts", "Trousers", "Shoes", "Jackets"];
  const [searchQuery, setSearchQuery] = useState("");

  const featured = PRODUCTS[4];

  const filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#c9a84c] font-medium tracking-widest uppercase">Welcome back</p>
            <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">
              thesenatorbrand.
            </h1>
          </div>
          <button
            onClick={() => navigate("search")}
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#1a3d2b] dark:text-[#c9a84c]">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="mx-5 rounded-2xl overflow-hidden relative h-64 cursor-pointer" onClick={() => { setSelectedProduct(featured); navigate("product"); }}>
          <img
            src={featured.image}
            alt={featured.name}
            className="w-full h-full object-cover bg-[#1a3d2b]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f16]/90 via-[#1a3d2b]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="inline-block bg-[#c9a84c] text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-2">
              Featured
            </span>
            <h2 className="font-serif text-xl font-bold text-white leading-tight">{featured.name}</h2>
            <p className="text-[#c9a84c] font-semibold text-sm mt-1">GHC {featured.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Category Chips */}
        <div className="px-5 mt-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#1a3d2b] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-5 mt-5">
          <h2 className="font-serif text-lg font-bold text-[#1a3d2b] dark:text-gray-100 mb-3">
            New Arrivals
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => { setSelectedProduct(p); navigate("product"); }}
              />
            ))}
          </div>
        </div>
      </div>
      <TabBar active="home" navigate={navigate} />
    </div>
  );
}

function ShopScreen({
  navigate,
  setSelectedProduct,
  darkMode,
}: {
  navigate: (s: Screen) => void;
  setSelectedProduct: (p: Product) => void;
  darkMode: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const categories = ["All", "Shirts", "Trousers", "Shoes", "Jackets"];

  let filtered =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  if (sort === "Price: Low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "Price: High") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const toggleSave = (id: number) =>
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        {/* Header */}
        <div className="px-5 pt-12 pb-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">
            Shop
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("search")}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-[#1a3d2b] dark:text-[#c9a84c]">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 text-xs text-[#1a3d2b] dark:text-gray-100 outline-none"
            >
              <option>Newest</option>
              <option>Price: Low</option>
              <option>Price: High</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="px-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#1a3d2b] text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="px-5 mt-5 grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => { setSelectedProduct(p); navigate("product"); }}
              saved={savedIds.includes(p.id)}
              onToggleSave={() => toggleSave(p.id)}
            />
          ))}
        </div>
      </div>
      <TabBar active="shop" navigate={navigate} />
    </div>
  );
}

function ProductScreen({
  product,
  navigate,
  addToCart,
  darkMode,
}: {
  product: Product;
  navigate: (s: Screen) => void;
  addToCart: (item: CartItem) => void;
  darkMode: boolean;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const images = [product.image, ...PRODUCTS.filter(p=>p.id !== product.id).slice(0,2).map(p=>p.image)];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-32">
        {/* Image Gallery */}
        <div className="relative">
          <img
            src={images[imgIdx]}
            alt={product.name}
            className="w-full h-80 object-cover bg-gray-200"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
          <button
            onClick={() => navigate("home")}
            className="absolute top-12 left-4 w-9 h-9 rounded-full bg-white/80 dark:bg-gray-900/80 flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-[#c9a84c] w-4" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 pt-5">
          <p className="text-xs text-[#c9a84c] font-medium tracking-widest uppercase mb-1">{product.category}</p>
          <div className="flex items-start justify-between">
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight flex-1">
              {product.name}
            </h1>
            <p className="font-bold text-xl text-[#1a3d2b] dark:text-[#c9a84c] ml-3 mt-1">
              GHC {product.price.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{product.description}</p>

          {/* Size */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">Size</p>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                    selectedSize === s
                      ? "bg-[#1a3d2b] text-white border-[#1a3d2b]"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-2">Color</p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === c ? "border-[#c9a84c] scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Quantity</p>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-3 py-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-[#1a3d2b] dark:text-[#c9a84c] font-bold"
              >
                −
              </button>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-6 h-6 flex items-center justify-center text-[#1a3d2b] dark:text-[#c9a84c] font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-4 z-40">
        <button
          onClick={() => {
            addToCart({ product, size: selectedSize, color: selectedColor, qty });
            navigate("cart");
          }}
          className="w-full bg-[#1a3d2b] text-white rounded-full py-3.5 font-semibold text-base shadow-lg active:scale-95 transition-transform"
        >
          Add to Cart — GHC {(product.price * qty).toLocaleString()}
        </button>
        <p className={`text-center text-xs mt-2 font-medium ${product.stock <= 5 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
          {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
        </p>
      </div>
    </div>
  );
}

function CartScreen({
  cart,
  setCart,
  navigate,
  darkMode,
}: {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  navigate: (s: Screen) => void;
  darkMode: boolean;
}) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const shipping = subtotal > 0 ? 50 : 0;

  const updateQty = (idx: number, delta: number) => {
    const updated = cart.map((item, i) => {
      if (i !== idx) return item;
      const newQty = Math.max(1, item.qty + delta);
      return { ...item, qty: newQty };
    });
    setCart(updated);
  };

  const remove = (idx: number) => setCart(cart.filter((_, i) => i !== idx));

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-40">
        <div className="px-5 pt-12 pb-4">
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Your Cart</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-[#1a3d2b] dark:text-[#c9a84c]">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
              </svg>
            </div>
            <p className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">Your cart is empty</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add some items from the shop.</p>
            <button onClick={() => navigate("shop")} className="mt-6 bg-[#1a3d2b] text-white px-8 py-2.5 rounded-full font-medium">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="px-5 space-y-3">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-lg bg-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight pr-2">
                      {item.product.name}
                    </h3>
                    <button onClick={() => remove(idx)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-red-400">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Size: {item.size}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      Color: <span className="inline-block w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }} />
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#1a3d2b] dark:text-[#c9a84c] mt-1">
                    GHC {(item.product.price * item.qty).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2 bg-white dark:bg-gray-900 rounded-full px-2 py-1 w-fit">
                    <button onClick={() => updateQty(idx, -1)} className="text-[#1a3d2b] dark:text-[#c9a84c] font-bold text-sm w-5 h-5 flex items-center justify-center">−</button>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 1)} className="text-[#1a3d2b] dark:text-[#c9a84c] font-bold text-sm w-5 h-5 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-4 z-40">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">GHC {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500 dark:text-gray-400">Delivery</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">GHC {shipping}</span>
          </div>
          <div className="flex justify-between font-bold text-base mb-4">
            <span className="text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-[#1a3d2b] dark:text-[#c9a84c]">GHC {(subtotal + shipping).toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate("checkout")}
            className="w-full bg-[#1a3d2b] text-white rounded-full py-3.5 font-semibold shadow-lg active:scale-95 transition-transform"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
      <TabBar active="cart" navigate={navigate} />
    </div>
  );
}

function CheckoutScreen({
  cart,
  navigate,
  darkMode,
}: {
  cart: CartItem[];
  navigate: (s: Screen) => void;
  darkMode: boolean;
}) {
  const [form, setForm] = useState({ region: "Greater Accra", city: "", landmark: "", phone: "" });
  const [payment, setPayment] = useState<"paystack" | "momo">("paystack");
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const total = subtotal + 50;

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-32">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate("cart")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Checkout</h1>
        </div>

        <div className="px-5 space-y-4">
          {/* Delivery Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">Delivery Address</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none"
                >
                  <option>Greater Accra</option>
                  <option>Ashanti</option>
                  <option>Western</option>
                  <option>Central</option>
                  <option>Northern</option>
                  <option>Eastern</option>
                  <option>Volta</option>
                  <option>Upper East</option>
                  <option>Upper West</option>
                  <option>Brong-Ahafo</option>
                </select>
              </div>
              {[
                { key: "city", label: "City / Town", placeholder: "e.g. East Legon" },
                { key: "landmark", label: "Landmark", placeholder: "e.g. Near Accra Mall" },
                { key: "phone", label: "Phone Number", placeholder: "e.g. 0244 123 456" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</h2>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-600 dark:text-gray-400">{item.product.name} × {item.qty}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">GHC {(item.product.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 text-gray-500 dark:text-gray-400">
              <span>Delivery</span><span>GHC 50</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-[#1a3d2b] dark:text-[#c9a84c]">GHC {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">Payment Method</h2>
            <div className="space-y-2">
              {[
                { id: "paystack", label: "Paystack", sub: "Card / Bank Transfer" },
                { id: "momo", label: "Mobile Money", sub: "MTN / Vodafone / AirtelTigo" },
              ].map(({ id, label, sub }) => (
                <button
                  key={id}
                  onClick={() => setPayment(id as "paystack" | "momo")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    payment === id
                      ? "border-[#1a3d2b] bg-[#1a3d2b]/5 dark:bg-[#1a3d2b]/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === id ? "border-[#1a3d2b]" : "border-[#9a9280]"}`}>
                    {payment === id && <div className="w-2.5 h-2.5 rounded-full bg-[#1a3d2b]" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-4 z-40">
        <button
          onClick={() => navigate("orderConfirmation")}
          className="w-full bg-[#c9a84c] text-gray-900 rounded-full py-3.5 font-semibold text-base shadow-lg active:scale-95 transition-transform"
        >
          Place Order — GHC {total.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

function OrderConfirmationScreen({ navigate, cart, darkMode }: { navigate: (s: Screen) => void; cart: CartItem[]; darkMode: boolean }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0) + 50;
  const orderNum = "TSB-" + Date.now().toString().slice(-8);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-5`}>
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-[#1a3d2b] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-12 h-12">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1a3d2b] dark:text-gray-100 mb-2">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Thank you for shopping with thesenatorbrand.</p>
        <p className="text-xs font-mono text-[#c9a84c] font-semibold tracking-wider mb-6">{orderNum}</p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-left mb-6">
          <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</h2>
          {cart.map((item, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <img src={item.product.image} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg bg-gray-200" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.product.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.size} · {item.qty}x</p>
                <p className="text-sm font-bold text-[#1a3d2b] dark:text-[#c9a84c]">GHC {(item.product.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold">
            <span className="text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-[#1a3d2b] dark:text-[#c9a84c]">GHC {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("orderHistory")}
            className="w-full bg-[#1a3d2b] text-white rounded-full py-3.5 font-semibold"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate("home")}
            className="w-full border border-[#1a3d2b] dark:border-[#c9a84c] text-[#1a3d2b] dark:text-[#c9a84c] rounded-full py-3.5 font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderHistoryScreen({ navigate, setSelectedOrder, darkMode }: { navigate: (s: Screen) => void; setSelectedOrder: (o: Order) => void; darkMode: boolean }) {
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4">
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Order History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{ORDERS.length} orders</p>
        </div>

        <div className="px-5 space-y-3">
          {ORDERS.map((order) => (
            <div
              key={order.id}
              onClick={() => { setSelectedOrder(order); navigate("orderDetail"); }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 cursor-pointer active:scale-98 transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-mono text-[#c9a84c] font-semibold">{order.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{order.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <img
                    key={i}
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-14 object-cover rounded-lg bg-gray-200"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                <p className="font-bold text-[#1a3d2b] dark:text-[#c9a84c]">GHC {order.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="orderHistory" navigate={navigate} />
    </div>
  );
}

function OrderDetailScreen({ order, navigate, darkMode }: { order: Order; navigate: (s: Screen) => void; darkMode: boolean }) {
  const steps: Order["status"][] = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate("orderHistory")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1a3d2b] dark:text-gray-100">Order Detail</h1>
            <p className="text-xs font-mono text-[#c9a84c]">{order.id}</p>
          </div>
        </div>

        <div className="px-5 space-y-4">
          {/* Status Timeline */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-4">Tracking</h2>
            <div className="flex items-center">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      i <= currentStep
                        ? "bg-[#1a3d2b] border-[#1a3d2b]"
                        : "border-gray-200 dark:border-gray-700 bg-transparent"
                    }`}>
                      {i <= currentStep && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[9px] mt-1 font-medium text-center ${i <= currentStep ? "text-[#1a3d2b] dark:text-[#c9a84c]" : "text-gray-400"}`}>{step}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 ${i < currentStep ? "bg-[#1a3d2b]" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-3">Items</h2>
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-lg bg-gray-200" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Size: {item.size}</p>
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    Color: <span className="inline-block w-3 h-3 rounded-full border" style={{ backgroundColor: item.color }} />
                  </span>
                  <p className="text-sm font-bold text-[#1a3d2b] dark:text-[#c9a84c] mt-1">GHC {(item.product.price * item.qty).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold">
              <span className="text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-[#1a3d2b] dark:text-[#c9a84c]">GHC {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery + Payment */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <h2 className="font-serif font-semibold text-gray-900 dark:text-gray-100 mb-1">Delivery Address</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">East Legon, Greater Accra</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Near Accra Mall, House 14B</p>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Payment</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Paid · Paystack</span>
            </div>
          </div>
        </div>
      </div>
      <TabBar active="orderHistory" navigate={navigate} />
    </div>
  );
}

function AccountScreen({
  navigate,
  darkMode,
  toggleDarkMode,
}: {
  navigate: (s: Screen) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const menuItems = [
    { label: "My Addresses", icon: "📍", screen: "addresses" as Screen },
    { label: "Order History", icon: "📦", screen: "orderHistory" as Screen },
    { label: "Saved Items", icon: "❤️", screen: "savedItems" as Screen },
    { label: "App Settings", icon: "⚙️", screen: "settings" as Screen },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-6">
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Account</h1>
        </div>

        {/* Profile */}
        <div className="mx-5 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-[#1a3d2b] flex items-center justify-center text-2xl font-serif font-bold text-white">
            KA
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Kwame Asante</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">kwame@example.com</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-[#c9a84c]">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <div className="mx-5 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
          {menuItems.map(({ label, icon, screen }, i) => (
            <button
              key={label}
              onClick={() => navigate(screen)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${
                i < menuItems.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">{label}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <div className="mx-5 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="text-lg">🌙</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-[#1a3d2b]" : "bg-gray-200"} relative`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Log Out */}
        <div className="mx-5">
          <button
            onClick={() => navigate("login")}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl py-3.5 font-semibold text-sm"
          >
            Log Out
          </button>
        </div>
      </div>
      <TabBar active="account" navigate={navigate} />
    </div>
  );
}

function AddressesScreen({ navigate, darkMode }: { navigate: (s: Screen) => void; darkMode: boolean }) {
  const [addresses, setAddresses] = useState(ADDRESSES);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate("account")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">My Addresses</h1>
        </div>

        <div className="px-5 space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block bg-[#1a3d2b]/10 dark:bg-[#1a3d2b]/40 text-[#1a3d2b] dark:text-[#c9a84c] text-xs font-semibold px-2 py-0.5 rounded">
                  {addr.label}
                </span>
                <div className="flex gap-2">
                  <button className="text-xs text-[#1a3d2b] dark:text-[#c9a84c] font-medium">Edit</button>
                  <button onClick={() => setAddresses((a) => a.filter((x) => x.id !== addr.id))} className="text-xs text-red-500 font-medium">Delete</button>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{addr.city}, {addr.region}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{addr.landmark}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{addr.phone}</p>
            </div>
          ))}

          <button className="w-full border-2 border-dashed border-[#c9a84c] rounded-xl py-4 flex items-center justify-center gap-2 text-[#c9a84c] font-medium text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}

function SavedItemsScreen({ navigate, setSelectedProduct, darkMode }: { navigate: (s: Screen) => void; setSelectedProduct: (p: Product) => void; darkMode: boolean }) {
  const [saved, setSaved] = useState([PRODUCTS[0], PRODUCTS[4], PRODUCTS[6]]);

  const remove = (id: number) => setSaved((s) => s.filter((p) => p.id !== id));

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate("account")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Saved Items</h1>
        </div>

        {saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-5">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-[#c9a84c]">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <p className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">No saved items</p>
            <button onClick={() => navigate("shop")} className="mt-4 bg-[#1a3d2b] text-white px-8 py-2.5 rounded-full font-medium text-sm">
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3">
            {saved.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => { setSelectedProduct(p); navigate("product"); }}
                saved={true}
                onToggleSave={() => remove(p.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsScreen({ navigate, darkMode, toggleDarkMode }: { navigate: (s: Screen) => void; darkMode: boolean; toggleDarkMode: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate("account")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="font-serif text-2xl font-bold text-[#1a3d2b] dark:text-gray-100">Settings</h1>
        </div>

        <div className="px-5 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">Push Notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? "bg-[#1a3d2b]" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${notifications ? "left-7" : "left-1"}`} />
              </button>
            </div>
            <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm text-gray-500 dark:text-gray-400 outline-none"
              >
                <option>English</option>
                <option>Twi</option>
                <option>Ga</option>
                <option>Hausa</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-3.5">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-[#1a3d2b]" : "bg-gray-200 dark:bg-gray-700"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${darkMode ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-xs text-gray-400">thesenatorbrand. · Version 1.0.0</p>
            <p className="text-xs text-gray-400 mt-0.5">Made with ❤️ in Ghana</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchScreen({ navigate, setSelectedProduct, darkMode }: { navigate: (s: Screen) => void; setSelectedProduct: (p: Product) => void; darkMode: boolean }) {
  const [query, setQuery] = useState("Senator");

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900`}>
      <div className="max-w-md mx-auto pb-24">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("home")} className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-[#1a3d2b] dark:text-white">
                <path d="M19 12H5m7-7l-7 7 7 7" />
              </svg>
            </button>
            <div className="flex-1 flex items-center bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-200 dark:border-gray-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400 mr-2 shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-gray-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {results.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{results.length} result{results.length !== 1 ? "s" : ""} for "{query}"</p>
          )}
        </div>

        {query && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-5">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gray-400">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="font-serif text-lg font-semibold text-gray-900 dark:text-gray-100">No results found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try searching for shirts, shoes, or trousers.</p>
          </div>
        ) : (
          <div className="px-5 grid grid-cols-2 gap-3">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => { setSelectedProduct(p); navigate("product"); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ navigate, darkMode }: { navigate: (s: Screen) => void; darkMode: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 flex flex-col`}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-[#1a3d2b] dark:text-gray-100">thesenatorbrand.</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
            />
          </div>

          <button className="text-right w-full text-xs text-[#c9a84c] font-medium">
            Forgot password?
          </button>

          <button
            onClick={() => navigate("home")}
            className="w-full bg-[#1a3d2b] text-white rounded-full py-3.5 font-semibold text-base shadow-lg mt-2"
          >
            Log In
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("signup")} className="text-[#c9a84c] font-semibold">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

function SignUpScreen({ navigate, darkMode }: { navigate: (s: Screen) => void; darkMode: boolean }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 flex flex-col`}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center px-5 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-[#1a3d2b] dark:text-gray-100">thesenatorbrand.</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="space-y-4">
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Kwame Asante" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "phone", label: "Phone Number", type: "tel", placeholder: "0244 123 456" },
            { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
              />
            </div>
          ))}

          <button
            onClick={() => navigate("home")}
            className="w-full bg-[#c9a84c] text-gray-900 rounded-full py-3.5 font-semibold text-base shadow-lg mt-2"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Already have an account?{" "}
          <button onClick={() => navigate("login")} className="text-[#c9a84c] font-semibold">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order>(ORDERS[0]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const navigate = (s: Screen) => setScreen(s);
  const toggleDarkMode = () => setDarkMode((d) => !d);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.product.id === item.product.id && c.size === item.size && c.color === item.color
      );
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + item.qty };
        return updated;
      }
      return [...prev, item];
    });
  };

  const screens: Record<Screen, React.ReactNode> = {
    login: <LoginScreen navigate={navigate} darkMode={darkMode} />,
    signup: <SignUpScreen navigate={navigate} darkMode={darkMode} />,
    home: <HomeScreen navigate={navigate} setSelectedProduct={setSelectedProduct} darkMode={darkMode} />,
    shop: <ShopScreen navigate={navigate} setSelectedProduct={setSelectedProduct} darkMode={darkMode} />,
    product: <ProductScreen product={selectedProduct} navigate={navigate} addToCart={addToCart} darkMode={darkMode} />,
    cart: <CartScreen cart={cart} setCart={setCart} navigate={navigate} darkMode={darkMode} />,
    checkout: <CheckoutScreen cart={cart} navigate={navigate} darkMode={darkMode} />,
    orderConfirmation: <OrderConfirmationScreen navigate={navigate} cart={cart} darkMode={darkMode} />,
    orderHistory: <OrderHistoryScreen navigate={navigate} setSelectedOrder={setSelectedOrder} darkMode={darkMode} />,
    orderDetail: <OrderDetailScreen order={selectedOrder} navigate={navigate} darkMode={darkMode} />,
    account: <AccountScreen navigate={navigate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />,
    addresses: <AddressesScreen navigate={navigate} darkMode={darkMode} />,
    savedItems: <SavedItemsScreen navigate={navigate} setSelectedProduct={setSelectedProduct} darkMode={darkMode} />,
    settings: <SettingsScreen navigate={navigate} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />,
    search: <SearchScreen navigate={navigate} setSelectedProduct={setSelectedProduct} darkMode={darkMode} />,
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="w-full max-w-md h-full overflow-y-auto relative" style={{ maxHeight: "100dvh" }}>
        {screens[screen]}
      </div>
    </div>
  );
}
