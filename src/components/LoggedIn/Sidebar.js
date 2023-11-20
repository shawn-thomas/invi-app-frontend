import './styles/Sidebar.css'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import QrCodeSharpIcon from '@mui/icons-material/QrCodeSharp';
import RequestPageSharpIcon from '@mui/icons-material/RequestPageSharp';
import InventorySharpIcon from '@mui/icons-material/InventorySharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';

function Sidebar() {
  return (
    <div className='sidebar'>
      <div className="sidebar-top">
        <span className="sidebar-logo">
          Invi
        </span>
      </div>
      <hr />
      <div className="sidebar-center">
        <ul>
          <p className='sidebar-sub'>MAIN</p>
          <li>
            <DashboardIcon className='sidebar-li-icon'/>
            <span>Dashboard</span>
          </li>
          <p className='sidebar-sub'>LISTS</p>
          <li>
            <PeopleSharpIcon className='sidebar-li-icon'/>
            <span>Customers</span>
          </li>
          <li>
            <QrCodeSharpIcon className='sidebar-li-icon'/>
            <span>Inventory</span>
          </li>
          <li>
            <RequestPageSharpIcon className='sidebar-li-icon'/>
            <span>Invoices</span>
          </li>
          <p className='sidebar-sub'>USEFUL</p>
          <li>
            <InventorySharpIcon className='sidebar-li-icon'/>
            <span>Audit</span>
          </li>
          <p className='sidebar-sub'>USER</p>
          <li>
            <LogoutSharpIcon className='sidebar-li-icon' />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-color-opt"></div>
        <div className="sidebar-color-opt"></div>
        <div className="sidebar-color-opt"></div>
      </div>
    </div>
  )
}

export default Sidebar;