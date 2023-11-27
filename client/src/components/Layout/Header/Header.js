import Navigator from '../Navigator/Navigator';
import './Header.css'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="nav-area">
      <Link to="/">
        <img className='logo-image' alt='logo' src='/images/logo.png' />
      </Link>
      <Navigator />
    </div>
  );
};

export default Header;