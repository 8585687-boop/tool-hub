import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { compressImage, getOutputFilename, formatSize, calcSaved, ACCEPTED_TYPES, ACCEPTED_EXTENSIONS } from '../../tools/image/imageCompressor'
import JSZip from 'jszip'

const tool = tools.find(t => t.id === 'image-compressor')

export default function ImageCompressor() {
  const [images, setImages] = useState([])
  const [quality, setQuality] = useState(80)
  const [outputFormat, setOutputFormat] = useState('original')
  const [maxWidth, setMaxWidth] = useState('')
  const [maxHeight, setMaxHeight] = useState('')
  const [compressing, setCompressing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const fileInputRef = useRef(null)

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter(f => ACCEPTED_TYPES.includes(f.type))
    if (!validFiles.length) return

    const newImages = validFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      compressed: null,
      compressing: false,
      error: null,
    }))

    setImages(prev => [...prev, ...newImages])
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const removeImage = (id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) {
        URL.revokeObjectURL(img.preview)
        if (img.compressed) URL.revokeObjectURL(img.compressed.url)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const handleClear = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.preview)
      if (img.compressed) URL.revokeObjectURL(img.compressed.url)
    })
    setImages([])
  }

  const compressAll = async () => {
    setCompressing(true)

    const opts = {
      quality: quality / 100,
      outputFormat,
      maxWidth: maxWidth ? parseInt(maxWidth, 10) : undefined,
      maxHeight: maxHeight ? parseInt(maxHeight, 10) : undefined,
    }

    const updated = [...images]

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].compressed) continue
      updated[i] = { ...updated[i], compressing: true, error: null }
      setImages([...updated])

      try {
        const result = await compressImage(updated[i].file, opts)
        const url = URL.createObjectURL(result.blob)
        updated[i] = {
          ...updated[i],
          compressing: false,
          compressed: {
            blob: result.blob,
            url,
            width: result.width,
            height: result.height,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            saved: calcSaved(result.originalSize, result.compressedSize),
            filename: getOutputFilename(updated[i].file.name, outputFormat),
          },
        }
      } catch (err) {
        updated[i] = { ...updated[i], compressing: false, error: err.message }
      }
      setImages([...updated])
    }

    setCompressing(false)
  }

  const downloadImage = (img) => {
    if (!img.compressed) return
    const a = document.createElement('a')
    a.href = img.compressed.url
    a.download = img.compressed.filename
    a.click()
  }

  const downloadAllAsZip = async () => {
    const compressed = images.filter(i => i.compressed)
    if (!compressed.length) return

    const zip = new JSZip()
    for (const img of compressed) {
      zip.file(img.compressed.filename, img.compressed.blob)
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'compressed-images.zip'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const totalOriginal = images.reduce((s, i) => s + (i.compressed?.originalSize || i.file.size), 0)
  const totalCompressed = images.reduce((s, i) => s + (i.compressed?.compressedSize || 0), 0)
  const totalSaved = totalOriginal > 0 ? calcSaved(totalOriginal, totalCompressed) : 0
  const hasCompressed = images.some(i => i.compressed)
  const compressedCount = images.filter(i => i.compressed).length

  return (
    <>
      <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
        <div className="workspace-header">
          <SEO title={tool.seoTitle} description={tool.seoDescription} />
          <div className="workspace-info">
            <Link to="/" className="workspace-back">← Back</Link>
            <span className="workspace-title">Image Compressor</span>
            <span className="workspace-desc">Compress images and reduce file size</span>
            {hasCompressed && (
              <span className="workspace-status valid">Saved {totalSaved}%</span>
            )}
          </div>
          <div className="toolbar">
            <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
          </div>
        </div>

        <div className="workspace-body icomp-body">
          {/* Left: Upload + Preview + Result */}
          <div className="icomp-left">
            {/* Upload / Drop zone */}
            {!images.length ? (
              <div
                className={`icomp-dropzone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div className="icomp-dropzone-text">Drop images here or click to upload</div>
                <div className="icomp-dropzone-hint">JPG, PNG, WEBP</div>
              </div>
            ) : (
              <>
                {/* Original preview */}
                <div className="icomp-card">
                  <div className="icomp-card-head">
                    <span className="icomp-card-title">Original Image</span>
                    <button className="icomp-add-btn" onClick={() => fileInputRef.current?.click()}>+ Add</button>
                  </div>
                  <div className="icomp-preview-area">
                    <img src={images[0].preview} alt="Original" />
                  </div>
                  <div className="icomp-file-info">
                    <span translate="no">{images[0].file.name}</span>
                    <span translate="no">{formatSize(images[0].file.size)}</span>
                  </div>
                </div>

                {/* Batch list */}
                {images.length > 1 && (
                  <div className="icomp-card">
                    <div className="icomp-card-head">
                      <span className="icomp-card-title">All Images ({images.length})</span>
                    </div>
                    <div className="icomp-batch-list">
                      {images.map(img => (
                        <div key={img.id} className={`icomp-batch-item ${img.compressed ? 'done' : ''} ${img.error ? 'error' : ''}`}>
                          <img src={img.compressed?.url || img.preview} alt="" className="icomp-batch-thumb" />
                          <div className="icomp-batch-info">
                            <span className="icomp-batch-name" translate="no">{img.file.name}</span>
                            <span className="icomp-batch-size">
                              {formatSize(img.file.size)}
                              {img.compressed && <> → <strong>{formatSize(img.compressed.compressedSize)}</strong> <span className="icomp-batch-done">Done</span></>}
                              {img.compressing && <span className="icomp-batch-processing">Compressing...</span>}
                              {img.error && <span className="icomp-batch-error">{img.error}</span>}
                            </span>
                          </div>
                          <button className="icomp-batch-remove" onClick={() => removeImage(img.id)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compressed result */}
                {hasCompressed && (
                  <div className="icomp-card icomp-result-card">
                    <div className="icomp-card-head">
                      <span className="icomp-card-title">Compressed Result</span>
                      <span className="icomp-saved-badge">-{totalSaved}%</span>
                    </div>
                    <div className="icomp-preview-area">
                      <img src={images[0].compressed?.url} alt="Compressed" />
                    </div>
                    <div className="icomp-result-stats">
                      <div className="icomp-stat">
                        <span className="icomp-stat-label">Original</span>
                        <span className="icomp-stat-value" translate="no">{formatSize(totalOriginal)}</span>
                      </div>
                      <div className="icomp-stat-arrow">→</div>
                      <div className="icomp-stat">
                        <span className="icomp-stat-label">Compressed</span>
                        <span className="icomp-stat-value green" translate="no">{formatSize(totalCompressed)}</span>
                      </div>
                    </div>
                    <div className="icomp-result-actions">
                      {compressedCount === 1 ? (
                        <button className="icomp-dl-btn" onClick={() => downloadImage(images.find(i => i.compressed))}>
                          Download Image
                        </button>
                      ) : (
                        <>
                          {images.filter(i => i.compressed).map(img => (
                            <button key={img.id} className="icomp-dl-btn sm" onClick={() => downloadImage(img)}>
                              {img.compressed.filename}
                            </button>
                          ))}
                          <button className="icomp-dl-btn outline" onClick={downloadAllAsZip}>
                            Download ZIP
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              multiple
              style={{ display: 'none' }}
              onChange={e => { addFiles(e.target.files); e.target.value = '' }}
            />
          </div>

          {/* Right: Settings */}
          <div className="icomp-right">
            <div className="icomp-card icomp-settings-card">
              <div className="icomp-card-head">
                <span className="icomp-card-title">Compression Settings</span>
              </div>

              <div className="icomp-setting">
                <div className="icomp-setting-head">
                  <label>Quality</label>
                  <span className="icomp-quality-num">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="icomp-slider"
                  style={{ '--slider-pct': `${quality}%` }}
                />
              </div>

              <div className="icomp-setting">
                <label className="icomp-setting-head">Format</label>
                <div className="icomp-format-btns">
                  {['original', 'jpg', 'png', 'webp'].map(fmt => (
                    <button
                      key={fmt}
                      className={`icomp-format-btn ${outputFormat === fmt ? 'active' : ''}`}
                      onClick={() => setOutputFormat(fmt)}
                    >
                      {fmt === 'original' ? 'Original' : fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="icomp-setting">
                <label className="icomp-setting-head">Resize</label>
                <div className="icomp-resize-row">
                  <div className="icomp-resize-field">
                    <span>W</span>
                    <input type="number" min="1" placeholder="Auto" value={maxWidth} onChange={e => setMaxWidth(e.target.value)} />
                  </div>
                  <div className="icomp-resize-field">
                    <span>H</span>
                    <input type="number" min="1" placeholder="Auto" value={maxHeight} onChange={e => setMaxHeight(e.target.value)} />
                  </div>
                </div>
              </div>

              <button
                className="icomp-compress-btn"
                onClick={compressAll}
                disabled={!images.length || compressing}
              >
                {compressing ? 'Compressing...' : 'Compress Image'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!fullscreen && (
        <>
          <Breadcrumb toolId="image-compressor" />
          <ToolGuide toolId="image-compressor" />
          <RelatedTools toolId="image-compressor" />
        </>
      )}
    </>
  )
}
