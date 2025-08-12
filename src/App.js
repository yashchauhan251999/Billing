

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [price, setPrice] = useState('');
  const priceInputRef = useRef(null);
  const itemRefs = useRef([]);
  const [focusedItem, setFocusedItem] = useState(-1); // -1 means input is focused

  const handleAddItem = () => {
    const value = parseFloat(price);
    if (!isNaN(value) && value > 0) {
      setItems([...items, value]);
      setPrice('');
    }
    setFocusedItem(-1);
    if (priceInputRef.current) {
      priceInputRef.current.focus();
    }
  };

  // Remove item by index
  const handleRemoveItem = useCallback((idxToDelete) => {
    setItems(items => items.filter((_, idx) => idx !== idxToDelete));
    setFocusedItem(-1);
    setTimeout(() => {
      if (priceInputRef.current) priceInputRef.current.focus();
    }, 0);
  }, []);

  // Keyboard navigation: focus items on 'f', move with arrows, remove with Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === priceInputRef.current && e.key.toLowerCase() === 'f') {
        if (items.length > 0) {
          setFocusedItem(0);
          setTimeout(() => {
            if (itemRefs.current[0]) itemRefs.current[0].focus();
          }, 0);
        }
      } else if (focusedItem >= 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (focusedItem + 1) % items.length;
          setFocusedItem(next);
          setTimeout(() => {
            if (itemRefs.current[next]) itemRefs.current[next].focus();
          }, 0);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (focusedItem - 1 + items.length) % items.length;
          setFocusedItem(prev);
          setTimeout(() => {
            if (itemRefs.current[prev]) itemRefs.current[prev].focus();
          }, 0);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleRemoveItem(focusedItem);
        } else if (e.key === 'Escape') {
          setFocusedItem(-1);
          setTimeout(() => {
            if (priceInputRef.current) priceInputRef.current.focus();
          }, 0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedItem, handleRemoveItem]);



  const total = items.reduce((sum, item) => sum + item, 0);
  const discount = total * 0.15;
  const netAmount = total - discount;

  return (
    <div className="App" style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}>
      <h2 style={{ marginBottom: 0 }}>SS Garments</h2>
      <div style={{ color: '#555', marginBottom: 24 }}>123, Main Street, City</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="number"
          min="0"
          placeholder="Enter item price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
          ref={priceInputRef}
          onKeyDown={e => {
            if (e.code === 'Space' || e.key === ' ') {
              e.preventDefault();
              handleAddItem();
            }
          }}
          autoFocus
        />
        <button onClick={handleAddItem} style={{ padding: '8px 16px', fontSize: 16 }}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
        {items.map((item, idx) => (
          <li
            key={idx}
            ref={el => itemRefs.current[idx] = el}
            tabIndex={0}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: '1px solid #eee',
              fontSize: 16,
              gap: 8,
              outline: focusedItem === idx ? '2px solid #1976d2' : 'none',
              background: focusedItem === idx ? '#e3f2fd' : 'transparent',
              borderRadius: 4
            }}
            onFocus={() => setFocusedItem(idx)}
            onBlur={() => setFocusedItem(-1)}
          >
            <span>Item {idx + 1}</span>
            <span style={{ fontWeight: 500 }}>₹{item.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
        <span>MRP Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#388e3c', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
        <span>Flat 15% OFF</span>
        <span>-₹{discount.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
        <span>Net Amount</span>
        <span>₹{netAmount.toFixed(2)}</span>
      </div>
      <hr style={{ margin: '18px 0', border: 'none', borderTop: '1.5px solid #bbb' }} />
      <div style={{ textAlign: 'center', fontWeight: 500, fontSize: 16, color: '#444' }}>Thank you for shopping</div>
    </div>
  );
}

export default App;
