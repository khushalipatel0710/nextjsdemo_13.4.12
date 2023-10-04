




const commonResponse = (success, data, message, error) => ({
  success: success,
  message: message || '',
  error: success === false ? true : false,
  data: data == null ? {} : data
})
function paginateRequestParams({ page, limit, ...otherParams }) {
  const defaultPaginationLimit = 10

  limit = limit || defaultPaginationLimit
  page = Number(page) || 1

  return {
    ...otherParams,
    page,
    limit
  }
}




module.exports = {
  commonResponse: commonResponse,
  paginateRequestParams: paginateRequestParams,
 
  
}
