import React from 'react';

import {
  HitsStats,
} from "searchkit";

class AppHitsStats extends HitsStats {
  renderText() {
    if (this.getHitsCount() <= 0 || !this.getHits()?.length) {
      return (<></>)
    }
    const params = new URLSearchParams(window.location.search);
    let pageNumber = params.get('p') ? Number(params.get('p')) : 1;
    if (typeof pageNumber !== 'number') {
      pageNumber = 1
    }
    const from = ((pageNumber - 1) * this.props.hitsPerPage) + 1
    return (<div className={`${this.bemBlocks.container("info")}`}>Showing <strong>{from}</strong> to <strong>{pageNumber * this.props.hitsPerPage}</strong> results out of <strong>{this.getHitsCount()}</strong> after {this.searchkit.getTime()}ms.</div>)
  }

  render() {

    return <>{this.renderText()}</>
  }
}

export default AppHitsStats