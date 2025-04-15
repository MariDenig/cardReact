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
      />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="menu-item-footer">
        <span className="menu-item-preco">{formatarPreco(item.price)}</span>
        <button 
          className="add-to-cart-button"
          onClick={() => onAddToCart(item)}
          aria-label={`Adicionar ${item.name} ao carrinho`}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default MenuItem; 