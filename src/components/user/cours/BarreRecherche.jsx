// src/components/common/BarreRecherche.jsx
import React from 'react';

export default function BarreRecherche({ value, onChange, placeholder = '🔍 Rechercher…' }) {
  return (
    <input
      type="text"
      className="search-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
