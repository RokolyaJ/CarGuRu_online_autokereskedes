import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext"; 

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import UsedCars from "./pages/UsedCars";


import Configurator from "./pages/configurator/Configurator";
import ModelSelector from "./pages/configurator/ModelSelector";
import VariantSelector from "./pages/configurator/VariantSelector";
import EngineSelector from "./pages/configurator/EngineSelector";
import Appearance from "./pages/configurator/Appearance";
import Equipment from "./pages/configurator/Equipment";
import Summary from "./pages/configurator/Summary";

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <Router>
          <Navbar />
          <Routes>
            {}
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/used-cars" element={<UsedCars />} />

            {}
            <Route path="/configurator" element={<Configurator />} />
            <Route path="/configurator/:brand" element={<ModelSelector />} />
            <Route path="/configurator/:brand/:model" element={<VariantSelector />} />
            <Route path="/configurator/:brand/:model/engine" element={<EngineSelector />} />
            <Route path="/configurator/:brand/:model/appearance" element={<Appearance />} />
            <Route path="/configurator/:brand/:model/equipment" element={<Equipment />} />
            <Route path="/configurator/:brand/:model/summary" element={<Summary />} />

            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
