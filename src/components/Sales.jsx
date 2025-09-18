import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

function Sales() {
  const { sales, setSales, bags, setBags, customers, setCustomers } = useAppContext();
  const [form, setForm] = useState({
    bagIndex: '',
    quantity: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addSale = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone } = form;
    const bag = bags[form.bagIndex];
    const qty = parseInt(form.quantity, 10);
    if (!bag || qty <= 0 || bag.numBags < qty) return;
    if (!email && !phone) return;
    const total = qty * bag.retailPrice;
    setSales((prev) => [
      ...prev,
      { bag, quantity: qty, total, customer: { firstName, lastName, email, phone } },
    ]);
    setBags((prev) =>
      prev.map((b, idx) =>
        idx === parseInt(form.bagIndex, 10)
          ? { ...b, numBags: b.numBags - qty }
          : b
      )
    );
    setCustomers((prev) => {
      const idx = prev.findIndex(
        (c) => (email && c.email === email) || (phone && c.phone === phone)
      );
      if (idx >= 0) {
        const updated = [...prev];
        const cust = { ...updated[idx] };
        cust.purchases += 1;
        cust.revenue += total;
        if (firstName) cust.firstName = firstName;
        if (lastName) cust.lastName = lastName;
        if (email) cust.email = email;
        if (phone) cust.phone = phone;
        updated[idx] = cust;
        return updated;
      }
      return [
        ...prev,
        {
          id: Date.now().toString(),
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          phone: phone || '',
          purchases: 1,
          revenue: total,
        },
      ];
    });
    setForm({ bagIndex: '', quantity: '', firstName: '', lastName: '', email: '', phone: '' });
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-dark-green">Sales</h2>
      <form onSubmit={addSale} className="mb-4 flex flex-wrap gap-2 items-end">
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="p-1 border rounded"
        />
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="p-1 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-1 border rounded"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-1 border rounded"
        />
        <select
          name="bagIndex"
          value={form.bagIndex}
          onChange={handleChange}
          className="p-1 border rounded flex-1"
          required
        >
          <option value="" disabled>
            Select Bag
          </option>
          {bags.map((b, idx) => (
            <option key={idx} value={idx}>
              {b.coffee.name} {b.bagWeight}g ({b.numBags} available)
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Qty"
          className="p-1 border rounded w-24"
          required
        />
        <button
          type="submit"
          className="px-3 py-1 bg-dark-green text-white rounded"
        >
          Add Sale
        </button>
      </form>
      {sales.length > 0 && (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Coffee</th>
                <th className="border px-2 py-1 text-left">Bag Weight</th>
                <th className="border px-2 py-1 text-left">Qty</th>
                <th className="border px-2 py-1 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, idx) => (
                <tr key={idx} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">{s.bag.coffee.name}</td>
                  <td className="border px-2 py-1">{s.bag.bagWeight}</td>
                  <td className="border px-2 py-1">{s.quantity}</td>
                  <td className="border px-2 py-1">{s.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Sales;

