// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="text-center mb-4">
      <h1 className="fw-bold text-primary">📑 我的待辦清單</h1>
      <p className="lead text-secondary">使用 React, Bootstrap 5 與 LocalStorage 開發</p>
    </header>
  );
};

export default Header;