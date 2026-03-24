import React, { useEffect, useRef } from 'react'
import { NoHits } from 'searchkit'

function useHits() {
  const hits = useRef(null)
  useEffect(() => {
    hits.current = new NoHits({})
  }, [])
  return {hits}
}

export default useHits