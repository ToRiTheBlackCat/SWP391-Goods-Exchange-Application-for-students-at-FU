import React from 'react';
import styles from '../../styles/Footer.module.css';

const Footer = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Ensure that exactly 5 pages are shown when possible
    while (range.length < totalPages && range[0] > 1) {
      range.unshift(range[0] - 1);
    }
    while (range.length < totalPages && range[range.length - 1] < totalPages) {
      range.push(range[range.length - 1] + 1);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <footer className={styles.footer}>
      <div className={styles.paginationContainer}>
        <ul className={styles.pagination}>
          <li className={styles.paginationItem}>
            <button
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &#xab;
            </button>
          </li>
          <li className={styles.paginationItem}>
            <button
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &#x2039;
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
              &#x203a;
            </button>
          </li>
          <li className={styles.paginationItem}>
            <button
              className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ''}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              &#xbb;
            </button>
          </li>
        </ul>
      </div>

      {/* <div className={styles.footerInfo}>
        <div className={styles.footerSection}>
          <h3>Intro</h3>
          <p>
          A website for FU students to exchange goods with suitable price
          </p>
        </div>
        <div className={styles.footerSection}>
          <h3>Contact us</h3>
          <p>Phone: +84 23456 7890</p>
          <p>Email: goodsexchangefustudent@company.com</p>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© Goods Exchange FU Students</p>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
