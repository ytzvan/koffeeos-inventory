import React from 'react';

const dummyInventory = [
  { product: 'Roasted Coffee 200g', qty: 120, unit: 'bags' },
  { product: 'Milk Drinks', qty: 80, unit: 'bottles' },
  { product: 'Pour Over Kits', qty: 25, unit: 'units' },
];

function InventoryTableWidget() {
  return (
    <div className="bg-white rounded shadow-md p-6">
      <h3 className="text-center mb-2">Current Inventory</h3>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-beige-dark">
            <th className="border px-2 py-1 text-left">Product</th>
            <th className="border px-2 py-1 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {dummyInventory.map((row, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-beige/50">
              <td className="border px-2 py-1">{row.product}</td>
              <td className="border px-2 py-1">{`${row.qty} ${row.unit}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTableWidget;
