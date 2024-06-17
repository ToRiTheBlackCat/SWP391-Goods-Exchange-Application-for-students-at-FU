import React from 'react';
import styles from '../styles/Filter.module.css';

const Filter = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" onChange={handleSortChange}>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
        <option value="price_asc">Price Ascending</option>
        <option value="price_desc">Price Descending</option>
      </select>
    </div>
  );
};

export default Filter;
