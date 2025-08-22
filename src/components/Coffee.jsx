import React, { useState } from 'react';

function Coffee() {
  const initialForm = {
    name: '',
    origin: '',
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
  };

  const [form, setForm] = useState(initialForm);
  const [coffees, setCoffees] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      setCoffees((prev) => prev.map((c, i) => (i === editingIndex ? form : c)));
    } else {
      setCoffees((prev) => [...prev, form]);
    }
    setForm(initialForm);
    setEditingIndex(null);
  };

  const handleEdit = (idx) => {
    setForm(coffees[idx]);
    setEditingIndex(idx);
  };

  const handleDelete = (idx) => {
    setCoffees((prev) => prev.filter((_, i) => i !== idx));
    if (editingIndex === idx) {
      setForm(initialForm);
      setEditingIndex(null);
    }
  };

  const renderRow = (coffee, idx) => (
    <tr key={idx} className="odd:bg-white even:bg-beige/50">
      <td className="border px-2 py-1">{coffee.name}</td>
      <td className="border px-2 py-1">{coffee.origin}</td>
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

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-3">Coffees</h2>
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
        <input
          type="text"
          name="origin"
          value={form.origin}
          onChange={handleChange}
          placeholder="Origin"
          className="p-1 border rounded"
          required
        />
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
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="isRoasted"
            checked={form.isRoasted}
            onChange={handleChange}
          />
          Roasted
        </label>
        {form.isRoasted && (
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
          </>
        )}
        <button
          type="submit"
          className="px-3 py-1 bg-beige-dark text-gray-800 rounded min-w-[64px]"
        >
          {editingIndex !== null ? 'Save' : 'Add'}
        </button>
      </form>
      <table className="w-full border-collapse mb-8 text-sm">
        <thead>
          <tr className="bg-beige-dark">
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Origin</th>
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
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coffees.map((c, idx) => renderRow(c, idx))}
        </tbody>
      </table>
    </div>
  );
}

export default Coffee;
