import React, { useState } from 'react';

function Inventory() {
  const [greenCoffee, setGreenCoffee] = useState([]);
  const [roastedCoffee, setRoastedCoffee] = useState([]);
  const [consumables, setConsumables] = useState([]);

  const [greenInput, setGreenInput] = useState({ origin: '', weight: '', date: '' });
  const [roastedInput, setRoastedInput] = useState({ blend: '', quantity: '', date: '' });
  const [consumableInput, setConsumableInput] = useState({ item: '', quantity: '', unit: '' });

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (input, setter, dataSetter) => (e) => {
    e.preventDefault();
    dataSetter((prev) => [...prev, input]);
    setter(Object.fromEntries(Object.keys(input).map((key) => [key, ''])));
  };

  const renderTable = (data, headers) => (
    <table className="w-full border-collapse mb-8 text-sm">
      <thead>
        <tr className="bg-beige-dark">
          {headers.map((h) => (
            <th key={h} className="border px-2 py-1 text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="odd:bg-white even:bg-beige/50">
            {headers.map((h) => (
              <td key={h} className="border px-2 py-1">
                {item[h.toLowerCase()]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-3">Green Coffee</h2>
      <form
        onSubmit={handleSubmit(greenInput, setGreenInput, setGreenCoffee)}
        className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2"
      >
        <input
          type="text"
          name="origin"
          value={greenInput.origin}
          onChange={handleChange(setGreenInput)}
          placeholder="Origin"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="number"
          name="weight"
          value={greenInput.weight}
          onChange={handleChange(setGreenInput)}
          placeholder="Weight (kg)"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="date"
          name="date"
          value={greenInput.date}
          onChange={handleChange(setGreenInput)}
          className="p-1 border rounded flex-1"
          required
        />
        <button type="submit" className="px-3 py-1 bg-beige-dark text-gray-800 rounded">
          Add
        </button>
      </form>
      {renderTable(greenCoffee, ['Origin', 'Weight', 'Date'])}

      <h2 className="text-xl font-semibold mb-3">Roasted Coffee</h2>
      <form
        onSubmit={handleSubmit(roastedInput, setRoastedInput, setRoastedCoffee)}
        className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2"
      >
        <input
          type="text"
          name="blend"
          value={roastedInput.blend}
          onChange={handleChange(setRoastedInput)}
          placeholder="Blend"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="number"
          name="quantity"
          value={roastedInput.quantity}
          onChange={handleChange(setRoastedInput)}
          placeholder="Quantity (kg)"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="date"
          name="date"
          value={roastedInput.date}
          onChange={handleChange(setRoastedInput)}
          className="p-1 border rounded flex-1"
          required
        />
        <button type="submit" className="px-3 py-1 bg-beige-dark text-gray-800 rounded">
          Add
        </button>
      </form>
      {renderTable(roastedCoffee, ['Blend', 'Quantity', 'Date'])}

      <h2 className="text-xl font-semibold mb-3">Consumables</h2>
      <form
        onSubmit={handleSubmit(consumableInput, setConsumableInput, setConsumables)}
        className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2"
      >
        <input
          type="text"
          name="item"
          value={consumableInput.item}
          onChange={handleChange(setConsumableInput)}
          placeholder="Item"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="number"
          name="quantity"
          value={consumableInput.quantity}
          onChange={handleChange(setConsumableInput)}
          placeholder="Quantity"
          className="p-1 border rounded flex-1"
          required
        />
        <input
          type="text"
          name="unit"
          value={consumableInput.unit}
          onChange={handleChange(setConsumableInput)}
          placeholder="Unit"
          className="p-1 border rounded flex-1"
          required
        />
        <button type="submit" className="px-3 py-1 bg-beige-dark text-gray-800 rounded">
          Add
        </button>
      </form>
      {renderTable(consumables, ['Item', 'Quantity', 'Unit'])}
    </div>
  );
}

export default Inventory;

