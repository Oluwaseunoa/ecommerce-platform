import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setError('Could not load products.'));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} — ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;