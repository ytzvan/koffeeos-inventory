import React, { useState } from 'react';
import './Inventory.css';

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
    <table className="inventory-table">
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            {headers.map((h) => (
              <td key={h}>{item[h.toLowerCase()]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="inventory-container">
      <h2>Green Coffee</h2>
      <form onSubmit={handleSubmit(greenInput, setGreenInput, setGreenCoffee)} className="inventory-form">
        <input
          type="text"
          name="origin"
          value={greenInput.origin}
          onChange={handleChange(setGreenInput)}
          placeholder="Origin"
          required
        />
        <input
          type="number"
          name="weight"
          value={greenInput.weight}
          onChange={handleChange(setGreenInput)}
          placeholder="Weight (kg)"
          required
        />
        <input
          type="date"
          name="date"
          value={greenInput.date}
          onChange={handleChange(setGreenInput)}
          required
        />
        <button type="submit">Add</button>
      </form>
      {renderTable(greenCoffee, ['Origin', 'Weight', 'Date'])}

      <h2>Roasted Coffee</h2>
      <form onSubmit={handleSubmit(roastedInput, setRoastedInput, setRoastedCoffee)} className="inventory-form">
        <input
          type="text"
          name="blend"
          value={roastedInput.blend}
          onChange={handleChange(setRoastedInput)}
          placeholder="Blend"
          required
        />
        <input
          type="number"
          name="quantity"
          value={roastedInput.quantity}
          onChange={handleChange(setRoastedInput)}
          placeholder="Quantity (kg)"
          required
        />
        <input
          type="date"
          name="date"
          value={roastedInput.date}
          onChange={handleChange(setRoastedInput)}
          required
        />
        <button type="submit">Add</button>
      </form>
      {renderTable(roastedCoffee, ['Blend', 'Quantity', 'Date'])}

      <h2>Consumables</h2>
      <form onSubmit={handleSubmit(consumableInput, setConsumableInput, setConsumables)} className="inventory-form">
        <input
          type="text"
          name="item"
          value={consumableInput.item}
          onChange={handleChange(setConsumableInput)}
          placeholder="Item"
          required
        />
        <input
          type="number"
          name="quantity"
          value={consumableInput.quantity}
          onChange={handleChange(setConsumableInput)}
          placeholder="Quantity"
          required
        />
        <input
          type="text"
          name="unit"
          value={consumableInput.unit}
          onChange={handleChange(setConsumableInput)}
          placeholder="Unit"
          required
        />
        <button type="submit">Add</button>
      </form>
      {renderTable(consumables, ['Item', 'Quantity', 'Unit'])}
    </div>
  );
}

export default Inventory;

