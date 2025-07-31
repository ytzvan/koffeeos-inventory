import React, { useState } from 'react';

function Inventory() {
  const today = new Date().toISOString().split('T')[0];

  const producerCountries = [
    'Brazil',
    'Colombia',
    'Ethiopia',
    'Vietnam',
    'Indonesia',
    'Guatemala',
    'Mexico',
    'Peru',
    'Honduras',
    'Nicaragua',
    'Costa Rica',
    'Kenya',
    'Rwanda',
    'Uganda',
    'India',
  ];

  const [greenCoffee, setGreenCoffee] = useState([]);
  const [roastedCoffee, setRoastedCoffee] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [operations, setOperations] = useState([]);

  const [greenInput, setGreenInput] = useState({ origin: '', weight: '', unit: 'kg', date: today });
  const [roastedInput, setRoastedInput] = useState({ blend: '', roastLevel: '', quantity: '', unit: 'kg', date: today, notes: '' });
  const [consumableInput, setConsumableInput] = useState({ item: '', quantity: '', unit: 'grams' });
  const [operationInput, setOperationInput] = useState({ item: '', type: 'Add', quantity: '', unit: 'kg', date: today });

  const [editingGreen, setEditingGreen] = useState(null);
  const [savingGreen, setSavingGreen] = useState(false);

  const [editingRoasted, setEditingRoasted] = useState(null);
  const [savingRoasted, setSavingRoasted] = useState(false);

  const [editingConsumable, setEditingConsumable] = useState(null);
  const [savingConsumable, setSavingConsumable] = useState(false);
  const [editingOperation, setEditingOperation] = useState(null);
  const [savingOperation, setSavingOperation] = useState(false);

  const operationsWithTotals = () => {
    const totals = {};
    return operations.map((op) => {
      const qty = Number(op.quantity);
      const prev = totals[op.item] || 0;
      const newTotal = op.type === 'Add' ? prev + qty : prev - qty;
      totals[op.item] = newTotal;
      return { ...op, currentQty: `${newTotal} ${op.unit}` };
    });
  };

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

  const renderTable = (data, columns, onEdit) => (
    <table className="w-full border-collapse mb-8 text-sm">
      <thead>
        <tr className="bg-beige-dark">
          {columns.map((col) => (
            <th key={col.label} className="border px-2 py-1 text-left">
              {col.label}
            </th>
          ))}
          {onEdit && <th className="border px-2 py-1">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx} className="odd:bg-white even:bg-beige/50">
            {columns.map((col) => {
              const key = col.key;
              let value = item[key];
              if ((key === 'weight' || key === 'quantity') && item.unit) {
                value = `${value} ${item.unit}`;
              }
              return (
                <td key={col.label} className="border px-2 py-1">
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
        <select
          name="origin"
          value={greenInput.origin}
          onChange={handleChange(setGreenInput)}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="" disabled>
            Select Origin
          </option>
          {producerCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
      {renderTable(
        greenCoffee,
        [
          { label: 'Origin', key: 'origin' },
          { label: 'Weight', key: 'weight' },
          { label: 'Date', key: 'date' },
        ],
        (idx) => {
          setEditingGreen(idx);
          setGreenInput(greenCoffee[idx]);
        }
      )}

      <h2 className="text-xl font-semibold mb-3">Roasted Coffee</h2>
      <form
        onSubmit={
          editingRoasted !== null
            ? handleSave(
                editingRoasted,
                setRoastedCoffee,
                roastedInput,
                setRoastedInput,
                { blend: '', roastLevel: '', quantity: '', unit: 'kg', date: today, notes: '' },
                setSavingRoasted,
                setEditingRoasted
              )
            : handleAdd(
                roastedInput,
                setRoastedInput,
                setRoastedCoffee,
                { blend: '', roastLevel: '', quantity: '', unit: 'kg', date: today, notes: '' }
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
        <select
          name="roastLevel"
          value={roastedInput.roastLevel}
          onChange={handleChange(setRoastedInput)}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="" disabled>
            Roast Level
          </option>
          <option value="Light">Light</option>
          <option value="Medium">Medium</option>
          <option value="Dark">Dark</option>
        </select>
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
        <input
          type="text"
          name="notes"
          value={roastedInput.notes}
          onChange={handleChange(setRoastedInput)}
          placeholder="Notes"
          className="p-1 border rounded flex-1"
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
      {renderTable(
        roastedCoffee,
        [
          { label: 'Blend', key: 'blend' },
          { label: 'Roast Level', key: 'roastLevel' },
          { label: 'Quantity', key: 'quantity' },
          { label: 'Date', key: 'date' },
          { label: 'Notes', key: 'notes' },
        ],
        (idx) => {
          setEditingRoasted(idx);
          setRoastedInput(roastedCoffee[idx]);
        }
      )}

      <h2 className="text-xl font-semibold mb-3">Consumables</h2>
      <form
        onSubmit={
          editingConsumable !== null
            ? handleSave(
                editingConsumable,
                setConsumables,
                consumableInput,
                setConsumableInput,
                { item: '', quantity: '', unit: 'grams' },
                setSavingConsumable,
                setEditingConsumable
              )
            : handleAdd(
                consumableInput,
                setConsumableInput,
                setConsumables,
                { item: '', quantity: '', unit: 'grams' }
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
        <select
          name="unit"
          value={consumableInput.unit}
          onChange={handleChange(setConsumableInput)}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="grams">grams</option>
          <option value="kilograms">kilograms</option>
          <option value="ml">ml</option>
          <option value="liters">liters</option>
          <option value="boxes">boxes</option>
          <option value="units">units</option>
        </select>
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
      {renderTable(
        consumables,
        [
          { label: 'Item', key: 'item' },
          { label: 'Quantity', key: 'quantity' },
          { label: 'Unit', key: 'unit' },
        ],
        (idx) => {
          setEditingConsumable(idx);
          setConsumableInput(consumables[idx]);
        }
      )}

      <h2 className="text-xl font-semibold mb-3">Operations</h2>
      <form
        onSubmit={
          editingOperation !== null
            ? handleSave(
                editingOperation,
                setOperations,
                operationInput,
                setOperationInput,
                { item: '', type: 'Add', quantity: '', unit: 'kg', date: today },
                setSavingOperation,
                setEditingOperation
              )
            : handleAdd(
                operationInput,
                setOperationInput,
                setOperations,
                { item: '', type: 'Add', quantity: '', unit: 'kg', date: today }
              )
        }
        className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2"
      >
        <input
          type="text"
          name="item"
          value={operationInput.item}
          onChange={handleChange(setOperationInput)}
          placeholder="Item"
          className="p-1 border rounded flex-1"
          required
        />
        <select
          name="type"
          value={operationInput.type}
          onChange={handleChange(setOperationInput)}
          className="p-1 border rounded"
        >
          <option value="Add">Add</option>
          <option value="Remove">Remove</option>
        </select>
        <div className="flex flex-1 gap-1">
          <input
            type="number"
            name="quantity"
            value={operationInput.quantity}
            onChange={handleChange(setOperationInput)}
            placeholder="Quantity"
            className="p-1 border rounded flex-1"
            required
          />
          <select
            name="unit"
            value={operationInput.unit}
            onChange={handleChange(setOperationInput)}
            className="p-1 border rounded"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
            <option value="grams">grams</option>
            <option value="kilograms">kilograms</option>
            <option value="ml">ml</option>
            <option value="liters">liters</option>
            <option value="boxes">boxes</option>
            <option value="units">units</option>
          </select>
        </div>
        <input
          type="date"
          name="date"
          value={operationInput.date}
          onChange={handleChange(setOperationInput)}
          className="p-1 border rounded flex-1"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-beige-dark text-gray-800 rounded flex items-center justify-center min-w-[64px]"
          disabled={savingOperation}
        >
          {savingOperation ? (
            <span className="w-4 h-4 border-2 border-t-transparent border-gray-800 rounded-full animate-spin" />
          ) : editingOperation !== null ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </form>
      {renderTable(
        operationsWithTotals(),
        [
          { label: 'Item', key: 'item' },
          { label: 'Type', key: 'type' },
          { label: 'Quantity', key: 'quantity' },
          { label: 'Date', key: 'date' },
          { label: 'Current Qty', key: 'currentQty' },
        ],
        (idx) => {
          setEditingOperation(idx);
          setOperationInput(operations[idx]);
        }
      )}
    </div>
  );
}

export default Inventory;

