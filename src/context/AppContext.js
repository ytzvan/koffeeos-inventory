import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import greenCoffeeData from '../models/greenCoffeeData';
import roastedCoffeeData from '../models/roastedCoffeeData';
import providersData from '../models/providers';
import modulesData from '../models/modules';
import inventoryData from '../models/inventory';
import customersData from '../models/customers';
import fincaLotsData from '../models/fincaLots';
import companiesData from '../models/companies';

const dashboardKpiOptions = [
  {
    id: 'weeklySales',
    label: 'Weekly Sales Trend',
    description: 'Track revenue momentum across recent weeks.',
  },
  {
    id: 'productMix',
    label: 'Product Mix',
    description: 'Understand which products drive the most sales.',
  },
  {
    id: 'greenInventory',
    label: 'Green Coffee Inventory',
    description: 'Monitor available raw coffee to plan roasting.',
  },
  {
    id: 'roastedInventory',
    label: 'Roasted Coffee Inventory',
    description: 'Ensure finished coffee supply meets demand.',
  },
  {
    id: 'bagInventory',
    label: 'Bags Ready for Sale',
    description: 'Keep an eye on packaged product availability.',
  },
  {
    id: 'projectionSummary',
    label: 'Revenue & Profit Projections',
    description: 'Forecast income based on pricing and costs.',
  },
];

const AppContext = createContext();

export const AppProvider = ({ children, initialState = {} }) => {
  const initialCompanies = initialState.companies || companiesData;
  const [companies, setCompanies] = useState(initialCompanies);
  const defaultCompanyId =
    initialState.activeCompanyId || (initialCompanies[0] ? initialCompanies[0].id : null);
  const [activeCompanyId, setActiveCompanyId] = useState(defaultCompanyId);
  const [greenCoffees, setGreenCoffees] = useState(initialState.greenCoffees || greenCoffeeData);
  const [roastedCoffees, setRoastedCoffees] = useState(initialState.roastedCoffees || roastedCoffeeData);
  const [inventory, setInventory] = useState(initialState.inventory || inventoryData);
  const [bags, setBags] = useState(initialState.bags || []);
  const [espressoRefills, setEspressoRefills] = useState(initialState.espressoRefills || []);
  const [espressoProjections, setEspressoProjections] = useState(initialState.espressoProjections || []);
  const [filterRefills, setFilterRefills] = useState(initialState.filterRefills || []);
  const [filterProjections, setFilterProjections] = useState(initialState.filterProjections || []);
  const [modules, setModules] = useState(initialState.modules || modulesData);
  const [providers, setProviders] = useState(initialState.providers || providersData);
  const [sales, setSales] = useState(initialState.sales || []);
  const [customers, setCustomers] = useState(initialState.customers || customersData);
  const [darkMode, setDarkMode] = useState(initialState.darkMode || false);
  const [fincaLots, setFincaLots] = useState(initialState.fincaLots || fincaLotsData);
  const defaultKpis = dashboardKpiOptions.map((kpi) => kpi.id);
  const [dashboardKpis, setDashboardKpis] = useState(
    initialState.dashboardKpis || defaultKpis
  );

  useEffect(() => {
    if (!companies.length) {
      setActiveCompanyId(null);
      return;
    }
    if (!companies.some((company) => company.id === activeCompanyId)) {
      setActiveCompanyId(companies[0].id);
    }
  }, [companies, activeCompanyId]);

  useEffect(() => {
    setInventory((prev) => {
      const green = {};
      greenCoffees.forEach((c) => {
        green[c.id] = prev.green[c.id] || 0;
      });
      const roasted = {};
      roastedCoffees.forEach((c) => {
        roasted[c.id] = prev.roasted[c.id] || 0;
      });
      return { ...prev, green, roasted };
    });
  }, [greenCoffees, roastedCoffees]);

  const activeCompany = useMemo(
    () => companies.find((company) => company.id === activeCompanyId) || null,
    [companies, activeCompanyId]
  );

  const value = {
    companies,
    setCompanies,
    activeCompany,
    activeCompanyId,
    setActiveCompanyId,
    greenCoffees,
    setGreenCoffees,
    roastedCoffees,
    setRoastedCoffees,
    inventory,
    setInventory,
    bags,
    setBags,
    espressoRefills,
    setEspressoRefills,
    espressoProjections,
    setEspressoProjections,
    filterRefills,
    setFilterRefills,
    filterProjections,
    setFilterProjections,
    modules,
    setModules,
    providers,
    setProviders,
    sales,
    setSales,
    customers,
    setCustomers,
    darkMode,
    setDarkMode,
    fincaLots,
    setFincaLots,
    dashboardKpis,
    setDashboardKpis,
    dashboardKpiOptions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

