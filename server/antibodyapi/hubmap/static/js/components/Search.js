import React, { useState } from 'react';
import {
  SearchkitManager, SearchkitProvider, SearchBox, Hits, Layout, TopBar, LayoutBody, SideBar,
  HierarchicalMenuFilter, RefinementListFilter, ActionBar, LayoutResults, HitsStats, Panel,
  ActionBarRow, SelectedFilters, ResetFilters, NoHits, Pagination, InitialLoader, ExistsQuery, BoolMustNot
} from "searchkit";
import AntibodyHitsTable from './AntibodyHitsTable';
import { AdditionalColumns } from './AdditionalColumns';
import DownloadFile from './DownloadFile';
import AppNavBar from './AppNavBar';
import Popup from 'reactjs-popup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCookies } from 'react-cookie';
import CookieConsent from 'react-cookie-consent';

const searchkit = new SearchkitManager("/");
searchkit.addDefaultQuery(query =>
  query.addQuery(
    BoolMustNot([ ExistsQuery("next_version_id") ])
  )
);

class BannerMessage extends React.Component {
    render () {
        if (!banner_message) {
            return(
              <div></div>
            );
        }

        return(
          <div className="banner">
            <div dangerouslySetInnerHTML={{ __html: banner_message }} />
          </div>
        );
    }
}

function collapseAllFilters() {
  const filters_dev = document.querySelectorAll(".sk-layout__filters");
  const header = filters_dev[0].querySelectorAll(".sk-panel__header.is-collapsable:not(.is-collapsed)")
  Array.prototype.forEach.call(header, function(f) {
    f.classList.add("is-collapsed");
  });
  const content = filters_dev[0].querySelectorAll(".sk-panel__content:not(.is-collapsed)")
  Array.prototype.forEach.call(content, function(c) {
    c.classList.add("is-collapsed");
  });
  //Array.prototype.forEach.call(filters_dev, function(h) {h.forceUpdate()});
  window.location.reload();
}

function Search(props) {
  const [modalShow, setModalShow] = React.useState(false)
  const [modalBody, setModalBody] = useState(null)

  const options = { showEllipsis: true, showLastIcon: false, showNumbers: true }
  //console.info('Search display: ', display);
  const [cookies] = useCookies([]);
  //console.info('Search cookies:', cookies);
  // cookies override the display defaults of the server
  for (const [key, value] of Object.entries(cookies)) {
    if (value==='true') {
      display[key] = "table-cell";
    }
  }
  //console.info('Search display after cookie set: ', display);

  return(
<SearchkitProvider searchkit={searchkit}>
  <>
  <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
  <Layout>
    <AppNavBar />
    
    <BannerMessage />
    <LayoutBody>
      {/* <div className='panel'>
        <h2 >What is AVR? </h2>
        <p>Antibody Validation Reports (AVRs) provide information on the characterization of individual antibodies for multiplexed antibody-based imaging assays. AVRs additionally report details not included by antibody vendors such as the best performing conjugate for a particular clone and/or the impact of cycle order on immunogenicity. The current AVR database, on the Human Biomolecular Atlas Program (HuBMAP) AVR Search website, allows validated antibodies to be queried by clone, Research Resource Identifiers (RRIDs), catalog number, organ/tissue, and HuBMAP platform. This AVR metadata is included in a .CSV file uploaded to the portal by the contributing author for all AVRs submitted at one time. The AVR is completed as a text file and saved as a PDF for submission to the HuBMAP AVR upload site; it contains additional characterization data. Results from queries of the database may be downloaded as a .CSV and individual AVRs may be downloaded and viewed as a PDF.</p>
        <p>AVRs were piloted to provide individual antibody validation information for the diverse antibody-based methods employed by HuBMAP members. Importantly, AVRs have become tightly integrated with Organ Mapping Antibody Panels (OMAPs)(<a href="https://humanatlas.io/omap">https://humanatlas.io/omap</a>), a comprehensive panel of curated antibodies that identifies the major anatomical structures and cell types present in a specific organ. The selected antibodies are optimized for a tissue preservation method and multiplexed imaging modality. Both efforts share standardized metadata fields that will facilitate construction of a searchable antibody database. Beginning in 2023, we are excited to open AVR contributions to the larger community, beyond HuBMAP members.</p>
      </div> */}
   
      <h1>Antibody Validation Report Search</h1>
      <SearchBox
      autofocus={true}
      queryOptions={{analyzer:"standard"}}
      searchOnChange={true}
      queryFields={[
          "antibody_uuid","antibody_hubmap_id","protocol_doi","manuscript_doi","uniprot_accession_number",
          "target_symbol","target_aliases","rrid","host",
          "clonality","clone_id","vendor","catalog_number","lot_number",
          "recombinant","organ","organ_uberon_id","omap_id","antigen_retrieval","hgnc_id","isotype",
          "concentration_value","dilution_factor","conjugate","method","tissue_preservation","cycle_number",
          "fluorescent_reporter","author_orcids","vendor_affiliation","created_by_user_displayname",
          "created_by_user_email","avr_pdf_filename", "previous_version_id", "next_version_id"
      ]}
      />
      <div className='searchView'>
      <SideBar>
        <h3>Filters</h3>
        <a className='collapseButton' onClick={collapseAllFilters}>Collapse all</a>
        <ResetFilters />
        <RefinementListFilter
          id="clonality"
          title="Clonality"
          field="clonality.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="conjugate"
          title="Conjugate"
          field="conjugate.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="host"
          title="Host"
          field="host.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="method"
          title="Method"
          field="method.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="organ"
          title="Organ"
          field="organ.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="recombinant"
          title="Recombinant"
          field="recombinant.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="target_symbol"
          title="Target Symbol"
          field="target_symbol.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="tissue_preservation"
          title="Tissue Preservation"
          field="tissue_preservation.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />
        <RefinementListFilter
          id="vendor_name"
          title="Vendor"
          field="vendor_name.keyword"
          operator="OR"
          searchable={true}
          size={10} limit={10}
          containerComponent={<Panel collapsable={true} defaultCollapsed={true}/>}
        />

      </SideBar>

      <LayoutResults>

        <ActionBar>
          <ActionBarRow>
          <HitsStats />
          </ActionBarRow>
          <ActionBarRow>
            <SelectedFilters />
          </ActionBarRow>
        </ActionBar>

        <span className='float-right'><Button variant="primary" onClick={() => setModalShow(true)}>
          Configure Columns
        </Button></span>
        <AdditionalColumns show={modalShow}
        onHide={() => setModalShow(false)}/>

          <Hits
            listComponent={AntibodyHitsTable}
            hitsPerPage={20}
            mod="sk-hits-list"
          />
        <InitialLoader />
        <NoHits />

        <Pagination options={options} />
        <DownloadFile />

      </LayoutResults>
      </div>
    </LayoutBody>
  </Layout>
  </>
</SearchkitProvider>
)};

export default Search;
