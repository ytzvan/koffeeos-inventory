import React, { useState } from 'react';
import countries from '../models/countries';
import RoastedCoffeeModel from '../models/roastedCoffee';

function RoastedCoffee({
  roastedCoffees,
  setRoastedCoffees,
  providers,
  inventory,
  setInventory,
}) {
  const initialForm = {
    name: '',
    origins: [],
    providerId: '',
    producer: '',
    farm: '',
    region: '',
    process: '',
    varietal: '',
    altitude: '',
    tastingNotes: '',
    roastLevel: '',
    loss: '',
    purchasePrice: '',
  };

  const [form, setForm] = useState(initialForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOriginChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, origins: selected }));
  };

  const handleProviderChange = (e) => {
    const providerId = e.target.value;
    const provider = providers.find((p) => p.id === providerId);
    setForm((prev) => ({
      ...prev,
      providerId,
      producer: provider?.name || '',
      farm: provider?.farm || '',
      region: provider?.region || '',
      altitude: provider?.altitude || '',
      origins: provider ? [provider.country] : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const updated = new RoastedCoffeeModel(form);
      if (editingIndex !== null) {
        setRoastedCoffees((prev) =>
          prev.map((c, i) => (i === editingIndex ? updated : c))
        );
      } else {
        setRoastedCoffees((prev) => [...prev, updated]);
      }
      setInventory((prev) => ({
        ...prev,
        roasted: { ...prev.roasted, [updated.id]: prev.roasted[updated.id] || 0 },
      }));
      setForm(initialForm);
      setEditingIndex(null);
      setShowForm(false);
      showToast('Coffee saved');
    } catch (err) {
      showToast('Error saving coffee', true);
    }
  };

  const handleEdit = (idx) => {
    setForm({ ...roastedCoffees[idx] });
    setEditingIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    const coffee = roastedCoffees[idx];
    setRoastedCoffees((prev) => prev.filter((_, i) => i !== idx));
    setInventory((prev) => {
      const r = { ...prev.roasted };
      delete r[coffee.id];
      return { ...prev, roasted: r };
    });
    if (editingIndex === idx) {
      setForm(initialForm);
      setEditingIndex(null);
      setShowForm(false);
    }
  };

  const renderRow = (coffee, idx) => (
    <tr key={coffee.id} className="odd:bg-dark-green/5 even:bg-white">
      <td className="border px-2 py-1">{coffee.name}</td>
      <td className="border px-2 py-1">{coffee.origins.join(', ')}</td>
      <td className="border px-2 py-1">{coffee.producer}</td>
      <td className="border px-2 py-1">{coffee.farm}</td>
      <td className="border px-2 py-1">{coffee.region}</td>
      <td className="border px-2 py-1">{coffee.process}</td>
      <td className="border px-2 py-1">{coffee.varietal}</td>
      <td className="border px-2 py-1">{coffee.altitude}</td>
      <td className="border px-2 py-1">{coffee.tastingNotes}</td>
      <td className="border px-2 py-1">{coffee.roastLevel}</td>
      <td className="border px-2 py-1">{coffee.loss}</td>
      <td className="border px-2 py-1">{inventory.roasted[coffee.id] || 0}</td>
      <td className="border px-2 py-1">{coffee.purchasePrice}</td>
      <td className="border px-2 py-1 text-center">
        <button
          type="button"
          onClick={() => handleEdit(idx)}
          className="text-blue-600 underline mr-2"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => handleDelete(idx)}
          className="text-red-600 underline"
        >
          Delete
        </button>
      </td>
    </tr>
  );

  const handleAddNew = () => {
    setForm(initialForm);
    setEditingIndex(null);
    setShowForm(true);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 dark:text-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Roasted Coffee</h2>
      <button
        type="button"
        onClick={handleAddNew}
        className="mb-4 px-3 py-1 bg-dark-green text-white rounded"
      >
        Add Roasted Coffee
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Coffee Name"
            className="p-1 border rounded"
            required
          />
          <select
            name="origins"
            multiple
            value={form.origins}
            onChange={handleOriginChange}
            className="p-1 border rounded"
            required
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            name="providerId"
            value={form.providerId}
            onChange={handleProviderChange}
            className="p-1 border rounded"
            required
          >
            <option value="" disabled>
              Provider
            </option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.farm} ({p.country})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="producer"
            value={form.producer}
            onChange={handleChange}
            placeholder="Producer Name"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="farm"
            value={form.farm}
            onChange={handleChange}
            placeholder="Farm"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="Region"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="process"
            value={form.process}
            onChange={handleChange}
            placeholder="Process"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="varietal"
            value={form.varietal}
            onChange={handleChange}
            placeholder="Varietal"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="altitude"
            value={form.altitude}
            onChange={handleChange}
            placeholder="Altitude"
            className="p-1 border rounded"
            required
          />
          <input
            type="text"
            name="tastingNotes"
            value={form.tastingNotes}
            onChange={handleChange}
            placeholder="Tasting Notes"
            className="p-1 border rounded"
            required
          />
          <select
            name="roastLevel"
            value={form.roastLevel}
            onChange={handleChange}
            className="p-1 border rounded"
            required
          >
            <option value="" disabled>
              Roast Level
            </option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
          <input
            type="number"
            name="loss"
            value={form.loss}
            onChange={handleChange}
            placeholder="% Loss"
            className="p-1 border rounded"
            required
          />
          <input
            type="number"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="Purchase Price"
            className="p-1 border rounded"
            required
            step="0.01"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-3 py-1 bg-dark-green text-white rounded min-w-[64px]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditingIndex(null);
                setShowForm(false);
              }}
              className="px-3 py-1 bg-gray-200 rounded min-w-[64px]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="p-1 border rounded mb-2"
        />
        <table className="min-w-full border-collapse mb-8 text-sm">
          <thead>
            <tr className="bg-dark-green text-white">
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Origins</th>
              <th className="border px-2 py-1 text-left">Producer</th>
              <th className="border px-2 py-1 text-left">Farm</th>
              <th className="border px-2 py-1 text-left">Region</th>
              <th className="border px-2 py-1 text-left">Process</th>
              <th className="border px-2 py-1 text-left">Varietal</th>
              <th className="border px-2 py-1 text-left">Altitude</th>
              <th className="border px-2 py-1 text-left">Tasting Notes</th>
              <th className="border px-2 py-1 text-left">Roast Level</th>
              <th className="border px-2 py-1 text-left">% Loss</th>
              <th className="border px-2 py-1 text-left">Available (kg)</th>
              <th className="border px-2 py-1 text-left">Purchase Price</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roastedCoffees
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((c, idx) => renderRow(c, idx))}
          </tbody>
        </table>
      </div>
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-md text-white ${
            toast.isError ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default RoastedCoffee;
