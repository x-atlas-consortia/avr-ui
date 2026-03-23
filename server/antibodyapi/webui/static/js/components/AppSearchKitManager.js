import { SearchkitManager } from "searchkit";

class AppSearchkitManager extends SearchkitManager {

  /**
   * This overrides the buildQuery method to add elastic search wildcard * to the keyword
   * @returns string
   */
  buildQuery() {
    const query = super.buildQuery()
    try {
      const must = query?.query?.query?.bool?.must
      if (Array.isArray(must)) {
        for (let i = 0; i < must.length; i++) {
          if (must[i].simple_query_string) {
            const k = must[i]?.simple_query_string?.query
            if (k) {
              query.query.query.bool.must[i].simple_query_string.query = k + '*'
            }
          }
        }
      }
    } catch (e) {
      console.error('Unexpected erorr in AppSearchkitManager', e)
    }
    return query
  }
}

export default AppSearchkitManager