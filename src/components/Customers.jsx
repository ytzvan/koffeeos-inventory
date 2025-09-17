import React from 'react';
import { useAppContext } from '../context/AppContext';

function Customers() {
  const { customers } = useAppContext();
  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-dark-green">Customers</h2>
      <div className="overflow-x-auto w-full">
        {customers.length > 0 ? (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Email</th>
                <th className="border px-2 py-1 text-left">Phone</th>
                <th className="border px-2 py-1 text-left">Purchases</th>
                <th className="border px-2 py-1 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{`${c.firstName || ''} ${c.lastName || ''}`.trim()}</td>
                  <td className="border px-2 py-1">{c.email}</td>
                  <td className="border px-2 py-1">{c.phone}</td>
                  <td className="border px-2 py-1">{c.purchases}</td>
                  <td className="border px-2 py-1">{c.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers yet.</p>
        )}
      </div>
    </div>
  );
}

export default Customers;
