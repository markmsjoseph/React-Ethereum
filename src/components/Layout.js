import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';

 const Layout = (props) => {
  return (
    <div className="App">
            <header className="App-header">
              <h1 className="App-title">StartUp Funder</h1>
            </header>
    <Container>
      <Header />
      {props.children}
    </Container>
  </div>
  );
};

export default Layout;
