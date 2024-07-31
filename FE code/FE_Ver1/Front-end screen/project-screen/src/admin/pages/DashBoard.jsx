import { useState } from 'react'
import '../styles/DashBoard.css';
import Header from '../components/DashBoard/Header.jsx';
import Sidebar from '../components/DashBoard/Sidebar.jsx';
import Charts from '../components/DashBoard/Charts.jsx';
import Navbar from '../components/Navbar.jsx';

function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const OpenSidebar = () =>{
    setOpenSidebarToggle(!openSidebarToggle)
  }
  return (
    <div className='grid-container'>
        {/* <Navbar/> */}
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <Charts/>
    </div>
  )
}

export default Dashboard