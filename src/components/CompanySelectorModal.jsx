import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

function CompanySelectorModal({ open, onClose, onRequestUpgrade }) {
  const { companies, activeCompanyId, setActiveCompanyId } = useAppContext();
  const [selectedCompanyId, setSelectedCompanyId] = useState(activeCompanyId);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedCompanyId(activeCompanyId);
      setShowUpgrade(false);
    }
  }, [open, activeCompanyId]);

  if (!open) {
    return null;
  }

  const handleConfirm = () => {
    if (!selectedCompanyId) return;
    setActiveCompanyId(selectedCompanyId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-dark-green">Select a company</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose which company dashboard you want to manage right now.
            </p>
          </div>
          <button
            className="text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {!showUpgrade ? (
          <div className="mt-6 space-y-4">
            {companies.length ? (
              <ul className="space-y-3">
                {companies.map((company) => (
                  <li key={company.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition hover:border-dark-green hover:shadow-sm dark:border-gray-700 dark:hover:border-dark-green">
                      <input
                        type="radio"
                        name="company"
                        value={company.id}
                        checked={selectedCompanyId === company.id}
                        onChange={() => setSelectedCompanyId(company.id)}
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{company.name}</p>
                        {company.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">{company.location}</p>
                        )}
                        {company.plan && (
                          <span className="mt-1 inline-block rounded-full bg-dark-green/10 px-2 py-0.5 text-xs font-semibold text-dark-green">
                            Plan: {company.plan}
                          </span>
                        )}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You do not have any companies yet. Upgrade your plan to add one.
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowUpgrade(true)}
              className="w-full rounded-md border border-dark-green px-4 py-2 text-sm font-medium text-dark-green transition hover:bg-dark-green hover:text-white"
            >
              Add a new company
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="new-company-name">
                  Company name
                </label>
                <input
                  id="new-company-name"
                  type="text"
                  disabled
                  placeholder="Enter company name"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="new-company-country">
                  Country
                </label>
                <input
                  id="new-company-country"
                  type="text"
                  disabled
                  placeholder="Select country"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                />
              </div>
            </form>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              To add more companies to your workspace you need to upgrade your plan. Upgrade now and unlock multi-company support for your team.
            </p>
            <button
              type="button"
              onClick={onRequestUpgrade}
              className="w-full rounded-md bg-dark-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Go to upgrade plan
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          {showUpgrade ? (
            <button
              type="button"
              onClick={() => setShowUpgrade(false)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-dark-green hover:text-dark-green dark:border-gray-600 dark:text-gray-200 dark:hover:border-dark-green"
            >
              Back
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-dark-green hover:text-dark-green dark:border-gray-600 dark:text-gray-200 dark:hover:border-dark-green"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedCompanyId}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition ${
                  selectedCompanyId
                    ? 'bg-dark-green hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm company
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanySelectorModal;
