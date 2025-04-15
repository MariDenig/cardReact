import React, { useState } from 'react';
import './styles.css';
import MenuItem from './components/MenuItem';
import { menuItems, categories } from './data';

function App() {
  const [cart, setCart] = useState([]);
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
    setNotification({
      message: `${item.name} adicionado ao carrinho`,
      type: 'success'
    });
  };

  const removeFromCart = (itemName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== itemName));
    setNotification({
      message: `${itemName} removido do carrinho`,
      type: 'info'
    });
  };

  const updateQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
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
          {notification.message}
        </div>
      )}

      <div className={`menu-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-title">Categorias</h2>
          <button 
            className="close-menu"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>
        <nav className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(category);
                setIsMenuOpen(false);
              }}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <main className="menu-container">
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onAddToCart={addToCart}
          />
        ))}
      </main>

      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>Carrinho de Compras</h2>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio</p>
            ) : (
              <>
                <ul className="cart-items">
                  {cart.map(item => (
                    <li key={item.name} className="cart-item">
                      <div className="cart-item-info">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <span className="cart-item-name">{item.name}</span>
                      </div>
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-price">
                        <span className="item-total">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="remove-item"
                          aria-label={`Remover ${item.name} do carrinho`}
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-total">
                  <span>Total:</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(total)}
                  </span>
                </div>
                <button className="checkout-button">
                  Finalizar Compra
                </button>
              </>
            )}
            <button
              className="close-cart"
              onClick={() => setIsCartOpen(false)}
              aria-label="Fechar carrinho"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
