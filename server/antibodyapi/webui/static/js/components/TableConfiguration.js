import React, { useState } from 'react';
import { Checkbox } from './Checkbox';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function TableConfiguration(props) {
  const [hitsPerPage, setHitsPerPage] = useState(props.hitsPerPage)

  const checkbox_props = [
    { element: "clone_id", label: "Clone ID" },
    { element: "host", label: "Host" },
    { element: "rrid", label: "RRID" },
    { element: "catalog_number", label: "Catalog#" },
    { element: "lot_number", label: "Lot#" },
    { element: "vendor_name", label: "Vendor" },
    { element: "recombinant", label: "Recombinant" },
    { element: "organ", label: "Organ" },
    { element: "author_orcids", label: "Author ORCiDs" },
    { element: "hgnc_id", label: "HGNC ID" },
    { element: "isotype", label: "Isotype" },
    { element: "concentration_value", label: "Concentration" },
    { element: "dilution_factor", label: "Dilution Factor" },
    { element: "conjugate", label: "Conjugate" },
    { element: "cycle_number", label: "Cycle#" },
    { element: "fluorescent_reporter", label: "Fluorescent Reporter" },
    { element: "manuscript_doi", label: "Manuscript DOI" },
    { element: "protocol_doi", label: "Protocol DOI" },
    { element: "vendor_affiliation", label: "Vendor Affiliation" },
    { element: "organ_uberon_id", label: "Organ UBERON ID" },
    { element: "antigen_retrieval", label: "Antigen Retrieval" },
    { element: "created_by_user_email", label: "Submitter Email" },
  ];

  const state_values = Object.assign({}, ...checkbox_props.map((x) =>
    ({ [x.element]: document.getElementById(x.element + '_col_head')?.style?.display === 'table-cell' ? true : false })
  ));
  const [checked, setChecked] = useState(state_values);

  const handleChange = (elt, to_state) => {
    var newChecked = Object.assign({}, checked);
    newChecked[elt] = to_state;
    setChecked(newChecked);
    changeEltDisplayState(elt, to_state);
  };


  const changeEltDisplayState = (elt, to_state) => {
    display[elt] = to_state ? 'table-cell' : 'none';

    const id_col = elt + '_col';
    const all_col = document.getElementsByClassName(id_col);
    for (var i = 0; i < all_col.length; i++) {
      all_col[i].style.display = display[elt];
    }

    // Uncaught TypeError: document.getElementById(...) is null
    // will only happen if no data has been loaded
    const id_header = id_col + "_head";
    const table_header_elt = document.getElementById(id_header);
    if (table_header_elt !== null) {
      table_header_elt.style.display = display[elt];
    }
  };

  const isChecked = (elt) => {
    return checked[elt];
  };

  const clearAll = () => {
    const state_values = Object.assign({}, ...checkbox_props.map((x) => ({ [x.element]: false })));
    setChecked(state_values);
    checkbox_props.forEach(x => changeEltDisplayState(x.element, false));
  };

  const setAll = () => {
    const state_values = Object.assign({}, ...checkbox_props.map((x) => ({ [x.element]: true })));
    setChecked(state_values);
    checkbox_props.forEach(x => changeEltDisplayState(x.element, true));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      props.setHitsPerPage(Number(e.currentTarget.value))
      props.onHide()
    }
  }

  const handleFilterButton = (e) => {
    e.stopPropagation()
    props.setHitsPerPage(hitsPerPage)
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Table Configuration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col>
              <InputGroup>
              <InputGroup.Text>Columns</InputGroup.Text>
                <Button onClick={setAll} variant="outline-primary">Select all</Button>
                <Button onClick={clearAll} variant="outline-primary">Clear all</Button>
              </InputGroup>
            </Col>


            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Results per page</InputGroup.Text>
                <Form.Control type='number' min={1} value={hitsPerPage} onChange={(e) => setHitsPerPage(Number(e.currentTarget.value))} aria-label="Amount of rows per page" onKeyDown={handleKeyDown} />
                <InputGroup.Text className='btn btn-primary'><span onClick={handleFilterButton}>Filter</span></InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className="content div-border grid-container">
          {checkbox_props.map(prop =>
            <Checkbox
              key={prop.element}
              label={prop.label}
              element={prop.element}
              handleChange={handleChange}
              isChecked={isChecked}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export { TableConfiguration };
