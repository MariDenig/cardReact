import React, { Suspense, lazy, useState, useCallback, useMemo } from 'react';
import './styles.css';
import MenuItem from './components/MenuItem';
import { menuItems, categories } from './data';

// Lazy loading com prefetch
const ItemDetails = lazy(() => import('./components/ItemDetails'));
const CartModal = lazy(() => import('./components/CartModal'));
const MenuSidebar = lazy(() => import('./components/MenuSidebar'));

// Componente de loading otimizado
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Memoize filtered items
  const filteredItems = useMemo(() => 
    selectedCategory === 'Todos' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory),
    [selectedCategory]
  );

  // Memoize callbacks
  const addToCart = useCallback((item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showNotification(`${item.name} adicionado ao carrinho`, 'success');
  }, []);

  const removeFromCart = useCallback((itemName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
    showNotification(`${itemName} removido do carrinho`, 'info');
  }, []);

  const updateQuantity = useCallback((itemName, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  }, []);

  // Memoize total calculation
  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  );

  // Memoize cart count
  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          <span className="menu-icon">☰</span>
        </button>
        <h1>Nosso Cardápio</h1>
        <button
          className="cart-button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          aria-label={`Abrir carrinho de compras. ${cartCount} itens no carrinho`}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✓' : notification.type === 'info' ? 'ℹ' : '⚠'}
          </span>
          {notification.message}
        </div>
      )}

      <Suspense fallback={<LoadingFallback />}>
        {isMenuOpen && (
          <MenuSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </Suspense>

      <main className="menu-container">
        {filteredItems.map((item, index) => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={addToCart}
            isFirstItem={index === 0}
          />
        ))}
      </main>

      {selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <Suspense fallback={<LoadingFallback />}>
              <ItemDetails item={selectedItem} />
            </Suspense>
          </div>
        </div>
      )}

      <Suspense fallback={<LoadingFallback />}>
        {isCartOpen && (
          <CartModal
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            total={total}
            setIsCartOpen={setIsCartOpen}
          />
        )}
      </Suspense>
    </div>
  );
}

export default React.memo(App);
