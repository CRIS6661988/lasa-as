import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Lasa\u00f1a Cl\u00e1sica',
    description: 'Carne de res con salsa bechamel y tomate.',
    image: 'https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg',
    prices: { individual: 12, familiar: 40, bandeja: 100 },
    tags: ['clasica', 'carne']
  },
  {
    id: 2,
    name: 'Lasa\u00f1a de Pollo',
    description: 'Pollo sazonado con queso y salsa blanca.',
    image: 'https://images.pexels.com/photos/247469/pexels-photo-247469.jpeg',
    prices: { individual: 14, familiar: 45, bandeja: 110 },
    tags: ['pollo']
  },
  {
    id: 3,
    name: 'Lasa\u00f1a Vegetariana',
    description: 'Verduras frescas con queso ricotta y espinacas.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    prices: { individual: 11, familiar: 38, bandeja: 95 },
    tags: ['vegetariana', 'verduras']
  }
];

function App() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeSelections, setSizeSelections] = useState({});

  const addToCart = (product, size) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id && item.size === size);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const adjustQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: updated[index].quantity + delta };
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const subtotal = cart.reduce((sum, item) => sum + item.product.prices[item.size] * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-primary-default text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lasa\u00f1as para Llevar</h1>
        <button
          className="bg-primary-dark text-white px-3 py-2 rounded-lg"
          onClick={() => setDrawerOpen(true)}
        >
          Carrito ({cart.reduce((sum, i) => sum + i.quantity, 0)})
        </button>
      </header>
      <main className="flex-1 p-4 space-y-10">
        <section className="bg-primary-light p-8 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-2">Sabores que Enamoran</h2>
          <p className="mb-4 text-gray-700">Lasa\u00f1as artesanales elaboradas con ingredientes frescos. \u00a1Pide la tuya!</p>
          <input
            type="text"
            className="border rounded-md px-4 py-2 w-full max-w-md"
            placeholder="Buscar sabor o ingrediente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-4">Nuestro Men\u00fa</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-xl mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600 flex-1">{product.description}</p>
                  <select
                    className="mt-3 border rounded-md px-2 py-1"
                    value={sizeSelections[product.id] || 'individual'}
                    onChange={(e) =>
                      setSizeSelections(prev => ({ ...prev, [product.id]: e.target.value }))
                    }
                  >
                    <option value="individual">Individual - S/.{product.prices.individual}</option>
                    <option value="familiar">Familiar - S/.{product.prices.familiar}</option>
                    <option value="bandeja">Bandeja - S/.{product.prices.bandeja}</option>
                  </select>
                  <button
                    className="mt-3 bg-primary-default text-white rounded-md py-2"
                    onClick={() => addToCart(product, sizeSelections[product.id] || 'individual')}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p>No se encontraron productos que coincidan.</p>
            )}
          </div>
        </section>

        <section className="bg-primary-dark text-white p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-2">Promo Delivery Gratis</h3>
          <p>Por compras mayores a S/120, el delivery es gratuito. \u00a1Aprovecha!</p>
        </section>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Lasa\u00f1as para Llevar
      </footer>

      <AnimatePresence>
        {drawerOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Tu Carrito</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-2xl">&times;</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-center">Tu carrito est\u00e1 vac\u00edo.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h4 className="font-bold">{item.product.name}</h4>
                      <p className="text-sm capitalize">{item.size}</p>
                      <p>S/.{item.product.prices[item.size]} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="px-2"
                        onClick={() => adjustQty(index, -1)}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2"
                        onClick={() => adjustQty(index, 1)}
                      >+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>S/.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery</span>
                  <span>{subtotal >= 120 ? 'Gratis' : 'S/.10.00'}</span>
                </div>
                <div className="flex justify-between font-bold mb-4">
                  <span>Total</span>
                  <span>S/.{(subtotal + (subtotal >= 120 ? 0 : 10)).toFixed(2)}</span>
                </div>
                <button className="w-full bg-primary-default text-white rounded-md py-2">Proceder al pago</button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
