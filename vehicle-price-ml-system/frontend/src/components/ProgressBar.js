import React from "react";

function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="step-info">
        <span className={currentStep >= 1 ? "active" : ""}>Step 1</span>
        <span className={currentStep >= 2 ? "active" : ""}>Step 2</span>
        <span className={currentStep >= 3 ? "active" : ""}>Step 3</span>
        <span className={currentStep >= 4 ? "active" : ""}>Step 4</span>
      </div>
    </div>
  );
}

export default ProgressBar;