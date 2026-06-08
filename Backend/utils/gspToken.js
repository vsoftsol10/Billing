// utils/gspToken.js
import axios from 'axios'

const GSP_BASE_URL = process.env.GSP_BASE_URL || 'https://gsp.adaequare.com'

let tokenCache = {} // { [businessId]: { token, expiresAt } }

export async function getGSPToken(businessId, gspUsername, gspPassword, gstin) {
  const cached = tokenCache[businessId]
  if (cached && cached.expiresAt > Date.now()) return cached.token

  const res = await axios.post(
    `${GSP_BASE_URL}/gsp/authenticate`,
    { username: gspUsername, password: gspPassword, gstin },
    { headers: { 'Content-Type': 'application/json' } }
  )

  const token = res.data.authtoken
  tokenCache[businessId] = {
    token,
    expiresAt: Date.now() + 6 * 60 * 60 * 1000 - 60_000, // 6h minus 1min buffer
  }
  return token
}