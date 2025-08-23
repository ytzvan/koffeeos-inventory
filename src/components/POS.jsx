import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function POS() {
  const { bags, setBags, sales, setSales } = useAppContext();
  const [bagIndex, setBagIndex] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  const sell = (e) => {
    e.preventDefault();
    const bag = bags[bagIndex];
    const qty = parseInt(quantity, 10);
    if (!bag || qty <= 0 || bag.numBags < qty) return;
    setSales((prev) => [
      ...prev,
      { bag, quantity: qty, total: qty * bag.retailPrice },
    ]);
    setBags((prev) =>
      prev.map((b, idx) =>
        idx === parseInt(bagIndex, 10)
          ? { ...b, numBags: b.numBags - qty }
          : b
      )
    );
    setBagIndex('');
    setQuantity(1);
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold text-dark-green">POS</h2>
        <button
          onClick={toggleFullScreen}
          className="px-3 py-1 bg-dark-green text-white rounded"
        >
          {fullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      {bags.length === 0 ? (
        <p>No bags available</p>
      ) : (
        <form onSubmit={sell} className="flex flex-wrap gap-2 items-end mb-4">
          <select
            value={bagIndex}
            onChange={(e) => setBagIndex(e.target.value)}
            className="p-1 border rounded flex-1"
            required
          >
            <option value="" disabled>
              Select Bag
            </option>
            {bags.map((b, idx) => (
              <option key={idx} value={idx}>
                {b.coffee.name} {b.bagWeight}g ({b.numBags} available)
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-1 border rounded w-24"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-dark-green text-white rounded"
          >
            Sell
          </button>
        </form>
      )}
    </div>
  );
}

export default POS;

