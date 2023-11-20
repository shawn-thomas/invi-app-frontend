import "./styles/Header.css";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

function Header() {
  return (
    <div className="header">
      <div className="header-wrapper">
        <div className="header-search">
          <input
            type="text"
            placeholder="Search..."
          />
          <SearchSharpIcon />
        </div>
        <div className="header-items">
          <div className="header-item">
            <DarkModeOutlinedIcon className="header-icon"/>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Header;