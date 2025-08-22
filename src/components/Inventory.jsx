import React, { useState } from 'react';
import RoastedCoffee from '../models/roastedCoffee';

function Inventory({ coffees, setCoffees, bags, setBags }) {
  const [greenInventory, setGreenInventory] = useState([]);
  const [roastedInventory, setRoastedInventory] = useState([]);
  const [greenForm, setGreenForm] = useState({ coffeeIndex: '', quantity: '', unit: 'kg' });

  const handleGreenChange = (e) => {
    const { name, value } = e.target;
    setGreenForm((prev) => ({ ...prev, [name]: value }));
  };

  const addGreen = (e) => {
    e.preventDefault();
    const coffee = coffees[greenForm.coffeeIndex];
    setGreenInventory((prev) => [
      ...prev,
      { coffee, quantity: parseFloat(greenForm.quantity), unit: greenForm.unit },
    ]);
    setGreenForm({ coffeeIndex: '', quantity: '', unit: 'kg' });
  };

  const createRoast = (index) => {
    const entry = greenInventory[index];
    const batch = parseFloat(prompt('Green coffee quantity to roast?'));
    const roastLevel = prompt('Roast level? (Light/Medium/Dark)');
    const loss = parseFloat(prompt('Percent weight loss?'));
    if (
      isNaN(batch) ||
      isNaN(loss) ||
      !roastLevel ||
      batch <= 0 ||
      batch > entry.quantity
    )
      return;
    const roastedQty = batch * (1 - loss / 100);
    const roastedCoffee = new RoastedCoffee({
      ...entry.coffee,
      roastLevel,
      loss: String(loss),
    });
    setCoffees((prev) => [...prev, roastedCoffee]);
    setRoastedInventory((prev) => [
      ...prev,
      { coffee: roastedCoffee, quantity: roastedQty, unit: entry.unit },
    ]);
    setGreenInventory((prev) =>
      prev.map((g, i) =>
        i === index ? { ...g, quantity: g.quantity - batch } : g
      )
    );
  };

  const createBag = (index) => {
    const entry = roastedInventory[index];
    const bagWeight = parseFloat(prompt('Bag weight?'));
    const numBags = parseInt(prompt('Number of bags?'), 10);
    const costPrice = parseFloat(prompt('Cost price per bag?'));
    const retailPrice = parseFloat(prompt('Retail price per bag?'));
    if (
      [bagWeight, numBags, costPrice, retailPrice].some((v) =>
        isNaN(v)
      )
    )
      return;
    const totalWeight = bagWeight * numBags;
    if (totalWeight > entry.quantity) return;
    setRoastedInventory((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, quantity: r.quantity - totalWeight } : r
      )
    );
    setBags((prev) => [
      ...prev,
      {
        coffee: entry.coffee,
        bagWeight,
        numBags,
        costPrice,
        retailPrice,
      },
    ]);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Inventory</h2>
      <form onSubmit={addGreen} className="mb-4 flex flex-wrap gap-2 items-end">
        <select
          name="coffeeIndex"
          value={greenForm.coffeeIndex}
          onChange={handleGreenChange}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="" disabled>
            Select Green Coffee
          </option>
          {coffees
            .map((c, idx) => ({ c, idx }))
            .filter(({ c }) => !c.isRoasted)
            .map(({ c, idx }) => (
              <option key={idx} value={idx}>
                {c.name}
              </option>
            ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={greenForm.quantity}
          onChange={handleGreenChange}
          placeholder="Quantity"
          className="p-1 border rounded flex-1"
          required
        />
        <select
          name="unit"
          value={greenForm.unit}
          onChange={handleGreenChange}
          className="p-1 border rounded"
        >
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
        <button type="submit" className="px-3 py-1 bg-dark-green text-white rounded">
          Add
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2 text-dark-green">Green Coffee</h3>
      <table className="w-full border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-dark-green text-white">
            <th className="border px-2 py-1 text-left">Coffee</th>
            <th className="border px-2 py-1 text-left">Quantity</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {greenInventory.map((g, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-dark-green/5">
              <td className="border px-2 py-1">{g.coffee.name}</td>
              <td className="border px-2 py-1">
                {g.quantity} {g.unit}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => createRoast(idx)}
                  className="text-dark-green underline"
                >
                  Create Roast
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2 text-dark-green">Roasted Coffee</h3>
      <table className="w-full border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-dark-green text-white">
            <th className="border px-2 py-1 text-left">Coffee</th>
            <th className="border px-2 py-1 text-left">Quantity</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roastedInventory.map((r, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-dark-green/5">
              <td className="border px-2 py-1">{r.coffee.name}</td>
              <td className="border px-2 py-1">
                {r.quantity} {r.unit}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => createBag(idx)}
                  className="text-dark-green underline"
                >
                  Create Bag
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
