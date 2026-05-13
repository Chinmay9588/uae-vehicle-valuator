import React, { useState, useEffect } from "react";
import { predictPrice, getOptions } from "./services/api";
import ProgressBar from "./components/ProgressBar";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Result from "./components/Result";
import "./index.css";

function App() {
  const [step, setStep] = useState(1);

  const [options, setOptions] = useState({
    brands: [],
    fuel_types: [],
    transmissions: [],
    owners: []
  });

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    owners: "First Owner",
    presentPrice: "",
    isGccSpec: true,
    color: "White",
    engineSize: "2.0L",
    emirate: "Dubai",
    accident: "No Accident",
    service: "Full Service History",
    bodyType: "Sedan"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch options (fuel, transmission, etc)
  useEffect(() => {
    async function fetchOptions() {
      try {
        const data = await getOptions();
        if (data) {
          setOptions(data);
        }
      } catch (err) {
        console.error("Options error:", err);
      }
    }
    fetchOptions();
  }, []);

  // ✅ Handle input with numeric support
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Store as number if input type is number
    const finalValue = type === "number" ? (value === "" ? "" : Number(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // ✅ Navigation
  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleReset = () => {
    setStep(1);
    setResult(null);
  };

  // ✅ FINAL FIXED SUBMIT
  const handleSubmit = async () => {
    // 1. Debug Log
    console.log("Current Form State:", formData);

    // 2. Prepare trimmed values
    const trimmedMake = formData.make?.trim();
    const trimmedModel = formData.model?.trim();

    // 3. Robust Validation
    const errors = [];
    if (!trimmedMake) errors.push("Brand/Make is required");
    if (!trimmedModel) errors.push("Model name is required");
    if (formData.mileage === "" || isNaN(formData.mileage)) errors.push("Mileage must be a valid number");
    if (formData.presentPrice === "" || isNaN(formData.presentPrice)) errors.push("Present Price must be a valid number");
    if (formData.year > new Date().getFullYear()) errors.push("Year cannot be in the future");

    if (errors.length > 0) {
      console.warn("Validation failed:", errors);
      alert("Validation Error:\n" + errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      // Create a copy with trimmed strings for the API call
      const apiData = {
        ...formData,
        make: trimmedMake,
        model: trimmedModel
      };

      const data = await predictPrice(apiData);

      if (!data || data.error) {
        throw new Error(data?.error || "Prediction failed");
      }

      setResult(data);
      setStep(5);

    } catch (err) {
      console.error("API Error:", err);
      alert("Prediction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">🚗</span>
          <h1>UAE Vehicle Valuator</h1>
        </div>
        <p className="app-subtitle">
          Professional used car price prediction system
        </p>
      </header>

      {/* MAIN */}
      <main className="main-content">
        <div className="valuation-card">

          {/* Progress */}
          {step <= 4 && (
            <ProgressBar currentStep={step} totalSteps={4} />
          )}

          <div className="step-container">

            {step === 1 && (
              <Step1
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                options={options}
              />
            )}

            {step === 2 && (
              <Step2
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                handleBack={handleBack}
                options={options}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                handleBack={handleBack}
                options={options}
              />
            )}

            {step === 4 && (
              <Step4
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBack={handleBack}
                loading={loading}
              />
            )}

            {step === 5 && (
              <Result
                result={result}
                formData={formData}
                handleReset={handleReset}
              />
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>© 2024 UAE Vehicle Price Prediction System</p>
      </footer>
    </div>
  );
}

export default App;