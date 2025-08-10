import React from 'react';
import nopage from '../nopage.png'; 

function PageNotFound() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <img src={nopage} alt="Page Not Found" style={{ maxWidth: '80%', maxHeight: '80%' }} />
    </div>
  );
}

export default PageNotFound;