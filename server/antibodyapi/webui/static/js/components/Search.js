import React, { useState, useEffect, useMemo } from 'react';
import {
  SearchkitProvider, SearchBox, Hits, Layout, LayoutBody, SideBar,
  RefinementListFilter, ActionBar, LayoutResults, HitsStats, Panel,
  ActionBarRow, SelectedFilters, ResetFilters, NoHits, Pagination, InitialLoader, ExistsQuery, BoolMustNot
} from "searchkit";
import AntibodyHitsTable from './AntibodyHitsTable';
import { TableConfiguration } from './TableConfiguration';
import DownloadFile from './DownloadFile';
import AppNavBar from './AppNavBar';
import RefinementOption from './RefinementOption'
import Button from 'react-bootstrap/Button';
import { useCookies } from 'react-cookie';
import CookieConsent from 'react-cookie-consent';
import AppSearchkitManager from './AppSearchKitManager';
import AppHitsStats from './AppHitsStats';
import AppNoHits from './AppNoHits';
import Alert from 'react-bootstrap/Alert';


class BannerMessage extends React.Component {
  render() {
    if (!banner_message) {
      return (
        <></>
      );
    }

    return (
      <div className='sk-layout__body'>
        <Alert variant={banner_message_alert_style || 'info'}>
        <div dangerouslySetInnerHTML={{ __html: banner_message }} />
      </Alert>
      </div>
      
    );
  }
}

function collapseAllFilters() {
  const filters_dev = document.querySelectorAll(".sk-layout__filters");
  const header = filters_dev[0].querySelectorAll(".sk-panel__header.is-collapsable:not(.is-collapsed)")
  Array.prototype.forEach.call(header, function (f) {
    f.classList.add("is-collapsed");
  });
  const content = filters_dev[0].querySelectorAll(".sk-panel__content:not(.is-collapsed)")
  Array.prototype.forEach.call(content, function (c) {
    c.classList.add("is-collapsed");
  });
  //Array.prototype.forEach.call(filters_dev, function(h) {h.forceUpdate()});
  window.location.reload();
}

function Search(props) {
  const [modalShow, setModalShow] = useState(false)
  const [hitsPerPage, setHitsPerPage] = useState(20)
  const [providerKey, setProviderKey] = useState(null)

  const options = { showEllipsis: true, showLastIcon: false, showNumbers: true }
  const [cookies] = useCookies([]);

  // cookies override the display defaults of the server
  for (const [key, value] of Object.entries(cookies)) {
    if (value === 'true') {
      display[key] = "table-cell";
    }
  }

  useEffect(() => {
    setProviderKey(new Date().getTime())
    
  }, [hitsPerPage])

  const searchkit = useMemo(() => new AppSearchkitManager("/"), [hitsPerPage]);
  searchkit.addDefaultQuery(query => {
    return query.addQuery(
      BoolMustNot([ExistsQuery("next_version_id")])
    )
  });

  return (
    <SearchkitProvider searchkit={searchkit} key={providerKey}>
      <>
        <CookieConsent>
          This website uses cookies to enhance the user experience.
        </CookieConsent>
        <Layout>
          <AppNavBar />

          {banner_message && <BannerMessage />}
          <LayoutBody className={banner_message ? "mt-2" : ""}>
            <h1>HuBMAP/SenNet Antibody Validation Report Search</h1>
            <SearchBox
              autofocus={true}
              queryOptions={{ analyzer: "standard" }}
              searchOnChange={false}
              queryFields={[
                "antibody_uuid",
                "antibody_hubmap_id",
                "protocol_doi",
                "manuscript_doi",
                "uniprot_accession_number",
                "target_symbol",
                "target_aliases",
                "rrid",
                "host",
                "clonality.keyword",
                "clone_id",
                "vendor",
                "catalog_number",
                "lot_number",
                "recombinant",
                "organ",
                "organ_uberon_id",
                "omap_id",
                "antigen_retrieval",
                "hgnc_id",
                "isotype",
                "concentration_value",
                "dilution_factor",
                "conjugate",
                "method",
                "tissue_preservation",
                "cycle_number",
                "fluorescent_reporter",
                "author_orcids",
                "vendor_affiliation",
                "created_by_user_displayname",
                "created_by_user_email",
                "avr_pdf_filename",
                "previous_version_id",
                "next_version_id",
              ]}
            />
            <div className="searchView">
              <SideBar>
                <h3>Filters</h3>
                <a className="collapseButton" onClick={collapseAllFilters}>
                  Collapse all
                </a>
                <ResetFilters />
                <RefinementListFilter
                  id="clonality"
                  title="Clonality"
                  field="clonality.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="conjugate"
                  title="Conjugate"
                  field="conjugate.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="host"
                  title="Host"
                  field="host.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="method"
                  title="Method"
                  field="method.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="organ"
                  title="Organ"
                  field="organ.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="cell_marker"
                  title="Cell Marker"
                  field="cell_marker.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="taxon"
                  title="Taxon"
                  field="taxon.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="recombinant"
                  title="Recombinant"
                  field="recombinant.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="target_symbol"
                  title="Target Symbol"
                  field="target_symbol.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="tissue_preservation"
                  title="Tissue Preservation"
                  field="tissue_preservation.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="recommended"
                  title="Recommended"
                  field="recommended.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
                <RefinementListFilter
                  id="vendor_name"
                  title="Vendor"
                  field="vendor_name.keyword"
                  operator="OR"
                  searchable={true}
                  size={10}
                  limit={10}
                  itemComponent={RefinementOption}
                  containerComponent={
                    <Panel collapsable={true} defaultCollapsed={true} />
                  }
                />
              </SideBar>

              <LayoutResults>
                <div className="sk-searchActions">
                  <ActionBar>
                    <ActionBarRow>
                      <AppHitsStats hitsPerPage={hitsPerPage} pageNumber={1} />
                    </ActionBarRow>
                    <ActionBarRow>
                      <SelectedFilters />
                    </ActionBarRow>
                  </ActionBar>

                  <div>
                    <Button
                      className="mb-2"
                      variant="primary"
                      onClick={() => setModalShow(true)}
                    >
                      <i className="bi bi-table"></i>&nbsp; Configure Table
                    </Button>
                  </div>
                  <TableConfiguration
                    setHitsPerPage={setHitsPerPage}
                    hitsPerPage={hitsPerPage}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </div>
                <Hits
                  listComponent={AntibodyHitsTable}
                  hitsPerPage={hitsPerPage}
                  mod="sk-hits-list"
                />
                {/* <InitialLoader /> */}
                <AppNoHits
                  hitsPerPage={hitsPerPage}
                  paginationOptions={options}
                />
                <Pagination options={options} />
                <DownloadFile />
              </LayoutResults>
            </div>
          </LayoutBody>
        </Layout>
      </>
    </SearchkitProvider>
  );
};

export default Search;
