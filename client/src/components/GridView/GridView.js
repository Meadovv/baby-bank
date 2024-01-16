import React, { useState } from 'react';
import './GridView.css';

const GridView = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="grid-view">
        {images && images.map((image, index) => (
          <div key={index} className="grid-item" onClick={() => openModal(image)}>
            <img src={image} alt={`Grid item ${index}`} />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <img src={selectedImage} alt="Selected" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default GridView;