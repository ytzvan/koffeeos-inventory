import React, { createContext, useContext, useEffect, useState } from 'react';
import greenCoffeeData from '../models/greenCoffeeData';
import roastedCoffeeData from '../models/roastedCoffeeData';
import providersData from '../models/providers';
import modulesData from '../models/modules';
import inventoryData from '../models/inventory';

const AppContext = createContext();

export const AppProvider = ({ children, initialState = {} }) => {
  const [greenCoffees, setGreenCoffees] = useState(initialState.greenCoffees || greenCoffeeData);
  const [roastedCoffees, setRoastedCoffees] = useState(initialState.roastedCoffees || roastedCoffeeData);
  const [inventory, setInventory] = useState(initialState.inventory || inventoryData);
  const [bags, setBags] = useState(initialState.bags || []);
  const [espressoRefills, setEspressoRefills] = useState(initialState.espressoRefills || []);
  const [espressoProjections, setEspressoProjections] = useState(initialState.espressoProjections || []);
  const [modules, setModules] = useState(initialState.modules || modulesData);
  const [providers, setProviders] = useState(initialState.providers || providersData);
  const [sales, setSales] = useState(initialState.sales || []);
  const [darkMode, setDarkMode] = useState(initialState.darkMode || false);

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

  const value = {
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
    modules,
    setModules,
    providers,
    setProviders,
    sales,
    setSales,
    darkMode,
    setDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

