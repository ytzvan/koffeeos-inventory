import React from 'react';
import WeeklySalesChart from './WeeklySalesChart';
import ProductSalesPie from './ProductSalesPie';
import InventoryTableWidget from './InventoryTableWidget';

function Dashboard() {
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
        <WeeklySalesChart />
        <ProductSalesPie />
        <InventoryTableWidget />
      </div>
    </div>
  );
}

export default Dashboard;
