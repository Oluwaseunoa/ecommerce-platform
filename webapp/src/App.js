import React from 'react';
import ProductList from './components/ProductList';
import Login from './components/Login';
import PlaceOrder from './components/PlaceOrder';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>E-Commerce Platform</h1>
      <hr />
      <ProductList />
      <hr />
      <Login />
      <hr />
      <PlaceOrder />
    </div>
  );
}

export default App;