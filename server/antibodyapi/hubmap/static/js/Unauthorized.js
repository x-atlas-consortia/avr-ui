import Search from "./components/Search";
import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import Alert from 'react-bootstrap/Alert';
import AppNavBar from './components/AppNavBar';
import Container from "react-bootstrap/esm/Container";

const UnauthorizedPage = () => {
  return (
    <>
      <AppNavBar />
      <Container className="avr-container mt-5">
        <Alert variant='danger'>
        <Alert.Heading>Unauthorized Access</Alert.Heading>
        <p>
          In order to perform an upload, you must have an account, and it must be associated with the HuBMAP/SenNet group:&nbsp;
          <b>HuBMAP-AVR-Uploaders / SenNet-AVR-Uploaders</b>
        </p>

        <hr />
        <p className="mb-0">
          Please contact <a href="mailto:help@hubmapconsortium.org">help@hubmapconsortium.org</a> to be given permission.
        </p>
      </Alert>
      </Container>
    </>
  );
};

ReactDOM.render(
  <CookiesProvider>
    <UnauthorizedPage />
  </CookiesProvider>,
  document.getElementById("render-react-here")
);
