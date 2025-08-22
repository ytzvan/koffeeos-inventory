import React, { useState } from 'react';
import countries from '../models/countries';
import providers from '../models/providers';
import CoffeeModel from '../models/coffee';
import RoastedCoffee from '../models/roastedCoffee';

function Coffee({ coffees, setCoffees }) {
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
    isRoasted: false,
    roastLevel: '',
    loss: '',
    purchasePrice: '',
  };

  const [form, setForm] = useState(initialForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOriginChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
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
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCoffee = form.isRoasted
      ? new RoastedCoffee(form)
      : new CoffeeModel(form);
    if (editingIndex !== null) {
      setCoffees((prev) => prev.map((c, i) => (i === editingIndex ? newCoffee : c)));
    } else {
      setCoffees((prev) => [...prev, newCoffee]);
    }
    setForm(initialForm);
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setForm({ ...coffees[idx] });
    setEditingIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => {
    setCoffees((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setForm(initialForm);
      setEditingIndex(null);
      setShowForm(false);
    }
  };

  const handleCreateRoast = (idx) => {
    const green = coffees[idx];
    setForm({
      ...green,
      isRoasted: true,
      roastLevel: '',
      loss: '',
      purchasePrice: '',
    });
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setForm(initialForm);
    setEditingIndex(null);
    setShowForm(true);
  };

  const renderRow = (coffee, idx) => (
    <tr key={idx} className="odd:bg-white even:bg-dark-green/5">
      <td className="border px-2 py-1">{coffee.name}</td>
      <td className="border px-2 py-1">{coffee.origins.join(', ')}</td>
      <td className="border px-2 py-1">{coffee.producer}</td>
      <td className="border px-2 py-1">{coffee.farm}</td>
      <td className="border px-2 py-1">{coffee.region}</td>
      <td className="border px-2 py-1">{coffee.process}</td>
      <td className="border px-2 py-1">{coffee.varietal}</td>
      <td className="border px-2 py-1">{coffee.altitude}</td>
      <td className="border px-2 py-1">{coffee.tastingNotes}</td>
      <td className="border px-2 py-1">{coffee.isRoasted ? 'Roasted' : 'Green'}</td>
      <td className="border px-2 py-1">{coffee.isRoasted ? coffee.roastLevel : ''}</td>
      <td className="border px-2 py-1">{coffee.isRoasted ? coffee.loss : ''}</td>
      <td className="border px-2 py-1">{coffee.purchasePrice}</td>
      <td className="border px-2 py-1 text-center">
        {!coffee.isRoasted && (
          <button
            type="button"
            onClick={() => handleCreateRoast(idx)}
            className="text-dark-green underline mr-2"
          >
            Create Roast
          </button>
        )}
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

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Coffees</h2>
      <button
        type="button"
        onClick={handleAddNew}
        className="mb-4 px-3 py-1 bg-dark-green text-white rounded"
      >
        Add Coffee
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
              {p.name} - {p.farm}
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
        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="isRoasted"
              checked={!form.isRoasted}
              onChange={() => setForm((prev) => ({ ...prev, isRoasted: false }))}
            />
            Green
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="isRoasted"
              checked={form.isRoasted}
              onChange={() => setForm((prev) => ({ ...prev, isRoasted: true }))}
            />
            Roasted
          </label>
        </div>
        {form.isRoasted ? (
          <>
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
          </>
        ) : (
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
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1 bg-dark-green text-white rounded min-w-[64px]"
          >
            {editingIndex !== null ? 'Save' : 'Add'}
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
              <th className="border px-2 py-1 text-left">Type</th>
              <th className="border px-2 py-1 text-left">Roast Level</th>
              <th className="border px-2 py-1 text-left">% Loss</th>
              <th className="border px-2 py-1 text-left">Purchase Price</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>{coffees.map((c, idx) => renderRow(c, idx))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default Coffee;
