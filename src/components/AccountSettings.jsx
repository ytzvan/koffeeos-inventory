import React from 'react';

function AccountSettings() {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
      <div className="flex flex-col gap-2">
        <button className="px-3 py-1 bg-beige-dark text-gray-800 rounded">Cerrar Sesión</button>
        <button className="px-3 py-1 bg-beige-dark text-gray-800 rounded">Cerrar Sesión en todos los dispositivos</button>
      </div>
    </div>
  );
}

export default AccountSettings;
