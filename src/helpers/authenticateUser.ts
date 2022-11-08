import axios from "axios";

export const authenticateUser = async (doc: any) => {
  const { email, password, vendor } = doc
  let response
  try {
    const DOMAIN_URL = process.env.DOMAIN_URL
    const urlParams = vendor ? 'api/v1/vendors/login' : 'api/v1/users/login';
    const resp = await axios({
      method: 'post',
      url: `${DOMAIN_URL}/${urlParams}`,
      data: { email, password }
    })
    response = resp.data
  } catch (err: any) {
    response = err.response.data
  }
  delete response?.status
  return response
}