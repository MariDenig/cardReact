import React from 'react';

function MenuSidebar({ categories, selectedCategory, setSelectedCategory, setIsMenuOpen }) {
  return (
    <div className="menu-sidebar open">
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
  );
}

export default MenuSidebar;
