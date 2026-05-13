import React from "react";

function Step4({ formData, handleChange, handleSubmit, handleBack, loading }) {
  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <h2>Final Details</h2>
        <p>Almost there! Provide the last few details to get your valuation.</p>
      </div>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Original/Present Price (AED)</label>
          <input 
            className="form-control" 
            type="number" 
            name="presentPrice" 
            value={formData.presentPrice} 
            onChange={handleChange} 
            placeholder="e.g. 75000" 
          />
          <small style={{ color: "#64748b", marginTop: "4px" }}>
            The current showroom price for a new model of this car.
          </small>
        </div>

        <div className="form-group">
          <label>Accident History</label>
          <select 
            className="form-control" 
            name="accident" 
            value={formData.accident || "No Accident"} 
            onChange={handleChange}
          >
            <option>No Accident</option>
            <option>Minor Scratch/Dent</option>
            <option>Major Accident</option>
          </select>
        </div>

        <div className="form-group">
          <label>Service History</label>
          <select 
            className="form-control" 
            name="service" 
            value={formData.service || "Full Service History"} 
            onChange={handleChange}
          >
            <option>Full Service History</option>
            <option>Partial Service History</option>
            <option>No History</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Body Type</label>
          <select 
            className="form-control" 
            name="bodyType" 
            value={formData.bodyType || "Sedan"} 
            onChange={handleChange}
          >
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Coupe</option>
            <option>Convertible</option>
            <option>Truck/Pickup</option>
          </select>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-secondary" onClick={handleBack} disabled={loading}>← Back</button>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!formData.presentPrice || loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Calculating...
            </>
          ) : (
            "Predict Price"
          )}
        </button>
      </div>
    </div>
  );
}

export default Step4;