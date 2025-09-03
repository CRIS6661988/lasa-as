import React, { useState, useEffect } from 'react';
import { Plus, Heart } from 'lucide-react';

const initialProducts = [
  {
    id: 1,
    name: 'Lasaña Clásica',
    description: 'Carne de res con salsa bechamel y tomate.',
    image: 'https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg',
    price: 12,
    priceOld: 15,
    weight: 500,
    type: 'individual',
    line: 'clásica',
    tags: ['carne', 'clásica'],
  },
  {
    id: 2,
    name: 'Lasaña de Pollo',
    description: 'Pollo sazonado con queso y salsa blanca.',
    image: 'https://images.pexels.com/photos/247469/pexels-photo-247469.jpeg',
    price: 14,
    priceOld: 18,
    weight: 750,
    type: 'familiar',
    line: 'pollo',
    tags: ['pollo'],
  },
  {
    id: 3,
    name: 'Lasaña Vegetariana',
    description: 'Verduras frescas con queso ricotta y espinacas.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    price: 11,
    priceOld: null,
    weight: 500,
    type: 'individual',
    line: 'vegetariana',
    tags: ['vegetariana'],
  },
  // ... más productos si deseas
];

export default function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('favorites');
    return savedFavs ? JSON.parse(savedFavs) : [];
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    types: new Set(),
    weights: new Set(),
    lines: new Set(),
    maxPrice: Infinity,
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product) => {
    setCart((c) => [...c, product]);
  };

  const toggleFilter = (category, value) => {
    setFilters((f) => {
      const newSet = new Set(f[category]);
      if (newSet.has(value)) newSet.delete(value);
      else newSet.add(value);
      return { ...f, [category]: newSet };
    });
  };

  const handleCheckout = () => {
    alert(
      'El proceso de pago aún está en desarrollo. Contáctanos por WhatsApp para realizar tu pedido.'
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavorited = (productId) => favorites.includes(productId);

  const filtered = initialProducts
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()))
    )
    .filter((p) =>
      filters.types.size ? filters.types.has(p.type) : true
    )
    .filter((p) =>
      filters.weights.size ? filters.weights.has(p.weight) : true
    )
    .filter((p) =>
      filters.lines.size ? filters.lines.has(p.line) : true
    )
    .filter((p) => p.price <= filters.maxPrice);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-red-600 text-white p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Catálogo de Lasañas</h1>
          <button
            onClick={handleCheckout}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Proceder al pago
          </button>
        </div>
        <input
          type="text"
          className="p-2 w-full sm:w-1/3 text-black rounded"
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="flex flex-1">
        <aside className="w-64 p-4 bg-white border-r hidden md:block">
          <h2 className="font-semibold mb-2">Filtros</h2>
          <div className="mb-4">
            <h3 className="font-medium">Tipo</h3>
            {['individual', 'familiar', 'bandeja'].map((t) => (
              <label key={t} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => toggleFilter('types', t)}
                  checked={filters.types.has(t)}
                />
                {t}
              </label>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="font-medium">Peso</h3>
            {[500, 750, 1000].map((w) => (
              <label key={w} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => toggleFilter('weights', w)}
                  checked={filters.weights.has(w)}
                />
                {w} g
              </label>
            ))}
          </div>
          <div className="mb-4">
            <h3 className="font-medium">Línea</h3>
            {['clásica', 'pollo', 'vegetariana'].map((l) => (
              <label key={l} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => toggleFilter('lines', l)}
                  checked={filters.lines.has(l)}
                />
                {l}
              </label>
            ))}
          </div>
          <div>
            <h3 className="font-medium">Precio máximo</h3>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={filters.maxPrice === Infinity ? 50 : filters.maxPrice}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  maxPrice: Number(e.target.value),
                }))
              }
            />
            <div>S/ {filters.maxPrice === Infinity ? '50+' : filters.maxPrice}</div>
          </div>
        </aside>

        <section className="flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-xl mb-2">{p.name}</h3>
                  <p className="text-sm text-gray-600">
                    {p.weight} g • {p.type}
                  </p>
                  <p className="mt-1">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      {p.priceOld && (
                        <span className="line-through text-gray-400 mr-1">
                          S/ {p.priceOld}
                        </span>
                      )}
                      <span className="text-lg font-bold text-red-600">
                        S/ {p.price}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                      >
                        <Plus size={18} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Heart
                          size={18}
                          strokeWidth={2.5}
                          color={isFavorited(p.id) ? '#e3342f' : 'currentColor'}
                          fill={isFavorited(p.id) ? '#e3342f' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-4 text-gray-500">
              No hay productos que coincidan con tus filtros.
            </p>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Contáctanos</h2>
          <p>WhatsApp: +51 999 999 999</p>
          <p>Email: info@mislasanas.com</p>
          <p>Instagram: @mislasanas</p>
        </div>
      </footer>
    </div>
  );
}


