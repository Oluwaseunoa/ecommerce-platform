import React, { useState } from 'react';

function PlaceOrder() {
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState('');

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: [{ id: 1, qty: 1 }] }),
      });
      const data = await res.json();
      setResult('Order placed! ID: ' + data.orderId);
    } catch {
      setResult('Order failed.');
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleOrder}>
        <input placeholder="User ID" value={userId}
          onChange={e => setUserId(e.target.value)} /><br />
        <button type="submit">Place Order</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}

export default PlaceOrder;