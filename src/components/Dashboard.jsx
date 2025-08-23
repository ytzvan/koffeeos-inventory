import React from 'react';
import WeeklySalesChart from './WeeklySalesChart';
import ProductSalesPie from './ProductSalesPie';

function Dashboard({
  greenCoffees = [],
  roastedCoffees = [],
  inventory = { green: {}, roasted: {} },
  bags = [],
}) {
  const totalRevenue = bags.reduce(
    (sum, b) => sum + b.numBags * b.retailPrice,
    0
  );
  const totalProfit = bags.reduce(
    (sum, b) => sum + b.numBags * (b.retailPrice - b.costPrice),
    0
  );
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
        <WeeklySalesChart />
        <ProductSalesPie />
        <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4">
          <h3 className="text-dark-green font-semibold mb-2">Green Inventory</h3>
          <ul className="text-sm">
            {greenCoffees.map((c) => (
              <li key={c.id}>
                {c.name}: {inventory.green[c.id] || 0} kg
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4">
          <h3 className="text-dark-green font-semibold mb-2">Roasted Inventory</h3>
          <ul className="text-sm">
            {roastedCoffees.map((c) => (
              <li key={c.id}>
                {c.name}: {inventory.roasted[c.id] || 0} kg
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4">
          <h3 className="text-dark-green font-semibold mb-2">Bags</h3>
          <ul className="text-sm">
            {bags.map((b, idx) => (
              <li key={idx}>
                {b.coffee.name}: {b.numBags} bags
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded shadow-md p-4">
          <h3 className="text-dark-green font-semibold mb-2">Projections</h3>
          <p className="text-sm">Revenue: {totalRevenue.toFixed(2)}</p>
          <p className="text-sm">Profit: {totalProfit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
