import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'yappy', label: 'Yappy' },
  { value: 'card', label: 'Card' },
  { value: 'gift_card', label: 'Gift Card' },
];

function POS() {
  const { bags, setBags, setSales } = useAppContext();
  const [fullScreen, setFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0].value);
  const [status, setStatus] = useState(null);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  const filteredBags = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return bags
      .map((bag, index) => ({ bag, index }))
      .filter(({ bag }) => {
        if (!term) return true;
        const name = bag.coffee?.name?.toLowerCase() || '';
        const process = bag.coffee?.process?.toLowerCase() || '';
        return name.includes(term) || process.includes(term);
      });
  }, [bags, searchTerm]);

  const addItemToOrder = (index) => {
    const bag = bags[index];
    if (!bag || bag.numBags <= 0) {
      setStatus({ type: 'error', message: 'Selected item is out of stock.' });
      return;
    }
    setStatus(null);
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.bagIndex === index);
      if (existing) {
        const maxQty = bag.numBags;
        if (existing.quantity >= maxQty) {
          return prev;
        }
        return prev.map((item) =>
          item.bagIndex === index
            ? { ...item, quantity: Math.min(item.quantity + 1, maxQty) }
            : item
        );
      }
      return [
        ...prev,
        {
          bagIndex: index,
          bagName: bag.coffee?.name || 'Coffee',
          bagWeight: bag.bagWeight,
          unitPrice: bag.retailPrice,
          quantity: 1,
        },
      ];
    });
  };

  const adjustQuantity = (bagIndex, delta) => {
    const bag = bags[bagIndex];
    if (!bag) return;
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.bagIndex !== bagIndex) return item;
          const maxQty = bag.numBags;
          const nextQty = Math.max(0, Math.min(item.quantity + delta, maxQty));
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (bagIndex) => {
    setOrderItems((prev) => prev.filter((item) => item.bagIndex !== bagIndex));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setStatus(null);
  };

  const orderTotal = useMemo(
    () =>
      orderItems.reduce(
        (sum, item) => sum + item.quantity * (item.unitPrice || 0),
        0
      ),
    [orderItems]
  );

  const finalizeSale = () => {
    if (orderItems.length === 0) return;
    const insufficient = orderItems.find((item) => {
      const bag = bags[item.bagIndex];
      return !bag || bag.numBags < item.quantity;
    });
    if (insufficient) {
      setStatus({
        type: 'error',
        message: `Not enough stock for ${insufficient.bagName}.`,
      });
      return;
    }

    const saleRecord = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paymentMethod,
      source: 'POS',
      items: orderItems.map((item) => ({
        bagName: item.bagName,
        bagWeight: item.bagWeight,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.quantity * item.unitPrice,
      })),
      total: orderTotal,
    };

    setSales((prev) => [...prev, saleRecord]);
    setBags((prev) =>
      prev.map((bag, idx) => {
        const match = orderItems.find((item) => item.bagIndex === idx);
        if (!match) return bag;
        return { ...bag, numBags: bag.numBags - match.quantity };
      })
    );

    setOrderItems([]);
    setStatus({ type: 'success', message: 'Sale recorded successfully.' });
  };

  return (
    <div className="p-4 w-full h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-dark-green">Point of Sale</h2>
        <button
          onClick={toggleFullScreen}
          className="px-4 py-2 bg-dark-green text-white rounded shadow"
        >
          {fullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
      </div>

      {status && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-400 bg-green-50 text-green-700'
              : 'border-red-400 bg-red-50 text-red-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-6 w-full">
        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-dark-green">
                Available Products
              </h3>
              <p className="text-sm text-gray-500">
                Tap an item to add it to the current order.
              </p>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search coffee or process"
              className="w-full sm:w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:border-dark-green focus:outline-none"
            />
          </div>
          {bags.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No bagged coffee available. Create bags from inventory first.
            </p>
          ) : filteredBags.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No products match your search.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredBags.map(({ bag, index }) => {
                const disabled = bag.numBags <= 0;
                return (
                  <button
                    key={`${bag.coffee?.name || 'coffee'}-${index}`}
                    type="button"
                    onClick={() => addItemToOrder(index)}
                    className={`rounded-lg border px-4 py-3 text-left shadow transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-dark-green ${
                      disabled
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                        : 'border-gray-200 bg-white text-gray-800'
                    }`}
                    disabled={disabled}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-dark-green">
                        {bag.coffee?.name}
                      </span>
                      <span className="rounded-full bg-dark-green/10 px-2 py-0.5 text-xs font-medium text-dark-green">
                        {bag.bagWeight}g
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {bag.coffee?.process || 'Single Origin'}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        ${bag.retailPrice.toFixed(2)}
                      </span>
                      <span>
                        {bag.numBags}{' '}
                        <span className="text-gray-500">in stock</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="xl:w-96 flex-shrink-0">
          <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="text-lg font-semibold text-dark-green">
                Current Order
              </h3>
              <p className="text-xs text-gray-500">
                Review the ticket before completing the sale.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {orderItems.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No items added yet.
                </div>
              ) : (
                <ul className="space-y-3">
                  {orderItems.map((item) => {
                    const bag = bags[item.bagIndex];
                    const maxQty = bag ? bag.numBags : item.quantity;
                    return (
                      <li
                        key={item.bagIndex}
                        className="rounded border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-dark-green">
                              {item.bagName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.bagWeight}g · ${item.unitPrice.toFixed(2)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => removeItem(item.bagIndex)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded border border-gray-300 bg-white">
                            <button
                              type="button"
                              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                              onClick={() => adjustQuantity(item.bagIndex, -1)}
                            >
                              −
                            </button>
                            <span className="px-3 text-sm font-medium text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                              onClick={() => adjustQuantity(item.bagIndex, 1)}
                              disabled={item.quantity >= maxQty}
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right text-sm font-semibold text-gray-700">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </div>
                        </div>
                        {bag && item.quantity >= bag.numBags && (
                          <p className="mt-1 text-xs text-amber-600">
                            Maximum available quantity reached.
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-3">
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-dark-green">
                  Payment Method
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PAYMENT_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setPaymentMethod(option.value)}
                      className={`rounded border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-dark-green ${
                        paymentMethod === option.value
                          ? 'border-dark-green bg-dark-green text-white shadow'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-dark-green'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-gray-800">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={clearOrder}
                  className="w-1/3 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  disabled={orderItems.length === 0}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={finalizeSale}
                  className="w-2/3 rounded bg-dark-green px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-dark-green/90 disabled:cursor-not-allowed disabled:bg-gray-300"
                  disabled={orderItems.length === 0}
                >
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POS;

