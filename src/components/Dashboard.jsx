import React from 'react';
import WeeklySalesChart from './WeeklySalesChart';
import ProductSalesPie from './ProductSalesPie';

function Dashboard() {
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 auto-rows-fr">
        <WeeklySalesChart />
        <ProductSalesPie />
      </div>
    </div>
  );
}

export default Dashboard;
