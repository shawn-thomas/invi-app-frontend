import './styles/Dashboard.css'
import Sidebar from './Sidebar';
import Header from './Header';

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-container">
        <Header />
        {/* home container */}
      </div>
    </div>
  )
}

export default Dashboard;