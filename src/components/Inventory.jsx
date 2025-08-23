import React, { useEffect, useState } from 'react';
import RoastedCoffee from '../models/roastedCoffee';

function Inventory({ greenCoffees, roastedCoffees, setRoastedCoffees, bags, setBags }) {
  const [greenInventory, setGreenInventory] = useState([]);
  const [roastedInventory, setRoastedInventory] = useState(
    roastedCoffees.map((c) => ({ coffee: c, quantity: 0, unit: 'kg' }))
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
    const coffee = greenCoffees[greenForm.coffeeIndex];
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
      const keys = prev.map((r) => `${r.coffee.name}-${r.coffee.roastLevel || ''}`);
      const additions = roastedCoffees
        .filter((c) => !keys.includes(`${c.name}-${c.roastLevel || ''}`))
        .map((c) => ({ coffee: c, quantity: 0, unit: 'kg' }));
      return [...prev, ...additions];
    });
  }, [roastedCoffees]);

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
      setRoastedCoffees((prev) => [...prev, roastedCoffee]);
      setRoastedInventory((prev) => [
        ...prev,
        { coffee: roastedCoffee, quantity: roastedQty, unit: entry.unit },
      ]);
    }
    setGreenInventory((prev) =>
      prev.map((g, i) => (i === index ? { ...g, quantity: g.quantity - batch } : g))
    );
  };

  const [bagForm, setBagForm] = useState(null);

  const toGrams = (qty, unit) =>
    unit === 'kg' ? qty * 1000 : unit === 'lbs' ? qty * 453.592 : qty;
  const gramsToUnit = (g, unit) =>
    unit === 'kg' ? g / 1000 : unit === 'lbs' ? g / 453.592 : g;

  const startBagging = (index) =>
    setBagForm({
      index,
      bagWeight: 250,
      numBags: 1,
      costPrice: '',
      retailPrice: '',
    });

  const handleBagChange = (e) => {
    const { name, value } = e.target;
    setBagForm((prev) => {
      if (name === 'bagWeight') {
        const entry = roastedInventory[prev.index];
        const max = Math.floor(
          toGrams(entry.quantity, entry.unit) / parseInt(value, 10)
        );
        return {
          ...prev,
          bagWeight: parseInt(value, 10),
          numBags: Math.min(prev.numBags, Math.max(max, 1)),
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const submitBagForm = (e) => {
    e.preventDefault();
    if (!bagForm) return;
    const entry = roastedInventory[bagForm.index];
    const bw = parseFloat(bagForm.bagWeight);
    const nb = parseInt(bagForm.numBags, 10);
    const cp = parseFloat(bagForm.costPrice);
    const rp = parseFloat(bagForm.retailPrice);
    if ([bw, nb, cp, rp].some((v) => isNaN(v) || v <= 0)) return;
    const totalGrams = bw * nb;
    const availableGrams = toGrams(entry.quantity, entry.unit);
    if (totalGrams > availableGrams) return;
    const newQty = gramsToUnit(availableGrams - totalGrams, entry.unit);
    setRoastedInventory((prev) =>
      prev.map((r, i) =>
        i === bagForm.index ? { ...r, quantity: parseFloat(newQty.toFixed(2)) } : r
      )
    );
    setBags((prev) => [
      ...prev,
      {
        coffee: entry.coffee,
        bagWeight: bw,
        numBags: nb,
        costPrice: cp,
        retailPrice: rp,
      },
    ]);
    setBagForm(null);
  };

  const cancelBagForm = () => setBagForm(null);

  const getBagCount = (coffee) =>
    bags
      .filter((b) => b.coffee.name === coffee.name)
      .reduce((sum, b) => sum + b.numBags, 0);

  const bagEntry = bagForm ? roastedInventory[bagForm.index] : null;
  const bagAvailable = bagEntry ? toGrams(bagEntry.quantity, bagEntry.unit) : 0;
  const bagMax = bagEntry ? Math.floor(bagAvailable / bagForm.bagWeight) : 0;
  const bagLeft = bagEntry
    ? gramsToUnit(
        Math.max(bagAvailable - bagForm.bagWeight * bagForm.numBags, 0),
        bagEntry.unit
      )
    : 0;

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
          {greenCoffees.map((c, idx) => (
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
              <React.Fragment key={idx}>
                <tr className="odd:bg-dark-green/5 even:bg-white">
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
                      onClick={() => startBagging(idx)}
                      className="text-dark-green underline"
                    >
                      Create Bag
                    </button>
                  </td>
                </tr>
                {bagForm && bagForm.index === idx && (
                  <tr>
                    <td colSpan="4" className="border px-2 py-2 bg-dark-green/10">
                      {bagMax > 0 ? (
                        <form
                          onSubmit={submitBagForm}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <label className="flex items-center gap-1">
                            Size (g)
                            <select
                              name="bagWeight"
                              value={bagForm.bagWeight}
                              onChange={handleBagChange}
                              className="border p-1 rounded"
                            >
                              <option value={250}>250</option>
                              <option value={500}>500</option>
                              <option value={1000}>1000</option>
                            </select>
                          </label>
                          <label className="flex items-center gap-2 flex-1">
                            Bags
                            <input
                              type="range"
                              name="numBags"
                              min="1"
                              max={bagMax}
                              value={bagForm.numBags}
                              onChange={handleBagChange}
                              className="flex-1"
                            />
                            <span>{bagForm.numBags}</span>
                          </label>
                          <span className="text-sm">
                            Left: {bagLeft.toFixed(2)} {bagEntry.unit}
                          </span>
                          <input
                            type="number"
                            name="costPrice"
                            value={bagForm.costPrice}
                            onChange={handleBagChange}
                            placeholder="Cost"
                            className="border p-1 rounded w-20"
                            required
                          />
                          <input
                            type="number"
                            name="retailPrice"
                            value={bagForm.retailPrice}
                            onChange={handleBagChange}
                            placeholder="Retail"
                            className="border p-1 rounded w-20"
                            required
                          />
                          <button
                            type="submit"
                            className="px-2 py-1 bg-dark-green text-white rounded"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelBagForm}
                            className="px-2 py-1 underline text-red-600"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span>Not enough coffee for selected size.</span>
                          <button
                            type="button"
                            onClick={cancelBagForm}
                            className="px-2 py-1 underline text-red-600"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {bags.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2 text-dark-green">
            Bags for Sale
          </h3>
          <div className="overflow-x-auto w-full mb-8">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-dark-green text-white">
                  <th className="border px-2 py-1 text-left">Coffee</th>
                  <th className="border px-2 py-1 text-left">Bag Size (g)</th>
                  <th className="border px-2 py-1 text-left">Bags</th>
                  <th className="border px-2 py-1 text-left">Cost Price</th>
                  <th className="border px-2 py-1 text-left">Retail Price</th>
                </tr>
              </thead>
              <tbody>
                {bags.map((b, i) => (
                  <tr key={i} className="odd:bg-dark-green/5 even:bg-white">
                    <td className="border px-2 py-1">{b.coffee.name}</td>
                    <td className="border px-2 py-1">{b.bagWeight}</td>
                    <td className="border px-2 py-1">{b.numBags}</td>
                    <td className="border px-2 py-1">{b.costPrice}</td>
                    <td className="border px-2 py-1">{b.retailPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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
