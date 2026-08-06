import { useState } from 'react';

const EditPrice = () => {
  const [productId, setProductId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to edit price
    console.log({ productId, newPrice });
  };

  return (
    <div className="edit-price">
      <h1>Edit Price</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Product ID:
          <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} required />
        </label>
        <label>
          New Price:
          <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
        </label>
        <button type="submit">Update Price</button>
      </form>
    </div>
  );
};

export default EditPrice;