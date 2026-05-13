import React from "react";

function Step2({ formData, handleChange, handleNext, handleBack }) {
  // Define static arrays inside the component to ensure they are never undefined
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Gas (LPG/CNG)'];
  const ownerTypes = ['First Owner', 'Second Owner', 'Third Owner'];

  // Component Safety: Add a check to make the component robust
  if (!fuelTypes || !ownerTypes) return null;

  return (
    <div className="animate-fade-in">
      <div className="step-header">
        <h2>Technical Details</h2>
        <p>Specific information about the car's usage and mechanics.</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Kilometers Driven</label>
          <input
            className="form-control"
            type="number"
            name="mileage"
            value={formData.mileage || ""}
            onChange={handleChange}
            placeholder="e.g. 50000"
          />
        </div>

        <div className="form-group">
          <label>Owner</label>
          <select
            className="form-control"
            name="owners"
            value={formData.owners || ""}
            onChange={handleChange}
          >
            {/* Use Optional Chaining ?.map() to prevent runtime crashes */}
            {ownerTypes?.map((owner, i) => (
              <option key={i} value={owner}>{owner}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Engine Size</label>
          <select
            className="form-control"
            name="engineSize"
            value={formData.engineSize || "2.0L"}
            onChange={handleChange}
          >
            <option>1.2L</option>
            <option>1.5L</option>
            <option>1.6L</option>
            <option>2.0L</option>
            <option>2.4L</option>
            <option>3.0L</option>
            <option>4.0L+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fuel Type</label>
          <select
            className="form-control"
            name="fuelType"
            value={formData.fuelType || ""}
            onChange={handleChange}
          >
            {/* Use Optional Chaining ?.map() to prevent runtime crashes */}
            {fuelTypes?.map((fuel, i) => (
              <option key={i} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-secondary" onClick={handleBack}>← Back</button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!formData.mileage}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}

export default Step2;