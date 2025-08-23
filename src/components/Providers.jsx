import React, { useState } from 'react';
import countries from '../models/countries';

function Providers({ providers, setProviders }) {
  const initialForm = {
    name: '',
    farm: '',
    region: '',
    altitude: '',
    country: '',
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProvider = {
      id: `provider${Date.now()}`,
      ...form,
    };
    setProviders((prev) => [...prev, newProvider]);
    setForm(initialForm);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 dark:text-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Providers</h2>
      <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-2 max-w-md mx-auto mb-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Provider Name"
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="farm"
          value={form.farm}
          onChange={handleChange}
          placeholder="Farm"
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="region"
          value={form.region}
          onChange={handleChange}
          placeholder="Region"
          required
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="altitude"
          value={form.altitude}
          onChange={handleChange}
          placeholder="Altitude"
          required
          className="border px-2 py-1 rounded"
        />
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        >
          <option value="">Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-dark-green text-white px-4 py-2 rounded"
        >
          Add Provider
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-dark-green text-white">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Farm</th>
              <th className="border px-2 py-1">Region</th>
              <th className="border px-2 py-1">Altitude</th>
              <th className="border px-2 py-1">Country</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="odd:bg-dark-green/5 even:bg-white">
                <td className="border px-2 py-1">{p.name}</td>
                <td className="border px-2 py-1">{p.farm}</td>
                <td className="border px-2 py-1">{p.region}</td>
                <td className="border px-2 py-1">{p.altitude}</td>
                <td className="border px-2 py-1">{p.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Providers;

