import { Link } from 'react-router-dom';
import fish_logo from '../../assets/fish.svg';
import Rules from './rules/rules'
import About from './about/about'
import "./header.css";

export default function Header() {
  return (
      <header className="header">
        <Link to="/">
          <img src={fish_logo} alt="Home" className="header-logo" />
        </Link>
        <div className="header-buttons">
          <About/>
          <Rules/>
        </div>
      </header>
  );
}