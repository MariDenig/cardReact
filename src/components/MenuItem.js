import React from 'react';
import './MenuItem.css';

const MenuItem = ({ item, onAddToCart }) => {
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <div className="menu-item">
      <img 
        src={item.imageUrl} 
        alt={item.name} 
        className="menu-item-imagem"
        loading="lazy"
      />
      <div className="menu-item-content">
        <div className="menu-item-header">
          <h3>{item.name}</h3>
          <div className="dietary-tags">
            {item.isVegan && (
              <span className="dietary-tag vegan" title="Vegano">
                🌱
              </span>
            )}
            {item.isVegetarian && !item.isVegan && (
              <span className="dietary-tag vegetarian" title="Vegetariano">
                🥗
              </span>
            )}
          </div>
        </div>
        <p>{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-preco">{formatarPreco(item.price)}</span>
          <button
            className="add-to-cart-button"
            onClick={() => onAddToCart(item)}
            aria-label={`Adicionar ${item.name} ao carrinho`}
          >
            <span className="cart-icon">🛒</span>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 