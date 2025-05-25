import React from 'react';

const InfoModal = ({ description }) => (
  <div
    className="position-absolute bg-white border rounded shadow-sm p-3"
    style={{ top: '120%', right: 0, width: '240px', zIndex: 2000 }}
  >
    <h6 className="mb-2">Descripción</h6>
    <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>{description}</p>
  </div>
);

export default InfoModal;
