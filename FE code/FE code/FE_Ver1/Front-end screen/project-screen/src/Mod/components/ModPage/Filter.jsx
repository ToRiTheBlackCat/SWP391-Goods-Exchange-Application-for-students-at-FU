import PropTypes from 'prop-types';
import styles from '../../styles/Filter.module.css';

const Filter = ({ onSortChange, onDeleteSort, sortOrder }) => {
  const handleSortChange = (event) => {
    onSortChange(event.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <label htmlFor="sort" className={styles.label}>Sort by:</label>
      <select
        id="sort"
        className={styles.select}
        onChange={handleSortChange}
        value={sortOrder}
        aria-label="Sort by"
      >
        <option value="">None</option>
        <option value="name_asc">Name A-Z</option>
        <option value="name_desc">Name Z-A</option>
        <option value="price_asc">Price Ascending</option>
        <option value="price_desc">Price Descending</option>
      </select>
      <button
        className={styles.deleteButton}
        onClick={onDeleteSort}
        aria-label="Delete Sort"
      >
        X
      </button>
    </div>
  );
};

Filter.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  onDeleteSort: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

export default Filter;
