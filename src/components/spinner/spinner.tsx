import React from 'react';

const Spinner = (): React.ReactElement => (
  <div className="spinner">
    <div className="spinner__container">
      <div className="spinner__circle"></div>
      <p className="spinner__text">Loading...</p>
    </div>
  </div>
);

export default Spinner;
