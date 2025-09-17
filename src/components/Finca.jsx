import React, { useMemo, useState } from 'react';
import Coffee from '../models/coffee';
import { useAppContext } from '../context/AppContext';

const processes = ['Washed', 'Honey', 'Natural', 'Anaerobic'];

function Finca() {
  const {
    fincaLots,
    setFincaLots,
    greenCoffees,
    setGreenCoffees,
    setInventory,
  } = useAppContext();
  const [form, setForm] = useState({
    name: '',
    process: processes[0],
    latas: '',
    kgPerLata: '12.5',
  });
  const [processingId, setProcessingId] = useState(null);
  const [processingForm, setProcessingForm] = useState({ sacks: '', kgPerSack: '69' });
  const [search, setSearch] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addLot = (e) => {
    e.preventDefault();
    const latas = parseFloat(form.latas);
    const kgPerLata = parseFloat(form.kgPerLata);
    if (
      !form.name.trim() ||
      !form.process.trim() ||
      Number.isNaN(latas) ||
      Number.isNaN(kgPerLata) ||
      latas <= 0 ||
      kgPerLata <= 0
    ) {
      return;
    }
    const estimatedKg = parseFloat((latas * kgPerLata).toFixed(2));
    const lot = {
      id: Math.random().toString(36).slice(2, 11),
      name: form.name.trim(),
      process: form.process.trim(),
      latas,
      kgPerLata,
      estimatedKg,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setFincaLots((prev) => [...prev, lot]);
    setForm((prev) => ({ ...prev, name: '', latas: '', kgPerLata: prev.kgPerLata }));
  };

  const filteredLots = useMemo(() => {
    if (!search) return fincaLots;
    return fincaLots.filter(
      (lot) =>
        lot.name.toLowerCase().includes(search.toLowerCase()) ||
        lot.process.toLowerCase().includes(search.toLowerCase())
    );
  }, [fincaLots, search]);

  const startProcessing = (id) => {
    setProcessingId(id);
    setProcessingForm({ sacks: '', kgPerSack: '69' });
  };

  const handleProcessingChange = (e) => {
    const { name, value } = e.target;
    setProcessingForm((prev) => ({ ...prev, [name]: value }));
  };

  const cancelProcessing = () => {
    setProcessingId(null);
    setProcessingForm({ sacks: '', kgPerSack: '69' });
  };

  const confirmProcessing = (e) => {
    e.preventDefault();
    const lot = fincaLots.find((l) => l.id === processingId);
    if (!lot) return;
    const sacks = parseFloat(processingForm.sacks);
    const kgPerSack = parseFloat(processingForm.kgPerSack);
    if (Number.isNaN(sacks) || Number.isNaN(kgPerSack) || sacks <= 0 || kgPerSack <= 0) {
      return;
    }
    const greenKg = parseFloat((sacks * kgPerSack).toFixed(2));
    let targetCoffee = greenCoffees.find(
      (c) =>
        c.name.toLowerCase() === lot.name.toLowerCase() &&
        c.process.toLowerCase() === lot.process.toLowerCase()
    );
    if (!targetCoffee) {
      targetCoffee = new Coffee({
        name: lot.name,
        process: lot.process,
        origins: [],
        providerId: '',
        producer: '',
        farm: '',
        region: '',
        varietal: '',
        altitude: '',
        tastingNotes: '',
        purchasePrice: '',
      });
      setGreenCoffees((prev) => [...prev, targetCoffee]);
    }
    const coffeeId = targetCoffee.id;
    setInventory((prev) => ({
      ...prev,
      green: {
        ...prev.green,
        [coffeeId]: parseFloat(
          ((prev.green[coffeeId] || 0) + greenKg).toFixed(2)
        ),
      },
    }));
    setFincaLots((prev) =>
      prev.map((item) =>
        item.id === processingId
          ? {
              ...item,
              status: 'processed',
              sacks,
              kgPerSack,
              greenKg,
              coffeeId,
              processedAt: new Date().toISOString(),
              yield:
                item.estimatedKg > 0
                  ? parseFloat(((greenKg / item.estimatedKg) * 100).toFixed(1))
                  : null,
            }
          : item
      )
    );
    cancelProcessing();
  };

  const totals = useMemo(
    () => ({
      pending: filteredLots.filter((lot) => lot.status === 'pending').length,
      processedKg: filteredLots.reduce((sum, lot) => sum + (lot.greenKg || 0), 0),
      totalLatas: filteredLots.reduce((sum, lot) => sum + lot.latas, 0),
    }),
    [filteredLots]
  );

  const formatNumber = (value) =>
    Number.isFinite(value) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';

  return (
    <div className="p-4 bg-white dark:bg-gray-800 dark:text-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-1 text-dark-green">KoffeeOS Finca</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Track cherry lots in latas, convert them into green coffee sacks, and sync the green
        inventory automatically by coffee name and process.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-green/10 border border-dark-green/20 rounded p-3">
          <p className="text-xs uppercase text-dark-green/80">Pending Lots</p>
          <p className="text-2xl font-semibold text-dark-green">{totals.pending}</p>
        </div>
        <div className="bg-dark-green/10 border border-dark-green/20 rounded p-3">
          <p className="text-xs uppercase text-dark-green/80">Total Latas</p>
          <p className="text-2xl font-semibold text-dark-green">{formatNumber(totals.totalLatas)}</p>
        </div>
        <div className="bg-dark-green/10 border border-dark-green/20 rounded p-3">
          <p className="text-xs uppercase text-dark-green/80">Green Kg Processed</p>
          <p className="text-2xl font-semibold text-dark-green">
            {formatNumber(totals.processedKg)}
          </p>
        </div>
      </div>

      <form onSubmit={addLot} className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col text-left text-sm">
          Coffee Name
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            className="p-2 border rounded"
            placeholder="Lot name"
            required
          />
        </label>
        <label className="flex flex-col text-left text-sm">
          Process
          <select
            name="process"
            value={form.process}
            onChange={handleFormChange}
            className="p-2 border rounded"
          >
            {processes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!processes.includes(form.process) && (
              <option value={form.process}>{form.process}</option>
            )}
          </select>
        </label>
        <label className="flex flex-col text-left text-sm">
          Latas
          <input
            name="latas"
            type="number"
            min="0"
            step="0.01"
            value={form.latas}
            onChange={handleFormChange}
            className="p-2 border rounded"
            placeholder="0"
            required
          />
        </label>
        <label className="flex flex-col text-left text-sm">
          Kg per Lata
          <input
            name="kgPerLata"
            type="number"
            min="0"
            step="0.01"
            value={form.kgPerLata}
            onChange={handleFormChange}
            className="p-2 border rounded"
            placeholder="12.5"
            required
          />
        </label>
        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-dark-green text-white rounded hover:bg-dark-green/90"
          >
            Add Lot
          </button>
        </div>
      </form>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-dark-green">Lots in Processing</h3>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by coffee or process"
          className="p-2 border rounded max-w-xs self-start sm:self-auto"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-dark-green text-white">
              <th className="border px-2 py-1 text-left">Coffee</th>
              <th className="border px-2 py-1 text-left">Process</th>
              <th className="border px-2 py-1 text-left">Latas</th>
              <th className="border px-2 py-1 text-left">Estimated Kg</th>
              <th className="border px-2 py-1 text-left">Status</th>
              <th className="border px-2 py-1 text-left">Sacks</th>
              <th className="border px-2 py-1 text-left">Green Kg</th>
              <th className="border px-2 py-1 text-left">Yield %</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLots.length === 0 && (
              <tr>
                <td className="border px-2 py-4 text-center" colSpan={9}>
                  No lots registered yet.
                </td>
              </tr>
            )}
            {filteredLots.map((lot) => {
              const isProcessing = processingId === lot.id;
              return (
                <React.Fragment key={lot.id}>
                  <tr className="odd:bg-dark-green/5 even:bg-white">
                    <td className="border px-2 py-1">{lot.name}</td>
                    <td className="border px-2 py-1">{lot.process}</td>
                    <td className="border px-2 py-1">{formatNumber(lot.latas)}</td>
                    <td className="border px-2 py-1">{formatNumber(lot.estimatedKg)}</td>
                    <td className="border px-2 py-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          lot.status === 'processed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {lot.status === 'processed' ? 'Processed' : 'Pending'}
                      </span>
                    </td>
                    <td className="border px-2 py-1">{formatNumber(lot.sacks)}</td>
                    <td className="border px-2 py-1">{formatNumber(lot.greenKg)}</td>
                    <td className="border px-2 py-1">
                      {lot.yield ? `${formatNumber(lot.yield)}%` : '—'}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {lot.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => startProcessing(lot.id)}
                          className="text-dark-green underline"
                        >
                          Process
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Linked to inventory
                        </span>
                      )}
                    </td>
                  </tr>
                  {isProcessing && (
                    <tr>
                      <td className="border px-2 py-2 bg-dark-green/10" colSpan={9}>
                        <form
                          onSubmit={confirmProcessing}
                          className="flex flex-wrap items-center gap-3"
                        >
                          <label className="flex items-center gap-2 text-sm">
                            Sacks
                            <input
                              name="sacks"
                              type="number"
                              min="0"
                              step="0.01"
                              value={processingForm.sacks}
                              onChange={handleProcessingChange}
                              className="p-2 border rounded w-24"
                              required
                            />
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            Kg per Sack
                            <input
                              name="kgPerSack"
                              type="number"
                              min="0"
                              step="0.01"
                              value={processingForm.kgPerSack}
                              onChange={handleProcessingChange}
                              className="p-2 border rounded w-24"
                              required
                            />
                          </label>
                          <span className="text-sm text-dark-green font-medium">
                            Green Kg:{' '}
                            {formatNumber(
                              parseFloat(processingForm.sacks || 0) *
                                parseFloat(processingForm.kgPerSack || 0)
                            )}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Will update green coffee for <strong>{lot.name}</strong> ({lot.process}).
                          </span>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-dark-green text-white rounded"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={cancelProcessing}
                            className="px-3 py-1 underline text-red-600"
                          >
                            Cancel
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Finca;
