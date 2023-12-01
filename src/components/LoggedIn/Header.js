import "./styles/Header.css";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import inviLogo from '../../images/InviLogo.svg'
import { NavLink } from "react-router-dom";

function Header() {
  // return (
  //   <div className="header">
  //     <div className="header-wrapper">
  //       <div className="header-search">
  //         <input
  //           type="text"
  //           placeholder="Search..."
  //         />
  //         <SearchSharpIcon />
  //       </div>
  //       <div className="header-items">
  //         <div className="header-item">
  //           <DarkModeOutlinedIcon className="header-icon"/>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <header className="header">
      <NavLink to="/" className="header-title header-item">
        <img className="header-logo" src={inviLogo} alt="invi-logo" />
      </NavLink>
    </header>
  );

}

export default Header;