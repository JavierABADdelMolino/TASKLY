import React from 'react';

const InfoModal = ({ description }) => (
  <div
    className="card border rounded shadow-sm p-3 position-absolute"
    style={{ top: '100%', left: '100%', marginTop: '2px', marginLeft: '2px', width: '240px', zIndex: 2000 }}
  >
    <h6 className="mb-2">Descripción</h6>
    <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>{description}</p>
  </div>
);

export default InfoModal;
