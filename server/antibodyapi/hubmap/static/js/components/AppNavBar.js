import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import 'bootstrap/dist/css/bootstrap.min.css';


const AppNavBar = () => {
  

  return (
    <Navbar expand="lg"  bg="secondary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
              src="/static/atlas-logo.png"
              width="50"
              className="d-inline-block align-top"
              alt="X-Atlas AVR"
            />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="atlas-navbar-nav" />
        <Navbar.Collapse id="atlas-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://hubmapconsortium.org/open-working-groups">About AVRs at ARWG</Nav.Link>
            <Nav.Link href="https://docs.hubmapconsortium.org/avr/index.html">AVRs</Nav.Link>
            <Nav.Link href="https://zenodo.org/doi/10.5281/zenodo.7418623">AVR SOP</Nav.Link>
            <Nav.Link href="/upload">Add AVRs</Nav.Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavBar