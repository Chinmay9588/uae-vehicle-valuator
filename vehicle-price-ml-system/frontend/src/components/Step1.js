import React, { useState, useEffect } from "react";
import { getBrands, getModels } from "../services/api";

// 🎨 COLOR OPTIONS (Still static as they are usually fixed)
const colors = ["White", "Black", "Silver", "Red", "Blue", "Grey", "Gold", "Brown", "Other"];

function Step1({ formData, handleChange, handleNext }) {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // 1. Fetch Brands on Mount
  useEffect(() => {
    const fetchBrandsData = async () => {
      setLoadingBrands(true);
      try {
        const data = await getBrands();
        setBrands(data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrandsData();
  }, []);

  // 2. Fetch Models when Brand changes
  useEffect(() => {
    const fetchModelsData = async () => {
      if (!formData.make) {
        setModels([]);
        return;
      }
      setLoadingModels(true);
      try {
        const data = await getModels(formData.make);
        setModels(data || []);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModelsData();
  }, [formData.make]);

  // 🧠 Custom handler to handle Brand change + Model reset
  const handleBrandChange = (e) => {
    const { value } = e.target;
    
    // 1. Update the Brand (Make) in parent state
    handleChange({
      target: {
        name: "make",
        value: value,
        type: "select"
      }
    });
    
    // 2. RESET the Model selection
    handleChange({
      target: {
        name: "model",
        value: "",
        type: "select"
      }
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <h2 className="step-title">Vehicle Identification</h2>
        <p className="step-description">Select your vehicle's make and model from our UAE dataset.</p>
      </div>

      <div className="form-grid">
        {/* 1. BRAND DROPDOWN */}
        <div className="form-group">
          <label htmlFor="make" className="form-label">Brand (Make)</label>
          <div className="select-wrapper">
            <select 
              className={`form-control ${loadingBrands ? 'loading' : ''}`} 
              id="make"
              name="make" 
              value={formData.make} 
              onChange={handleBrandChange}
              disabled={loadingBrands}
            >
              <option value="">{loadingBrands ? "Loading Brands..." : "Select Brand"}</option>
              {brands?.map((brand, i) => (
                <option key={i} value={brand}>{brand}</option>
              ))}
            </select>
            {loadingBrands && <div className="spinner-small"></div>}
          </div>
        </div>

        {/* 2. MODEL DROPDOWN (DEPENDENT) */}
        <div className="form-group">
          <label htmlFor="model" className="form-label">Model</label>
          <div className="select-wrapper">
            <select 
              className={`form-control ${loadingModels ? 'loading' : ''}`} 
              id="model"
              name="model" 
              value={formData.model} 
              onChange={handleChange}
              disabled={!formData.make || loadingModels}
            >
              <option value="">
                {!formData.make ? "Choose Brand First" : (loadingModels ? "Loading Models..." : "Select Model")}
              </option>
              {models?.map((model, i) => (
                <option key={i} value={model}>{model}</option>
              ))}
              {formData.make && !loadingModels && models.length === 0 && (
                <option value="Other">No models found - Enter Manual</option>
              )}
            </select>
            {loadingModels && <div className="spinner-small"></div>}
          </div>
        </div>

        {/* 3. COLOR DROPDOWN */}
        <div className="form-group">
          <label htmlFor="color" className="form-label">Exterior Color</label>
          <select 
            className="form-control" 
            id="color"
            name="color" 
            value={formData.color || ""} 
            onChange={handleChange}
          >
            <option value="">Select Color</option>
            {colors.map((color, i) => (
              <option key={i} value={color}>{color}</option>
            ))}
          </select>
        </div>

        {/* 4. YEAR INPUT */}
        <div className="form-group">
          <label htmlFor="year" className="form-label">Manufacturing Year</label>
          <input 
            className="form-control" 
            type="number" 
            id="year"
            name="year" 
            value={formData.year} 
            onChange={handleChange} 
            placeholder="e.g. 2022" 
            min="1990"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="btn btn-primary btn-next" 
          onClick={handleNext}
          disabled={!formData.make || !formData.model || !formData.year || loadingModels}
        >
          {loadingModels ? "Loading..." : "Next Step →"}
        </button>
      </div>

      <style jsx>{`
        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .spinner-small {
          position: absolute;
          right: 10px;
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading {
          padding-right: 35px;
        }
      `}</style>
    </div>
  );
}

export default Step1;