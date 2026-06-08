import axios from 'axios'
import { getGSPToken } from '../utils/gspToken.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GSP_BASE_URL = process.env.GSP_BASE_URL || 'https://gsp.adaequare.com'

async function verifyWithGSP(gstin, gspUsername, gspPassword) {
  const res = await axios.post(
    `${GSP_BASE_URL}/gsp/authenticate`,
    { username: gspUsername, password: gspPassword, gstin },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10_000 }
  )
  return (
    res.data?.status === 1 ||
    res.data?.success === true ||
    res.status === 200
  )
}

// POST /api/ewaybill/connect
export const connectGSP = async (req, res) => {
  try {
    const { gspUsername, gspPassword } = req.body
    const businessId = req.user?.businessId

    if (!businessId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' })
    }
    if (!gspUsername || !gspPassword) {
      return res.status(400).json({
        success: false,
        message: 'GSP username and password are required.',
      })
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { gstin: true, name: true },
    })

    if (!business?.gstin) {
      return res.status(400).json({
        success: false,
        message: 'Your business does not have a GSTIN configured. Please update your business profile first.',
      })
    }

    try {
      const verified = await verifyWithGSP(business.gstin, gspUsername, gspPassword)
      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'GSP authentication failed. Please check your username and password.',
        })
      }
    } catch (gspErr) {
      const status = gspErr.response?.status
      if (status === 401 || status === 403) {
        return res.status(401).json({
          success: false,
          message: 'Invalid GSP credentials. Please check your username and password.',
        })
      }
      console.error('GSP auth error:', gspErr.message)
      return res.status(502).json({
        success: false,
        message: 'Could not reach the GSP portal. Please try again later.',
      })
    }

    const credential = await prisma.eway_bill_credentials.upsert({
      where: { business_id: businessId },
      update: {
        gsp_username: gspUsername,
        gsp_password: gspPassword,
        is_active: true,
        last_connected_at: new Date(),
      },
      create: {
        business_id: businessId,
        gsp_username: gspUsername,
        gsp_password: gspPassword,
        is_active: true,
        last_connected_at: new Date(),
      },
    })

    return res.status(200).json({
      success: true,
      message: 'GSP connected successfully.',
      data: {
        businessId: credential.business_id,
        gspUsername: credential.gsp_username,
        isActive: credential.is_active,
        lastConnectedAt: credential.last_connected_at,
      },
    })
  } catch (err) {
    console.error('connectGSP error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

// GET /api/ewaybill/status
export const getConnectionStatus = async (req, res) => {
  try {
    const businessId = req.user?.businessId

    if (!businessId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' })
    }

    const credential = await prisma.eway_bill_credentials.findUnique({
      where: { business_id: businessId },
      select: {
        gsp_username: true,
        is_active: true,           // ✅ snake_case — matches Prisma schema
        last_connected_at: true,
      },
    })

    // ✅ Fixed: was credential.isActive (camelCase) — always undefined → always false
    if (!credential || !credential.is_active) {
      return res.status(200).json({ success: true, connected: false, data: null })
    }

    return res.status(200).json({
      success: true,
      connected: true,
      data: {
        gspUsername: credential.gsp_username,
        lastConnectedAt: credential.last_connected_at,
      },
    })
  } catch (err) {
    console.error('getConnectionStatus error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

// DELETE /api/ewaybill/disconnect
export const disconnectGSP = async (req, res) => {
  try {
    const businessId = req.user?.businessId

    if (!businessId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' })
    }

    await prisma.eway_bill_credentials.updateMany({
      where: { business_id: businessId },
      data: { is_active: false },
    })

    return res.status(200).json({ success: true, message: 'GSP disconnected successfully.' })
  } catch (err) {
    console.error('disconnectGSP error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

// GET /api/ewaybill  — list all e-way bills for the logged-in business
export const listEWayBills = async (req, res) => {
  try {
    const businessId = req.user?.businessId

    if (!businessId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' })
    }

    const bills = await prisma.eway_bill.findMany({
      where: { business_id: businessId },
      orderBy: { ewb_date: 'desc' },
      select: {
        id: true,
        ewb_no: true,
        ewb_date: true,
        valid_upto: true,
        doc_no: true,
        doc_date: true,
        from_gstin: true,
        to_gstin: true,
        total_value: true,
        status: true,
      },
    })

    return res.status(200).json({ success: true, data: bills })
  } catch (err) {
    console.error('listEWayBills error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}

// POST /api/ewaybill/generate
export const generateEWayBill = async (req, res) => {
  try {
    const businessId = req.user?.businessId
    if (!businessId) return res.status(401).json({ success: false, message: 'Unauthorized.' })

    const [credential, business] = await Promise.all([
      prisma.eway_bill_credentials.findUnique({ where: { business_id: businessId } }),
      prisma.business.findUnique({ where: { id: businessId }, select: { gstin: true } }),
    ])

    if (!credential?.is_active) {
      return res.status(400).json({ success: false, message: 'GSP not connected. Please connect first.' })
    }

    const authToken = await getGSPToken(
      businessId,
      credential.gsp_username,
      credential.gsp_password,
      business.gstin
    )

    const {
      supplyType, subSupplyType, docType, docNo, docDate,
      fromGstin, fromTrdName, fromAddr1, fromAddr2, fromPlace, fromPincode, fromStateCode,
      toGstin, toTrdName, toAddr1, toAddr2, toPlace, toPincode, toStateCode,
      totalValue, cgstValue, sgstValue, igstValue, cessValue,
      transMode, transDistance, transporterName, transporterId, transDocNo, transDocDate,
      vehicleNo, vehicleType,
      itemList,
    } = req.body

    const payload = {
      supplyType, subSupplyType, docType, docNo, docDate,
      fromGstin, fromTrdName, fromAddr1, fromAddr2, fromPlace,
      fromPincode, fromStateCode,
      toGstin, toTrdName, toAddr1, toAddr2, toPlace,
      toPincode, toStateCode,
      totalValue, cgstValue, sgstValue, igstValue, cessValue,
      transMode, transDistance, transporterName, transporterId,
      transDocNo, transDocDate, vehicleNo, vehicleType,
      itemList,
    }

    const gspRes = await axios.post(
      `${GSP_BASE_URL}/enriched/ewb/ewayapi?action=GENEWAYBILL`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'gstin': business.gstin,
          'authtoken': authToken,
        },
      }
    )

    const result = gspRes.data

    if (result.status_cd !== '1') {
      return res.status(400).json({
        success: false,
        message: result.status_desc || 'E-way Bill generation failed.',
        errors: result.error,
      })
    }

    const ewayBill = await prisma.eway_bill.create({
      data: {
        business_id:  businessId,
        ewb_no:       String(result.ewayBillNo),
        ewb_date:     new Date(result.ewayBillDate),
        valid_upto:   new Date(result.validUpto),
        doc_no:       docNo,
        doc_date:     new Date(docDate),
        from_gstin:   fromGstin,
        to_gstin:     toGstin,
        total_value:  totalValue,
        status:       'ACTIVE',
        raw_response: result,
      },
    })

    return res.status(200).json({ success: true, data: ewayBill })
  } catch (err) {
    console.error('generateEWayBill error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}