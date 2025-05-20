import React from 'react';

function CartModal({ cart, updateQuantity, removeFromCart, total, setIsCartOpen }) {
  return (
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
  );
}

export default CartModal;
