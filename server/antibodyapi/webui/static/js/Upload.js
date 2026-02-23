import Search from "./components/Search";
import React from "react";
import ReactDOM from "react-dom";
import { CookiesProvider } from "react-cookie";
import AppNavBar from './components/AppNavBar';
import Container from "react-bootstrap/esm/Container";

const UploadPage = () => {
  return (
    <>
      <AppNavBar />
      <Container className="avr-container mt-5">
       
      </Container>
    </>
  );
};

ReactDOM.render(
  <CookiesProvider>
    <UploadPage />
  </CookiesProvider>,
  document.getElementById("render-react-here")
);
