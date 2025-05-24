
import React, { createContext, useState } from 'react';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(null); 
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedAppearance, setSelectedAppearance] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const resetConfig = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedVariant(null);
    setSelectedEngine(null);
    setSelectedAppearance(null);
    setSelectedEquipment([]);
  };

  return (
    <ConfigContext.Provider
      value={{
        selectedBrand,
        setSelectedBrand,
        selectedModel,
        setSelectedModel,
        selectedVariant,
        setSelectedVariant,
        selectedEngine,
        setSelectedEngine,
        selectedAppearance,
        setSelectedAppearance,
        selectedEquipment,
        setSelectedEquipment,
        resetConfig, 
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
