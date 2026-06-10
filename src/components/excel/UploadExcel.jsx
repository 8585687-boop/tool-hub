import { useCallback } from 'react'

export default function UploadExcel({ onFileLoaded }) {
  const handleFile = useCallback(async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('Unsupported file type. Please upload .xlsx, .xls or .csv files.')
      return
    }
    onFileLoaded(file)
  }, [onFileLoaded])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])

  return (
    <div className="ea-upload">
      <div
        className="ea-dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="ea-dropzone-icon">📊</div>
        <div className="ea-dropzone-text">Drag Excel file here</div>
        <div className="ea-dropzone-sub">or click to browse</div>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleChange}
          className="ea-file-input"
        />
      </div>
      <div className="ea-upload-hint">Supported: .xlsx .xls .csv</div>
    </div>
  )
}
