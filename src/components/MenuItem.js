import React, { useCallback } from 'react';
import './MenuItem.css';

const MenuItem = React.memo(({ item, onAddToCart, isFirstItem }) => {
  const formatarPreco = useCallback((preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  }, []);

  const handleAddToCart = useCallback(() => {
    onAddToCart(item);
  }, [onAddToCart, item]);

  return (
    <div className="menu-item">
      <img 
        src={item.imageUrl} 
        alt={`Foto apetitosa de ${item.name}, mostrando ${item.descricaoBreveDaImagem || item.name}`}
        className="menu-item-imagem"
        loading={isFirstItem ? "eager" : "lazy"}
        width="500"
        height="300"
        decoding={isFirstItem ? "sync" : "async"}
        srcSet={item.imageUrl.replace('w=500', 'w=300') + ' 300w, ' + item.imageUrl.replace('w=500', 'w=500') + ' 500w'}
        sizes="(max-width: 600px) 100vw, 500px"
        fetchpriority={isFirstItem ? "high" : "auto"}
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
            onClick={handleAddToCart}
            aria-label={`Adicionar ${item.name} ao carrinho`}
          >
            <span className="cart-icon">🛒</span>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem; 