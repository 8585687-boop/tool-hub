import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'qr-generator')
const HISTORY_KEY = 'qr-generator-history'
const MAX_HISTORY = 20

function getWifiValue(ssid, password, encryption) {
  return `WIFI:T:${encryption};S:${ssid};P:${password};;`
}

export default function QRGenerator() {
  const { t } = useTranslation()
  const [qrType, setQrType] = useState('url')
  const [urlValue, setUrlValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiEncryption, setWifiEncryption] = useState('WPA')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [logoSrc, setLogoSrc] = useState(null)
  const [logoSize, setLogoSize] = useState(48)
  const [fullscreen, setFullscreen] = useState(false)
  const [history, setHistory] = useState([])
  const [showSvg, setShowSvg] = useState(false)
  const canvasRef = useRef(null)
  const svgRef = useRef(null)
  const logoInputRef = useRef(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  const qrValue = (() => {
    switch (qrType) {
      case 'url': return urlValue
      case 'text': return textValue
      case 'email': return emailValue ? `mailto:${emailValue}` : ''
      case 'phone': return phoneValue ? `tel:${phoneValue}` : ''
      case 'wifi': return (wifiSsid || wifiPassword) ? getWifiValue(wifiSsid, wifiPassword, wifiEncryption) : ''
      default: return ''
    }
  })()

  const saveHistory = useCallback((value, type) => {
    if (!value) return
    setHistory(prev => {
      const entry = { value, type, time: Date.now() }
      const next = [entry, ...prev.filter(h => h.value !== value)].slice(0, MAX_HISTORY)
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    if (qrValue) {
      const timer = setTimeout(() => saveHistory(qrValue, qrType), 1000)
      return () => clearTimeout(timer)
    }
  }, [qrValue, qrType, saveHistory])

  const handleClear = () => {
    setUrlValue('')
    setTextValue('')
    setEmailValue('')
    setPhoneValue('')
    setWifiSsid('')
    setWifiPassword('')
    setWifiEncryption('WPA')
    setFgColor('#000000')
    setBgColor('#ffffff')
    setLogoSrc(null)
    setSize(256)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoSrc(ev.target.result)
      setLogoSize(Math.round(size * 0.2))
    }
    reader.readAsDataURL(file)
  }

  const handleCopy = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          try {
            navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          } catch {}
        }
      })
    }
  }

  const downloadPng = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const downloadSvg = () => {
    const svgEl = svgRef.current
    if (!svgEl) return
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const clearHistory = () => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
  }

  const loadFromHistory = (entry) => {
    setQrType(entry.type)
    switch (entry.type) {
      case 'url': setUrlValue(entry.value); break
      case 'text': setTextValue(entry.value); break
      case 'email': setEmailValue(entry.value.replace('mailto:', '')); break
      case 'phone': setPhoneValue(entry.value.replace('tel:', '')); break
      case 'wifi':
        const m = entry.value.match(/S:([^;]*);P:([^;]*);T:([^;]*);/)
        if (m) { setWifiSsid(m[1]); setWifiPassword(m[2]); setWifiEncryption(m[3]); }
        break
    }
  }

  const imageSettings = logoSrc ? {
    src: logoSrc,
    height: logoSize,
    width: logoSize,
    excavate: true,
  } : undefined

  const typeOptions = [
    { key: 'url', label: t('qrUrl') },
    { key: 'text', label: t('qrText') },
    { key: 'email', label: t('qrEmail') },
    { key: 'phone', label: t('qrPhone') },
    { key: 'wifi', label: t('qrWifi') },
  ]

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <SEO title={tool.seoTitle} description={tool.seoDescription} />
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">{t('tools.qrGenerator')}</span>
          <span className="workspace-desc">{t('toolDesc.qrGenerator')}</span>
        </div>
        <Toolbar
          copyText={qrValue}
          onCopy={handleCopy}
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">{t('qrContent')}</span>
          </div>
          <div className="panel-body">
            <div className="qr-options">
              <div className="qr-type-tabs">
                {typeOptions.map(opt => (
                  <button
                    key={opt.key}
                    className={`qr-type-tab ${qrType === opt.key ? 'active' : ''}`}
                    onClick={() => setQrType(opt.key)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {qrType === 'url' && (
                <input
                  type="url"
                  className="qr-input"
                  placeholder={t('qrUrlPlaceholder')}
                  value={urlValue}
                  onChange={e => setUrlValue(e.target.value)}
                />
              )}
              {qrType === 'text' && (
                <textarea
                  className="qr-textarea"
                  placeholder={t('qrTextPlaceholder')}
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  rows={4}
                />
              )}
              {qrType === 'email' && (
                <input
                  type="email"
                  className="qr-input"
                  placeholder={t('qrEmailPlaceholder')}
                  value={emailValue}
                  onChange={e => setEmailValue(e.target.value)}
                />
              )}
              {qrType === 'phone' && (
                <input
                  type="tel"
                  className="qr-input"
                  placeholder={t('qrPhonePlaceholder')}
                  value={phoneValue}
                  onChange={e => setPhoneValue(e.target.value)}
                />
              )}
              {qrType === 'wifi' && (
                <div className="qr-wifi-fields">
                  <input
                    type="text"
                    className="qr-input"
                    placeholder={t('qrWifiSsid')}
                    value={wifiSsid}
                    onChange={e => setWifiSsid(e.target.value)}
                  />
                  <input
                    type="text"
                    className="qr-input"
                    placeholder={t('qrWifiPassword')}
                    value={wifiPassword}
                    onChange={e => setWifiPassword(e.target.value)}
                  />
                  <select
                    className="qr-select"
                    value={wifiEncryption}
                    onChange={e => setWifiEncryption(e.target.value)}
                  >
                    <option value="WPA">{t('qrWifiWpa')}</option>
                    <option value="WEP">{t('qrWifiWep')}</option>
                    <option value="nopass">{t('qrWifiNone')}</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">{t('qrCustomize')}</span>
          </div>
          <div className="panel-body">
            <div className="qr-options">
              <div className="qr-option-row">
                <label>{t('qrSize')}: {size}px</label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="16"
                  value={size}
                  onChange={e => setSize(parseInt(e.target.value))}
                />
              </div>
              <div className="qr-option-row">
                <label>{t('qrFgColor')}</label>
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} />
              </div>
              <div className="qr-option-row">
                <label>{t('qrBgColor')}</label>
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
              </div>
              <div className="qr-option-row">
                <label>{t('qrLogo')}</label>
                <div className="qr-logo-actions">
                  <button className="btn btn-sm" onClick={() => logoInputRef.current?.click()}>
                    {t('qrUploadLogo')}
                  </button>
                  {logoSrc && (
                    <button className="btn btn-sm btn-secondary" onClick={() => setLogoSrc(null)}>
                      {t('qrRemoveLogo')}
                    </button>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <span className="panel-label">{t('qrPreview')}</span>
          </div>
          <div className="panel-body qr-preview-body">
            {qrValue ? (
              <div className="qr-preview-container">
                <div ref={canvasRef} style={{ display: showSvg ? 'none' : 'inline-block' }}>
                  <QRCodeCanvas
                    value={qrValue}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    imageSettings={imageSettings}
                  />
                </div>
                <div style={{ display: showSvg ? 'inline-block' : 'none' }}>
                  <QRCodeSVG
                    ref={svgRef}
                    value={qrValue}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    imageSettings={imageSettings}
                  />
                </div>
                <div className="qr-download-btns">
                  <button className="btn" onClick={downloadPng}>{t('qrDownloadPng')}</button>
                  <button className="btn" onClick={() => { setShowSvg(true); setTimeout(downloadSvg, 50); }}>{t('qrDownloadSvg')}</button>
                </div>
              </div>
            ) : (
              <div className="editor-output-placeholder">{t('qrGenerateFirst')}</div>
            )}
          </div>
        </div>

        <div className="workspace-panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <span className="panel-label">{t('qrHistory')}</span>
            {history.length > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={clearHistory}>{t('qrClearHistory')}</button>
            )}
          </div>
          <div className="panel-body">
            {history.length === 0 ? (
              <div className="editor-output-placeholder">{t('qrHistoryEmpty')}</div>
            ) : (
              <div className="qr-history-list">
                {history.map((entry, i) => (
                  <div key={i} className="qr-history-item" onClick={() => loadFromHistory(entry)}>
                    <span className="qr-history-type">{entry.type.toUpperCase()}</span>
                    <span className="qr-history-value">{entry.value.length > 50 ? entry.value.slice(0, 50) + '...' : entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {!fullscreen && (
      <>
        <Breadcrumb toolId="qr-generator" />
        <ToolGuide toolId="qr-generator" />
        <RelatedTools toolId="qr-generator" />
      </>
    )}
    </>
  )
}
