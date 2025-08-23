import React, { useEffect, useState } from 'react';
import RoastedCoffee from '../models/roastedCoffee';

function Inventory({ coffees, setCoffees, bags, setBags }) {
  const [greenInventory, setGreenInventory] = useState([]);
  const [roastedInventory, setRoastedInventory] = useState(
    coffees
      .filter((c) => c.isRoasted)
      .map((c) => ({ coffee: c, quantity: 0, unit: 'kg' }))
  );
  const [greenForm, setGreenForm] = useState({
    coffeeIndex: '',
    quantity: '',
    unit: 'kg',
  });
  const [espressoForm, setEspressoForm] = useState({ coffeeIndex: '', quantity: '' });
  const [espressoRefills, setEspressoRefills] = useState([]);

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

  const handleEspressoChange = (e) => {
    const { name, value } = e.target;
    setEspressoForm((prev) => ({ ...prev, [name]: value }));
  };

  const addEspressoRefill = (e) => {
    e.preventDefault();
    const entry = roastedInventory[espressoForm.coffeeIndex];
    if (!entry) return;
    const qty = parseFloat(espressoForm.quantity);
    if (isNaN(qty) || qty <= 0 || qty > entry.quantity) return;
    setRoastedInventory((prev) =>
      prev.map((r, i) =>
        i === parseInt(espressoForm.coffeeIndex, 10)
          ? { ...r, quantity: r.quantity - qty }
          : r
      )
    );
    setEspressoRefills((prev) => [
      ...prev,
      { coffee: entry.coffee, quantity: qty, unit: entry.unit },
    ]);
    setEspressoForm({ coffeeIndex: '', quantity: '' });
  };

  const editRoasted = (index) => {
    const entry = roastedInventory[index];
    const qty = parseFloat(prompt('New quantity?', entry.quantity));
    if (isNaN(qty) || qty < 0) return;
    const unit = prompt('Unit? (kg/lbs)', entry.unit);
    if (!unit) return;
    setRoastedInventory((prev) =>
      prev.map((r, i) => (i === index ? { ...r, quantity: qty, unit } : r))
    );
  };

  useEffect(() => {
    setRoastedInventory((prev) => {
      const keys = prev.map(
        (r) => `${r.coffee.name}-${r.coffee.roastLevel || ''}`
      );
      const additions = coffees
        .filter(
          (c) =>
            c.isRoasted &&
            !keys.includes(`${c.name}-${c.roastLevel || ''}`)
        )
        .map((c) => ({ coffee: c, quantity: 0, unit: 'kg' }));
      return [...prev, ...additions];
    });
  }, [coffees]);

  const createRoastFromGreen = (index) => {
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
    const existingIdx = roastedInventory.findIndex(
      (r) => r.coffee.name === entry.coffee.name && r.coffee.roastLevel === roastLevel
    );
    if (existingIdx !== -1) {
      setRoastedInventory((prev) =>
        prev.map((r, i) =>
          i === existingIdx ? { ...r, quantity: r.quantity + roastedQty } : r
        )
      );
    } else {
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
    }
    setGreenInventory((prev) =>
      prev.map((g, i) => (i === index ? { ...g, quantity: g.quantity - batch } : g))
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

  const getBagCount = (coffee) =>
    bags
      .filter((b) => b.coffee.name === coffee.name)
      .reduce((sum, b) => sum + b.numBags, 0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 dark:text-white rounded shadow-md mb-6 w-full">
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
      <div className="overflow-x-auto w-full mb-8">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-dark-green text-white">
            <th className="border px-2 py-1 text-left">Coffee</th>
            <th className="border px-2 py-1 text-left">Quantity</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {greenInventory.map((g, idx) => (
            <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
              <td className="border px-2 py-1">{g.coffee.name}</td>
              <td className="border px-2 py-1">
                {g.quantity} {g.unit}
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => createRoastFromGreen(idx)}
                  className="text-dark-green underline"
                >
                  Create Roast
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-dark-green">Roasted Coffee</h3>
      <div className="overflow-x-auto w-full">
      <table className="min-w-full border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-dark-green text-white">
            <th className="border px-2 py-1 text-left">Coffee</th>
            <th className="border px-2 py-1 text-left">Quantity</th>
            <th className="border px-2 py-1 text-left">Bags</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roastedInventory.map((r, idx) => (
            <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
              <td className="border px-2 py-1">{r.coffee.name}</td>
              <td className="border px-2 py-1">
                {r.quantity} {r.unit}
              </td>
              <td className="border px-2 py-1">{getBagCount(r.coffee)}</td>
              <td className="border px-2 py-1 text-center space-x-2">
                <button
                  type="button"
                  onClick={() => editRoasted(idx)}
                  className="text-blue-600 underline"
                >
                  Edit
                </button>
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

      <h3 className="text-lg font-semibold mb-2 text-dark-green">Espresso Refill</h3>
      <form onSubmit={addEspressoRefill} className="mb-4 flex flex-wrap gap-2 items-end">
        <select
          name="coffeeIndex"
          value={espressoForm.coffeeIndex}
          onChange={handleEspressoChange}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="" disabled>
            Select Roasted Coffee
          </option>
          {roastedInventory.map((r, idx) => (
            <option key={idx} value={idx}>
              {r.coffee.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={espressoForm.quantity}
          onChange={handleEspressoChange}
          placeholder="Quantity"
          className="p-1 border rounded flex-1"
          required
        />
        <button type="submit" className="px-3 py-1 bg-dark-green text-white rounded">
          Use
        </button>
      </form>
      {espressoRefills.length > 0 && (
        <div className="overflow-x-auto w-full mb-8">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Coffee</th>
                <th className="border px-2 py-1 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {espressoRefills.map((r, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{r.coffee.name}</td>
                  <td className="border px-2 py-1">
                    {r.quantity} {r.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Inventory;
