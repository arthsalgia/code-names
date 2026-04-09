import { useState } from 'react';
import { Link } from 'react-router-dom';
import fish_logo from '../assets/fish.svg';
import Rules from './rules'
import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <Link to="/">
        <img src={fish_logo} alt="Home" className="header-logo" />
      </Link>
      <Rules/>
    </header>
  );
}