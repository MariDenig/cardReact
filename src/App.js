import React, { useState, useEffect } from 'react';
import './App.css';
import MenuItem from './components/MenuItem';
import { menuItems, categories } from './data';

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cardápio Digital</h1>
        <button
          className="cart-button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          onKeyDown={(e) => handleKeyDown(e, () => setIsCartOpen(!isCartOpen))}
          aria-expanded={isCartOpen}
          aria-label={`Abrir carrinho de compras. ${cart.length} itens no carrinho`}
        >
          <span className="cart-icon" aria-hidden="true">🛒</span>
          <span className="cart-count">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </button>
      </header>

      {notification && (
        <div 
          className={`notification ${notification.type}`}
          role="alert"
          aria-live="polite"
        >
          {notification.message}
        </div>
      )}

      <nav 
        className="category-filter" 
        role="navigation" 
        aria-label="Filtro de categorias"
      >
        {categories.map(category => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            onKeyDown={(e) => handleKeyDown(e, () => setSelectedCategory(category))}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </nav>

      <main className="menu-container" role="main">
        {filteredItems.map((item) => (
          <MenuItem
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            category={item.category}
            isVegetarian={item.isVegetarian}
            onAddToCart={addToCart}
          />
        ))}
      </main>

      {isCartOpen && (
        <div 
          className="cart-modal" 
          role="dialog" 
          aria-labelledby="cart-title"
          aria-modal="true"
        >
          <div className="cart-content">
            <h2 id="cart-title">Carrinho de Compras</h2>
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
                          onKeyDown={(e) => handleKeyDown(e, () => updateQuantity(item.name, item.quantity - 1))}
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          -
                        </button>
                        <span 
                          className="quantity"
                          aria-label={`Quantidade: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                          onKeyDown={(e) => handleKeyDown(e, () => updateQuantity(item.name, item.quantity + 1))}
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
                          onKeyDown={(e) => handleKeyDown(e, () => removeFromCart(item.name))}
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
                <button 
                  className="checkout-button"
                  onKeyDown={(e) => handleKeyDown(e, () => alert('Compra finalizada!'))}
                >
                  Finalizar Compra
                </button>
              </>
            )}
            <button
              className="close-cart"
              onClick={() => setIsCartOpen(false)}
              onKeyDown={(e) => handleKeyDown(e, () => setIsCartOpen(false))}
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
