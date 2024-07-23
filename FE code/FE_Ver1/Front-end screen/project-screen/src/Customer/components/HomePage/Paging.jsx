import React from 'react';
import styles from '../../styles/Paging.module.css';

const Paging = () => {
  return (
    <div className={styles.footerInfo}>
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
    </div>
  );
}

export default Paging;
