import React from 'react';

function ImageDisplay({ image }) {
  return (
    <div className="image-display">
      <h2>Image Display</h2>
      {image ? (
        <img src={`data:image/png;base64,${image}`} alt="Received from backend" />
      ) : (
        <p>No image received yet.</p>
      )}
    </div>
  );
}

export default ImageDisplay;