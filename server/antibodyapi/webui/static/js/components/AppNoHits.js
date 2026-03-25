import React from 'react';
import { NoHits } from "searchkit";
import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/Spinner"

class AppNoHits extends NoHits {
  getPageParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get('p')
  }
  pageNumber() {
    const pageParam = this.getPageParam()
    let pageNumber = pageParam ? Number(pageParam) : 1;
    if (typeof pageNumber !== 'number') {
      pageNumber = 1
    }
    return pageNumber
  }
  isOutOfBounds() {
    const from = ((this.pageNumber() - 1) * this.props.hitsPerPage) + 1
    return this.getPageParam() && from > this.getHitsCount()
  }
  render() {

    if (this.isOutOfBounds() && !this.isLoading()) {
      setTimeout(()=>{
        $('.sk-pagination-navigation, #downloadfile').hide()
      }, 0)
      return (<Alert variant='warning'>
      <div className='text-center'>No results found for the given page <code>p={this.pageNumber()}</code> filter.</div>
    </Alert>)
    }
   
    if ((this.hasHits() || this.isInitialLoading() || this.isLoading()) && !this.getError()) {
      return (<div style={{height: '50px'}} className='text-center'>
        {(this.isInitialLoading() || this.isLoading()) && <Spinner variant='primary' />}
      </div>)
    }

    return (<Alert variant='warning'>
      <div className='text-center'>No results found for "<em>{this.getQuery().getQueryString()}</em>".   </div>
    </Alert>)
  }
}

export default AppNoHits