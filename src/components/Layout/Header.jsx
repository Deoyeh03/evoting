import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home'; 
import './Header.css'; 

export default function Header() {
  return (
    <AppBar position="static" className="app-bar">
      <Toolbar className="header-container">
        <Typography variant="h6">
          <Link to="/" className="logo" aria-label="Home">
            <HomeIcon className="logo-icon" />
            E-Voting Platform
          </Link>
        </Typography>
        <nav>
          <Link to="/signin" className="nav-link" aria-label="More-Info">
            More Info
          </Link>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
