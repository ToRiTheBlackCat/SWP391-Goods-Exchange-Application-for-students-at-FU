import PropTypes from 'prop-types';
import styles from '../../styles/Filter.module.css';

const Filter = ({ onSortChange }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <label htmlFor="sort" className={styles.label}>Sort by:</label>
      <select id="sort" className={styles.select} onChange={handleSortChange} aria-label="Sort by">
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
        <option value="price_asc">Price Ascending</option>
        <option value="price_desc">Price Descending</option>
      </select>
    </div>
  );
};

Filter.propTypes = {
  onSortChange: PropTypes.func,
};

export default Filter;