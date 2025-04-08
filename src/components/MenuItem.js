import React, { useState } from 'react';
import './MenuItem.css';

const MenuItem = ({ name, description, price, imageUrl, onAddToCart, category, isVegetarian }) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  const handleAddToCart = () => {
    onAddToCart({ name, price, imageUrl });
    // Feedback tátil para usuários com deficiência visual
    const button = document.activeElement;
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200);
  };

  return (
    <article 
      className="menu-item"
      role="article"
      aria-labelledby={`item-${name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="menu-item-image">
        <img 
          src={imageUrl} 
          alt={`Imagem de ${name}`}
          loading="lazy"
          aria-hidden="true"
        />
        {isVegetarian && (
          <span 
            className="vegetarian-badge"
            role="img"
            aria-label="Opção vegetariana"
          >
            🌱
          </span>
        )}
      </div>
      <div className="menu-item-content">
        <div className="item-header">
          <h3 id={`item-${name}`}>{name}</h3>
          <span className="category-tag" aria-label={`Categoria: ${category}`}>
            {category}
          </span>
        </div>
        <p>{description}</p>
        <div className="item-footer">
          <span 
            className="price" 
            aria-label={`Preço: ${formattedPrice}`}
          >
            {formattedPrice}
          </span>
          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            aria-label={`Adicionar ${name} ao carrinho por ${formattedPrice}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleAddToCart();
              }
            }}
          >
            <span className="button-text">Adicionar ao Carrinho</span>
            <span className="button-icon" aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuItem; 