import React from "react";

function Result({ result, formData, handleReset }) {
  if (!result) return null;

  return (
    <div className="animate-fade-in result-card">
      <div className="price-box">
        <h3>Estimated Market Value</h3>
        <div className="price-range">
          {result.min_price?.toLocaleString()} - {result.max_price?.toLocaleString()}
          <span className="aed-label">AED</span>
        </div>
        <div className="category-badge">
          {result.category || "Economy"} CLASS
        </div>
      </div>

      <div className="info-section">
        <h4>Vehicle Information Summary</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Vehicle</span>
            <span className="value">{formData.make} {formData.model}</span>
          </div>
          <div className="info-item">
            <span className="label">Year</span>
            <span className="value">{formData.year}</span>
          </div>
          <div className="info-item">
            <span className="label">Mileage</span>
            <span className="value">{Number(formData.mileage).toLocaleString()} KM</span>
          </div>
          <div className="info-item">
            <span className="label">Spec</span>
            <span className="value">{formData.isGccSpec ? "GCC Specification" : "Imported"}</span>
          </div>
          <div className="info-item">
            <span className="label">Engine & Fuel</span>
            <span className="value">{formData.engineSize || "2.0L"} / {formData.fuelType}</span>
          </div>
          <div className="info-item">
            <span className="label">Location</span>
            <span className="value">{formData.emirate || "Dubai"}</span>
          </div>
          <div className="info-item">
            <span className="label">Service History</span>
            <span className="value">{formData.service || "Full Service"}</span>
          </div>
          <div className="info-item">
            <span className="label">Accident History</span>
            <span className="value">{formData.accident || "No Accident"}</span>
          </div>
        </div>

        <div className="resale-speed">
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          High Resale Demand for this category in {formData.emirate || "Dubai"}
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-primary" onClick={handleReset}>
          New Valuation
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          Download Report
        </button>
      </div>
    </div>
  );
}

export default Result;