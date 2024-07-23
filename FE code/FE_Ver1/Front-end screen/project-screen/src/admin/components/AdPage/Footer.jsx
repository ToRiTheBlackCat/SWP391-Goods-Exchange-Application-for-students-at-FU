import PropTypes from 'prop-types';
import styles from '../../styles/Footer.module.css'; // Import CSS module

const Footer = ({ currentPage, totalPages, onPageChange }) => {
  // Handles the page change by calling onPageChange if the new page is within the valid range
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generates the range of page numbers to display in the pagination
  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Ensure that exactly 5 pages are shown when possible
    while (range.length < 5 && range[0] > 1) {
      range.unshift(range[0] - 1);
    }
    while (range.length < 5 && range[range.length - 1] < totalPages) {
      range.push(range[range.length - 1] + 1);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className={styles.paginationContainer}>
      <ul className={styles.pagination}>
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &#xab; {/* Double left arrow */}
          </button>
        </li>
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &#x2039; {/* Single left arrow */}
          </button>
        </li>
        {paginationRange.map((num) => (
          <li key={num} className={styles.paginationItem}>
            <button
              onClick={() => handlePageChange(num)}
              className={`${styles.paginationButton} ${currentPage === num ? styles.paginationButtonActive : ''}`}
            >
              {num}
            </button>
          </li>
        ))}
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &#x203a; {/* Single right arrow */}
          </button>
        </li>
        <li className={styles.paginationItem}>
          <button
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &#xbb; {/* Double right arrow */}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
