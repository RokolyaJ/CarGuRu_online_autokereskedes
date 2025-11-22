import React, { useContext } from 'react';
import { ConfigContext } from '../../context/ConfigContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../apiConfig";

const Summary = () => {
  const navigate = useNavigate();
  const {
    selectedModel,
    selectedVariant,
    selectedEngine,
    selectedAppearance,
    selectedEquipment,
  } = useContext(ConfigContext);

  const totalEquipmentPrice =
    selectedEquipment?.reduce((sum, item) => sum + item.price, 0) || 0;

  const totalAppearancePrice = selectedAppearance?.price || 0;

  const totalPrice =
    (selectedVariant?.price || 0) +
    totalEquipmentPrice +
    totalAppearancePrice;

  const carImage =
    (selectedAppearance?.imageUrl
      ? API_BASE_URL + selectedAppearance.imageUrl
      : selectedVariant?.imageUrl
      ? API_BASE_URL + selectedVariant.imageUrl
      : "/images/car-placeholder.png");

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 bg-white min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row items-start gap-10">

        <div className="lg:w-2/3 w-full flex justify-center items-start">
          <img
            src={carImage}
            alt="Kiválasztott autó"
            className="max-w-[100%] max-h-[500px] object-contain rounded-xl"
          />
        </div>

        <div className="lg:w-1/3 w-full bg-gray-100 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {selectedModel?.name} {selectedVariant?.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {selectedEngine?.fuelType} / {selectedEngine?.driveType}
          </p>

          <div className="bg-white rounded-lg p-4 mb-6 text-center shadow">
            <p className="text-sm text-gray-500">Teljes ajánlott kiskereskedelmi ár</p>
            <p className="text-3xl font-extrabold text-green-700">
              {totalPrice.toLocaleString()} Ft
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Technikai adatok</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Motor:</strong> {selectedEngine?.name}</li>
              <li><strong>Teljesítmény:</strong> {selectedEngine?.powerKw} kW ({selectedEngine?.powerHp} LE)</li>
              <li><strong>Hajtás:</strong> {selectedEngine?.driveType}</li>
              <li><strong>Fogyasztás:</strong> {selectedEngine?.consumption}</li>
              <li><strong>Szín:</strong> {selectedAppearance?.color}</li>
              <li><strong>Kerekek:</strong> {selectedAppearance?.wheels}</li>
              <li><strong>Üléshuzat:</strong> {selectedAppearance?.interior}</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tartozékok</h3>
            {selectedEquipment?.length > 0 ? (
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                {selectedEquipment.map((item, index) => (
                  <li key={index}>{item.name} – {item.price.toLocaleString()} Ft</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nincs kiválasztott tartozék.</p>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition">
              Kérjen ajánlatot
            </button>

            <button
              onClick={() => navigate('/configurator')}
              className="w-full border border-gray-300 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Vissza a konfigurátorhoz
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Summary;
