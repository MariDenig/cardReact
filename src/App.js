import React, { Suspense, lazy, useState, useEffect } from 'react';
import './styles.css';
import MenuItem from './components/MenuItem';
import { menuItems, categories } from './data';

// Lazy loading do componente ItemDetails
// Implementação de Code Splitting:
// O componente ItemDetails é carregado dinamicamente apenas quando necessário,
// reduzindo o tamanho do bundle inicial e melhorando o tempo de carregamento da página.
// O React.lazy() cria um chunk separado que será carregado sob demanda.
// O Suspense fornece um fallback enquanto o componente está carregando.
const ItemDetails = lazy(() => import('./components/ItemDetails'));
const CartModal = lazy(() => import('./components/CartModal'));
const MenuSidebar = lazy(() => import('./components/MenuSidebar'));

function App() {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const filteredItems = selectedCategory === 'Todos' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
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
  };

  const removeFromCart = (itemName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
    showNotification(`${itemName} removido do carrinho`, 'info');
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
          aria-label={`Abrir carrinho de compras. ${cart.length} itens no carrinho`}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
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

      <Suspense fallback={<div>Carregando menu...</div>}>
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
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={addToCart}
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
            <Suspense fallback={<div>Carregando detalhes...</div>}>
              <ItemDetails item={selectedItem} />
            </Suspense>
          </div>
        </div>
      )}

      <Suspense fallback={<div>Carregando carrinho...</div>}>
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

export default App;
