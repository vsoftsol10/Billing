import React, { useState } from 'react'

const OnlineStoreQR = ({ storeUrl = '' }) => {
  const [copied, setCopied] = useState(false)

  const qrSrc = storeUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mystore.vbill.in`

  const handleCopy = () => {
    const value = storeUrl || 'https://mystore.vbill.in'
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* QR Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center mb-4">
        <p className="text-base font-semibold text-gray-800 mb-5">Scan to view store</p>

        <div className="border border-gray-200 rounded-lg p-3 mb-5 bg-white">
          <img
            src={qrSrc}
            alt="Store QR Code"
            className="w-48 h-48 object-contain"
          />
        </div>

        <p className="text-sm text-gray-500 text-center leading-relaxed">
          Scan this QR code to browse products and place orders
        </p>
      </div>

      {/* URL Copy Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={storeUrl || 'https://mystore.vbill.in'}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 cursor-default"
        />
        <button
          onClick={handleCopy}
          title="Copy link"
          className={`p-2 rounded-lg border transition-colors ${
            copied
              ? 'border-green-300 bg-green-50 text-green-600'
              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
        >
          {copied ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default OnlineStoreQR