import React from "react";

function Step3({ formData, handleChange, handleNext, handleBack }) {
  
  const handleToggle = (val) => {
    // Simulate a target object for handleChange
    handleChange({
      target: {
        name: "isGccSpec",
        value: val
      }
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <h2>Regional Specifications</h2>
        <p>Regional specs significantly impact the resale value in UAE.</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Specification Type</label>
          <div className="toggle-group">
            <button 
              type="button"
              className={`toggle-btn ${formData.isGccSpec ? "active" : ""}`}
              onClick={() => handleToggle(true)}
            >
              GCC Spec
            </button>
            <button 
              type="button"
              className={`toggle-btn ${!formData.isGccSpec ? "active" : ""}`}
              onClick={() => handleToggle(false)}
            >
              Imported
            </button>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Primary Emirate</label>
          <select 
            className="form-control" 
            name="emirate" 
            value={formData.emirate || "Dubai"} 
            onChange={handleChange}
          >
            <option>Abu Dhabi</option>
            <option>Dubai</option>
            <option>Sharjah</option>
            <option>Ajman</option>
            <option>Umm Al Quwain</option>
            <option>Ras Al Khaimah</option>
            <option>Fujairah</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Transmission</label>
          <select 
            className="form-control" 
            name="transmission" 
            value={formData.transmission} 
            onChange={handleChange}
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-secondary" onClick={handleBack}>← Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next Step →</button>
      </div>
    </div>
  );
}

export default Step3;