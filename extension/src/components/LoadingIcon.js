import React from "react";

const LoadingIcon = ({ fullScreen = true }) => {
  let overlayClass = "loading-overlay full-height";
  if (!fullScreen) overlayClass = "loading-overlay";
  return (
    <div className={overlayClass}>
      <em className="loading-icon" />
    </div>
  );
};

export default LoadingIcon;
