import React from 'react';

function Projections({ bags }) {
  const totalRevenue = bags.reduce(
    (sum, b) => sum + b.numBags * b.retailPrice,
    0
  );
  const totalProfit = bags.reduce(
    (sum, b) => sum + b.numBags * (b.retailPrice - b.costPrice),
    0
  );

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Projections</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse mb-4 text-sm">
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
      <div className="text-sm">
        <p>Total Revenue: {totalRevenue.toFixed(2)}</p>
        <p>Total Profit: {totalProfit.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Projections;
