import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'yappy', label: 'Yappy' },
  { value: 'card', label: 'Card' },
  { value: 'gift_card', label: 'Gift Card' },
];

const paymentLabel = (value) => {
  const match = PAYMENT_OPTIONS.find((option) => option.value === value);
  return match ? match.label : value || 'Manual';
};

const normalizeSale = (sale, fallbackKey) => {
  if (sale.items) {
    return sale;
  }

  const bag = sale.bag || {};
  const quantity = sale.quantity || 0;
  const total = sale.total || 0;
  const unitPrice =
    bag.retailPrice || (quantity > 0 ? total / quantity : 0) || 0;

  return {
    id: sale.id || String(fallbackKey),
    createdAt: sale.createdAt,
    paymentMethod: sale.paymentMethod || 'manual',
    source: sale.source,
    items: [
      {
        bagName: bag.coffee?.name || sale.bagName || 'Coffee',
        bagWeight: bag.bagWeight || sale.bagWeight || '',
        quantity,
        unitPrice,
        lineTotal: total || unitPrice * quantity,
      },
    ],
    total: total || unitPrice * quantity,
    customer: sale.customer,
  };
};

function Sales() {
  const { sales, setSales, bags, setBags, setCustomers } = useAppContext();
  const [form, setForm] = useState({
    bagIndex: '',
    quantity: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: PAYMENT_OPTIONS[0].value,
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
    const saleRecord = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paymentMethod: form.paymentMethod,
      source: 'Manual',
      items: [
        {
          bagName: bag.coffee?.name || 'Coffee',
          bagWeight: bag.bagWeight,
          quantity: qty,
          unitPrice: bag.retailPrice,
          lineTotal: total,
        },
      ],
      total,
      customer: { firstName, lastName, email, phone },
    };
    setSales((prev) => [...prev, saleRecord]);
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
    setForm({
      bagIndex: '',
      quantity: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      paymentMethod: PAYMENT_OPTIONS[0].value,
    });
  };

  const normalizedSales = useMemo(
    () => sales.map((sale, idx) => normalizeSale(sale, idx)),
    [sales]
  );

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
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="p-1 border rounded"
        >
          {PAYMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
      {normalizedSales.length > 0 && (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-dark-green text-white">
                <th className="border px-2 py-1 text-left">Date</th>
                <th className="border px-2 py-1 text-left">Items</th>
                <th className="border px-2 py-1 text-left">Payment</th>
                <th className="border px-2 py-1 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {normalizedSales.map((sale) => (
                <tr key={sale.id} className="odd:bg-dark-green/5 even:bg-white">
                  <td className="border px-2 py-1">
                    {sale.createdAt ? new Date(sale.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="border px-2 py-1">
                    <ul className="space-y-1 text-xs sm:text-sm">
                      {sale.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-dark-green">
                            {item.bagName}
                          </span>{' '}
                          <span className="text-gray-600">
                            {item.bagWeight}g × {item.quantity}
                          </span>
                          <span className="ml-1 text-gray-500">
                            (${(item.unitPrice || 0).toFixed(2)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-2 py-1">{paymentLabel(sale.paymentMethod)}</td>
                  <td className="border px-2 py-1 font-semibold">
                    ${Number(sale.total || 0).toFixed(2)}
                  </td>
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
