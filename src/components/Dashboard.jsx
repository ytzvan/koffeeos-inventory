import React, { useMemo, useState } from 'react';
import WeeklySalesChart from './WeeklySalesChart';
import ProductSalesPie from './ProductSalesPie';
import { useAppContext } from '../context/AppContext';

function Dashboard() {
  const {
    greenCoffees = [],
    roastedCoffees = [],
    inventory = { green: {}, roasted: {} },
    bags = [],
    dashboardKpis,
    setDashboardKpis,
    dashboardKpiOptions,
    activeCompany,
  } = useAppContext();
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [draftSelection, setDraftSelection] = useState(dashboardKpis);

  const totalRevenue = useMemo(
    () => bags.reduce((sum, bag) => sum + bag.numBags * bag.retailPrice, 0),
    [bags]
  );
  const totalProfit = useMemo(
    () => bags.reduce((sum, bag) => sum + bag.numBags * (bag.retailPrice - bag.costPrice), 0),
    [bags]
  );
  const selectedKpis = useMemo(() => new Set(dashboardKpis), [dashboardKpis]);

  const openModal = () => {
    setDraftSelection(dashboardKpis);
    setKpiModalOpen(true);
  };

  const toggleDraft = (id) => {
    setDraftSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const applySelection = () => {
    if (!draftSelection.length) {
      return;
    }
    setDashboardKpis(draftSelection);
    setKpiModalOpen(false);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          {activeCompany && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Monitoring key metrics for {activeCompany.name}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={openModal}
          className="self-start rounded-md border border-dark-green px-4 py-2 text-sm font-medium text-dark-green transition hover:bg-dark-green hover:text-white"
        >
          Configure KPIs
        </button>
      </div>
      {dashboardKpis.length ? (
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          {selectedKpis.has('weeklySales') && <WeeklySalesChart />}
          {selectedKpis.has('productMix') && <ProductSalesPie />}
          {selectedKpis.has('greenInventory') && (
            <div className="rounded bg-white p-4 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-dark-green">Green Inventory</h3>
              <ul className="space-y-1 text-sm">
                {greenCoffees.map((coffee) => (
                  <li key={coffee.id}>
                    {coffee.name}: {inventory.green[coffee.id] || 0} kg
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedKpis.has('roastedInventory') && (
            <div className="rounded bg-white p-4 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-dark-green">Roasted Inventory</h3>
              <ul className="space-y-1 text-sm">
                {roastedCoffees.map((coffee) => (
                  <li key={coffee.id}>
                    {coffee.name}: {inventory.roasted[coffee.id] || 0} kg
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedKpis.has('bagInventory') && (
            <div className="rounded bg-white p-4 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-dark-green">Bags Ready for Sale</h3>
              <ul className="space-y-1 text-sm">
                {bags.map((bag, index) => (
                  <li key={`${bag.coffee.id}-${index}`}>
                    {bag.coffee.name}: {bag.numBags} bags ({bag.bagWeight}g)
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedKpis.has('projectionSummary') && (
            <div className="rounded bg-white p-4 shadow-md dark:bg-gray-800">
              <h3 className="mb-2 font-semibold text-dark-green">Revenue &amp; Profit Projections</h3>
              <p className="text-sm">Revenue: {totalRevenue.toFixed(2)}</p>
              <p className="text-sm">Profit: {totalProfit.toFixed(2)}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded border border-dashed border-gray-300 p-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
          Select at least one KPI to visualise insights on your dashboard.
        </div>
      )}

      {kpiModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-dark-green">Choose dashboard KPIs</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Enable the metrics you want to follow closely. You can update this selection anytime.
            </p>
            <ul className="mt-4 space-y-3">
              {dashboardKpiOptions.map((option) => {
                const checked = draftSelection.includes(option.id);
                return (
                  <li key={option.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-gray-200 p-3 transition hover:border-dark-green hover:shadow-sm dark:border-gray-700 dark:hover:border-dark-green">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDraft(option.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setKpiModalOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-dark-green hover:text-dark-green dark:border-gray-600 dark:text-gray-200 dark:hover:border-dark-green"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applySelection}
                disabled={!draftSelection.length}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                  draftSelection.length
                    ? 'bg-dark-green hover:bg-green-700'
                    : 'cursor-not-allowed bg-gray-400'
                }`}
              >
                Save selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
