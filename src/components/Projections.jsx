import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function Projections() {
  const {
    bags,
    espressoRefills,
    espressoProjections,
    setEspressoProjections,
    filterRefills,
    filterProjections,
    setFilterProjections,
  } = useAppContext();
  const [espressoForm, setEspressoForm] = useState({ refillIndex: '', baseSize: '', salePrice: '' });
  const [filterForm, setFilterForm] = useState({ refillIndex: '', baseSize: '20', salePrice: '' });

  const addEspressoProjection = (e) => {
    e.preventDefault();
    const refill = espressoRefills[espressoForm.refillIndex];
    const base = parseFloat(espressoForm.baseSize);
    const sale = parseFloat(espressoForm.salePrice);
    if (!refill || isNaN(base) || base <= 0 || isNaN(sale) || sale <= 0) return;
    const grams =
      refill.unit === 'kg'
        ? refill.quantity * 1000
        : refill.unit === 'lbs'
        ? refill.quantity * 453.592
        : refill.quantity;
    const shots = Math.floor(grams / base);
    const revenue = shots * sale;
    const cost =
      (refill.unit === 'kg'
        ? refill.quantity
        : refill.quantity * 0.453592) * parseFloat(refill.coffee.purchasePrice || 0);
    const profit = revenue - cost;
    setEspressoProjections((prev) => [
      ...prev,
      {
        coffee: refill.coffee,
        quantity: refill.quantity,
        unit: refill.unit,
        baseSize: base,
        salePrice: sale,
        shots,
        revenue,
        profit,
      },
    ]);
    setEspressoForm({ refillIndex: '', baseSize: '', salePrice: '' });
  };

  const addFilterProjection = (e) => {
    e.preventDefault();
    const refill = filterRefills[filterForm.refillIndex];
    const base = parseFloat(filterForm.baseSize);
    const sale = parseFloat(filterForm.salePrice);
    if (!refill || isNaN(base) || base <= 0 || isNaN(sale) || sale <= 0) return;
    const grams =
      refill.unit === 'kg'
        ? refill.quantity * 1000
        : refill.unit === 'lbs'
        ? refill.quantity * 453.592
        : refill.quantity;
    const cups = Math.floor(grams / base);
    const revenue = cups * sale;
    const cost =
      (refill.unit === 'kg'
        ? refill.quantity
        : refill.quantity * 0.453592) * parseFloat(refill.coffee.purchasePrice || 0);
    const profit = revenue - cost;
    setFilterProjections((prev) => [
      ...prev,
      {
        coffee: refill.coffee,
        quantity: refill.quantity,
        unit: refill.unit,
        baseSize: base,
        salePrice: sale,
        cups,
        revenue,
        profit,
      },
    ]);
    setFilterForm({ refillIndex: '', baseSize: '20', salePrice: '' });
  };

  const handleEspressoChange = (e) => {
    const { name, value } = e.target;
    setEspressoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm((prev) => ({ ...prev, [name]: value }));
  };

  const bagRevenue = bags.reduce((sum, b) => sum + b.numBags * b.retailPrice, 0);
  const bagProfit = bags.reduce(
    (sum, b) => sum + b.numBags * (b.retailPrice - b.costPrice),
    0
  );
  const espressoRevenue = espressoProjections.reduce((s, e) => s + e.revenue, 0);
  const espressoProfit = espressoProjections.reduce((s, e) => s + e.profit, 0);
  const filterRevenue = filterProjections.reduce((s, e) => s + e.revenue, 0);
  const filterProfit = filterProjections.reduce((s, e) => s + e.profit, 0);
  const totalRevenue = bagRevenue + espressoRevenue + filterRevenue;
  const totalProfit = bagProfit + espressoProfit + filterProfit;

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Projections</h2>
      {bags.length > 0 && (
        <div className="overflow-x-auto w-full mb-6">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Coffee</th>
                <th className="border px-2 py-1 text-left">Bag Weight</th>
                <th className="border px-2 py-1 text-left">Bags</th>
                <th className="border px-2 py-1 text-left">Cost Price</th>
                <th className="border px-2 py-1 text-left">Retail Price</th>
                <th className="border px-2 py-1 text-left">Revenue</th>
                <th className="border px-2 py-1 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {bags.map((b, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{b.coffee.name}</td>
                  <td className="border px-2 py-1">{b.bagWeight}</td>
                  <td className="border px-2 py-1">{b.numBags}</td>
                  <td className="border px-2 py-1">{b.costPrice}</td>
                  <td className="border px-2 py-1">{b.retailPrice}</td>
                  <td className="border px-2 py-1">
                    {(b.numBags * b.retailPrice).toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    {(b.numBags * (b.retailPrice - b.costPrice)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2 text-dark-green">
        Filter Projections
      </h3>
      {filterRefills.length > 0 && (
        <form
          onSubmit={addFilterProjection}
          className="mb-4 flex flex-wrap gap-2 items-end"
        >
          <select
            name="refillIndex"
            value={filterForm.refillIndex}
            onChange={handleFilterChange}
            className="p-1 border rounded flex-1"
            required
          >
            <option value="" disabled>
              Select Refill
            </option>
            {filterRefills.map((r, idx) => (
              <option key={idx} value={idx}>
                {r.coffee.name} - {r.quantity} {r.unit}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="baseSize"
            value={filterForm.baseSize}
            onChange={handleFilterChange}
            placeholder="Base Size (g)"
            className="p-1 border rounded w-32"
            required
          />
          <input
            type="number"
            name="salePrice"
            value={filterForm.salePrice}
            onChange={handleFilterChange}
            placeholder="Sale Price"
            className="p-1 border rounded w-32"
            required
          />
          <button
            type="submit"
            className="px-3 py-1 bg-dark-green text-white rounded"
          >
            Add Projection
          </button>
        </form>
      )}
      {filterProjections.length > 0 && (
        <div className="overflow-x-auto w-full mb-6">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Coffee</th>
                <th className="border px-2 py-1 text-left">Quantity</th>
                <th className="border px-2 py-1 text-left">Base Size (g)</th>
                <th className="border px-2 py-1 text-left">Cups</th>
                <th className="border px-2 py-1 text-left">Sale Price</th>
                <th className="border px-2 py-1 text-left">Revenue</th>
                <th className="border px-2 py-1 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {filterProjections.map((p, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{p.coffee.name}</td>
                  <td className="border px-2 py-1">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="border px-2 py-1">{p.baseSize}</td>
                  <td className="border px-2 py-1">{p.cups}</td>
                  <td className="border px-2 py-1">{p.salePrice}</td>
                  <td className="border px-2 py-1">{p.revenue.toFixed(2)}</td>
                  <td className="border px-2 py-1">{p.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2 text-dark-green">
        Espresso Projections
      </h3>
      {espressoRefills.length > 0 && (
        <form
          onSubmit={addEspressoProjection}
          className="mb-4 flex flex-wrap gap-2 items-end"
        >
          <select
            name="refillIndex"
            value={espressoForm.refillIndex}
            onChange={handleEspressoChange}
            className="p-1 border rounded flex-1"
            required
          >
            <option value="" disabled>
              Select Refill
            </option>
            {espressoRefills.map((r, idx) => (
              <option key={idx} value={idx}>
                {r.coffee.name} - {r.quantity} {r.unit}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="baseSize"
            value={espressoForm.baseSize}
            onChange={handleEspressoChange}
            placeholder="Base Size (g)"
            className="p-1 border rounded w-32"
            required
          />
          <input
            type="number"
            name="salePrice"
            value={espressoForm.salePrice}
            onChange={handleEspressoChange}
            placeholder="Sale Price"
            className="p-1 border rounded w-32"
            required
          />
          <button
            type="submit"
            className="px-3 py-1 bg-dark-green text-white rounded"
          >
            Add Projection
          </button>
        </form>
      )}
      {espressoProjections.length > 0 && (
        <div className="overflow-x-auto w-full mb-6">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Coffee</th>
                <th className="border px-2 py-1 text-left">Quantity</th>
                <th className="border px-2 py-1 text-left">Base Size (g)</th>
                <th className="border px-2 py-1 text-left">Shots</th>
                <th className="border px-2 py-1 text-left">Sale Price</th>
                <th className="border px-2 py-1 text-left">Revenue</th>
                <th className="border px-2 py-1 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {espressoProjections.map((p, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{p.coffee.name}</td>
                  <td className="border px-2 py-1">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="border px-2 py-1">{p.baseSize}</td>
                  <td className="border px-2 py-1">{p.shots}</td>
                  <td className="border px-2 py-1">{p.salePrice}</td>
                  <td className="border px-2 py-1">{p.revenue.toFixed(2)}</td>
                  <td className="border px-2 py-1">{p.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="text-sm">
        <p>Total Revenue: {totalRevenue.toFixed(2)}</p>
        <p>Total Profit: {totalProfit.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Projections;
