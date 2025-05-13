import React from 'react';

const ItemDetails = ({ item }) => {
  if (!item) return null;

  return (
    <div className="item-details">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="item-info">
        <span>Preço: R$ {item.price.toFixed(2)}</span>
        <span>Categoria: {item.category}</span>
        {item.isVegetarian && <span>Vegetariano</span>}
        {item.isVegan && <span>Vegano</span>}
      </div>
    </div>
  );
};

export default ItemDetails; 