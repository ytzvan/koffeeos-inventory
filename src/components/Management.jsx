import React from 'react';
import { useAppContext } from '../context/AppContext';

function Management() {
  const { modules, setModules } = useAppContext();
  const toggleModule = (key) => {
    setModules((prev) =>
      prev.map((m) =>
        m.key === key ? { ...m, enabled: !m.enabled } : m
      )
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6 w-full">
      <h2 className="text-xl font-semibold mb-3 text-dark-green">Management</h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-dark-green text-white">
              <th className="border px-2 py-1 text-left">Module</th>
              <th className="border px-2 py-1 text-center">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.key} className="odd:bg-dark-green/5 even:bg-white">
                <td className="border px-2 py-1">{m.name}</td>
                <td className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={m.enabled}
                    onChange={() => toggleModule(m.key)}
                    disabled={m.key === 'management'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Management;
