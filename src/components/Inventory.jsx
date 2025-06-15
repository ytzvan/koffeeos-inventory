import React, { useState } from 'react';

function Inventory() {
  const today = new Date().toISOString().split('T')[0];

  const [greenCoffee, setGreenCoffee] = useState([]);
  const [roastedCoffee, setRoastedCoffee] = useState([]);
  const [consumables, setConsumables] = useState([]);

  const [greenInput, setGreenInput] = useState({ origin: '', weight: '', unit: 'kg', date: today });
  const [roastedInput, setRoastedInput] = useState({ blend: '', quantity: '', unit: 'kg', date: today });
  const [consumableInput, setConsumableInput] = useState({ item: '', quantity: '', unit: '' });

  const [editingGreen, setEditingGreen] = useState(null);
  const [savingGreen, setSavingGreen] = useState(false);

  const [editingRoasted, setEditingRoasted] = useState(null);
  const [savingRoasted, setSavingRoasted] = useState(false);

  const [editingConsumable, setEditingConsumable] = useState(null);
  const [savingConsumable, setSavingConsumable] = useState(false);

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (input, setter, dataSetter, defaults) => (e) => {
    e.preventDefault();
    dataSetter((prev) => [...prev, input]);
    setter(defaults);
  };

  const handleSave = (index, dataSetter, input, setter, defaults, setSaving, setEditing) => (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      dataSetter((prev) => prev.map((item, i) => (i === index ? input : item)));
      setSaving(false);
      setEditing(null);
      setter(defaults);
    }, 1000);
  };

  const renderTable = (data, headers, onEdit) => (
    <table className="w-full border-collapse mb-8 text-sm">
      <thead>
        <tr className="bg-beige-dark">
          {headers.map((h) => (
            <th key={h} className="border px-2 py-1 text-left">
              {h}
            </th>
          ))}
          {onEdit && <th className="border px-2 py-1">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="odd:bg-white even:bg-beige/50">
            {headers.map((h) => {
              const key = h.toLowerCase();
              let value = item[key];
              if ((key === 'weight' || key === 'quantity') && item.unit) {
                value = `${value} ${item.unit}`;
              }
              return (
                <td key={h} className="border px-2 py-1">
                  {value}
                </td>
              );
            })}
            {onEdit && (
              <td className="border px-2 py-1 text-center">
                <button
                  type="button"
                  onClick={() => onEdit(idx)}
                  className="text-blue-600 underline"
                >
                  Edit
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-3">Green Coffee</h2>
      <form
        onSubmit={
          editingGreen !== null
            ? handleSave(
                editingGreen,
                setGreenCoffee,
                greenInput,
                setGreenInput,
                { origin: '', weight: '', unit: 'kg', date: today },
                setSavingGreen,
                setEditingGreen
              )
            : handleAdd(
                greenInput,
                setGreenInput,
                setGreenCoffee,
                { origin: '', weight: '', unit: 'kg', date: today }
              )
        }
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
        <div className="flex flex-1 gap-1">
          <input
            type="number"
            name="weight"
            value={greenInput.weight}
            onChange={handleChange(setGreenInput)}
            placeholder="Weight"
            className="p-1 border rounded flex-1"
            required
          />
          <select
            name="unit"
            value={greenInput.unit}
            onChange={handleChange(setGreenInput)}
            className="p-1 border rounded"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <input
          type="date"
          name="date"
          value={greenInput.date}
          onChange={handleChange(setGreenInput)}
          className="p-1 border rounded flex-1"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-beige-dark text-gray-800 rounded flex items-center justify-center min-w-[64px]"
          disabled={savingGreen}
        >
          {savingGreen ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-gray-800 rounded-full animate-spin" />
          ) : editingGreen !== null ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </form>
      {renderTable(greenCoffee, ['Origin', 'Weight', 'Date'], (idx) => {
        setEditingGreen(idx);
        setGreenInput(greenCoffee[idx]);
      })}

      <h2 className="text-xl font-semibold mb-3">Roasted Coffee</h2>
      <form
        onSubmit={
          editingRoasted !== null
            ? handleSave(
                editingRoasted,
                setRoastedCoffee,
                roastedInput,
                setRoastedInput,
                { blend: '', quantity: '', unit: 'kg', date: today },
                setSavingRoasted,
                setEditingRoasted
              )
            : handleAdd(
                roastedInput,
                setRoastedInput,
                setRoastedCoffee,
                { blend: '', quantity: '', unit: 'kg', date: today }
              )
        }
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
        <div className="flex flex-1 gap-1">
          <input
            type="number"
            name="quantity"
            value={roastedInput.quantity}
            onChange={handleChange(setRoastedInput)}
            placeholder="Quantity"
            className="p-1 border rounded flex-1"
            required
          />
          <select
            name="unit"
            value={roastedInput.unit}
            onChange={handleChange(setRoastedInput)}
            className="p-1 border rounded"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <input
          type="date"
          name="date"
          value={roastedInput.date}
          onChange={handleChange(setRoastedInput)}
          className="p-1 border rounded flex-1"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-beige-dark text-gray-800 rounded flex items-center justify-center min-w-[64px]"
          disabled={savingRoasted}
        >
          {savingRoasted ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-gray-800 rounded-full animate-spin" />
          ) : editingRoasted !== null ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </form>
      {renderTable(roastedCoffee, ['Blend', 'Quantity', 'Date'], (idx) => {
        setEditingRoasted(idx);
        setRoastedInput(roastedCoffee[idx]);
      })}

      <h2 className="text-xl font-semibold mb-3">Consumables</h2>
      <form
        onSubmit={
          editingConsumable !== null
            ? handleSave(
                editingConsumable,
                setConsumables,
                consumableInput,
                setConsumableInput,
                { item: '', quantity: '', unit: '' },
                setSavingConsumable,
                setEditingConsumable
              )
            : handleAdd(
                consumableInput,
                setConsumableInput,
                setConsumables,
                { item: '', quantity: '', unit: '' }
              )
        }
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
        <button
          type="submit"
          className="px-3 py-1 bg-beige-dark text-gray-800 rounded flex items-center justify-center min-w-[64px]"
          disabled={savingConsumable}
        >
          {savingConsumable ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-gray-800 rounded-full animate-spin" />
          ) : editingConsumable !== null ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </form>
      {renderTable(consumables, ['Item', 'Quantity', 'Unit'], (idx) => {
        setEditingConsumable(idx);
        setConsumableInput(consumables[idx]);
      })}
    </div>
  );
}

export default Inventory;

