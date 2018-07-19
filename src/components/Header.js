import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link to="/" className="item">
        Startup Funder
      </Link>

      <Menu.Menu position="right">
        <Link to="/" className="item">
        Campaigns
        </Link>

        <Link to="/campaigns/new" className="item">
        +
        </Link>
      </Menu.Menu>
    </Menu>
  );
};


export default Header;
