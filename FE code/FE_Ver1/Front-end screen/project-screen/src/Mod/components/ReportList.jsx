  import { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import axiosInstance from '../../utils/axiosInstance';
  import styles from '../styles/ReportList.module.css';
  import Navbar from './Navbar';

  const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchReports = async () => {
        try {
          const response = await axiosInstance.get('/api/Report/Mod/ViewReportList');
          setReports(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.response?.data?.message || 'There was an error fetching the reports!');
          setLoading(false);
        }
      };

      fetchReports();
    }, []);

    const markDone = async (reportId) => {
      const confirm = window.confirm('Are you sure you want to mark this report as done?');
      if (!confirm) return;

      try {
        await axiosInstance.post(`/api/Report/Mod/MarkDoneReport/${reportId}`);
        setReports(reports.filter(report => report.reportId !== reportId));
      } catch (error) {
        setError(error.response?.data?.message || 'There was an error marking the report as done!');
      }
    };

    // const viewReportDetail = (report) => {
    //   setSelectedReport(report);
    // };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
      <>
      <Navbar/>
      <div className={styles.reportListContainer}>
        <h1>Reported Products List</h1>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Product ID</th>
              <th>Reported By</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.reportId}>
                <td>{report.reportId}</td>
                <td>{report.productId}</td>
                <td>{report.userId}</td>
                <td>{report.detail}</td>
                <td>{formatDate(report.reportDate)}</td>
                <td>
                  <button 
                    className={`${styles.actionButton} ${styles.done}`} 
                    onClick={() => markDone(report.reportId)}
                    aria-label={`Mark report ${report.reportId} as done`}
                  >
                    DONE
                  </button>
                  {/* <button 
                    className={`${styles.actionButton} ${styles.view}`} 
                    onClick={() => viewReportDetail(report)}
                    aria-label={`View details of report ${report.reportId}`}
                  >
                    View Details
                  </button> */}
                  <Link 
                    to={`/mod/product/${report.productId}`} 
                    className={`${styles.actionButton} ${styles.view}`}
                  >
                    View Product
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedReport && (
          <div className={styles.modal} role="dialog" aria-modal="true">
            <div className={styles.modalContent}>
              <h2>Report Details</h2>
              <p><strong>Report ID:</strong> {selectedReport.reportId}</p>
              <p><strong>Product ID:</strong> {selectedReport.productId}</p>
              <p><strong>Reported By:</strong> {selectedReport.userId}</p>
              <p><strong>Reason:</strong> {selectedReport.detail}</p>
              <p><strong>Date:</strong> {formatDate(selectedReport.reportDate)}</p>
              <button onClick={() => setSelectedReport(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      </>
    );
  };

  export default ReportList;
