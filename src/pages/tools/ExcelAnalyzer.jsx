import { useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { parseExcelFile, analyzeColumns } from '../../tools/utils/excelParser'
import { aggregateData } from '../../tools/utils/dataAnalyzer'
import { downloadPNG, downloadSVG, downloadPDF } from '../../tools/utils/chartExport'
import UploadExcel from '../../components/excel/UploadExcel'
import DatasetInfo from '../../components/excel/DatasetInfo'
import ColumnSelector from '../../components/excel/ColumnSelector'
import ChartBuilder from '../../components/excel/ChartBuilder'
import ChartPreview from '../../components/excel/ChartPreview'
import DataSummary from '../../components/excel/DataSummary'

const tool = tools.find(t => t.id === 'excel-analyzer')

export default function ExcelAnalyzer() {
  const chartRef = useRef(null)

  const [fileInfo, setFileInfo] = useState(null)
  const [sheetData, setSheetData] = useState([])
  const [columns, setColumns] = useState([])
  const [currentSheet, setCurrentSheet] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [config, setConfig] = useState({
    xField: '',
    yFields: [],
    chartType: 'Bar',
    method: 'sum'
  })

  const chartData = useMemo(() => {
    if (!config.xField || !config.yFields?.length || sheetData.length === 0) return []
    return aggregateData(sheetData, config)
  }, [sheetData, config])

  const handleFileLoaded = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const result = await parseExcelFile(file)
      setFileInfo(result)
      const sheetName = result.sheetNames[0]
      setCurrentSheet(sheetName)
      const data = result.sheets[0].data
      setSheetData(data)
      setColumns(analyzeColumns(data))
      setConfig({ xField: '', yFields: [], chartType: 'Bar', method: 'sum' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSheetChange = (sheetName) => {
    setCurrentSheet(sheetName)
    const sheet = fileInfo.sheets.find(s => s.name === sheetName)
    if (sheet) {
      setSheetData(sheet.data)
      setColumns(analyzeColumns(sheet.data))
      setConfig({ xField: '', yFields: [], chartType: 'Bar', method: 'sum' })
    }
  }

  const handleToggleColumn = (colName) => {
    setColumns(prev => prev.map(c =>
      c.name === colName ? { ...c, selected: !c.selected } : c
    ))
  }

  const handleReset = () => {
    setFileInfo(null)
    setSheetData([])
    setColumns([])
    setCurrentSheet('')
    setError(null)
    setConfig({ xField: '', yFields: [], chartType: 'Bar', method: 'sum' })
  }

  return (
    <>
    <div className="workspace">
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <div className="workspace-title-row">
            <Link to="/" className="workspace-back">← Back</Link>
            <h1 className="workspace-title">Excel Data Analyzer</h1>
            {fileInfo && <button className="ea-reset-btn" onClick={handleReset}>Reset</button>}
          </div>
          <p className="workspace-desc">Upload Excel and visualize your data</p>
        </div>
      </div>

      {!fileInfo ? (
        <div className="ea-upload-area">
          {loading && <div className="ea-loading">Parsing file...</div>}
          {error && <div className="ea-error">{error}</div>}
          <UploadExcel onFileLoaded={handleFileLoaded} />
        </div>
      ) : (
        <div className="ea-main">
          <div className="ea-left-panel">
            <DatasetInfo
              fileName={fileInfo.fileName}
              rows={sheetData.length}
              columns={columns.length}
              sheets={fileInfo.sheetNames}
              currentSheet={currentSheet}
              onSheetChange={handleSheetChange}
            />
            <ColumnSelector columns={columns} onToggle={handleToggleColumn} />
            <ChartBuilder columns={columns} config={config} onChange={setConfig} />
          </div>
          <div className="ea-right-panel">
            <div className="ea-chart-header">
              <span className="ea-chart-title">Chart Preview</span>
              <div className="ea-download-btns">
                <button onClick={() => downloadPNG(chartRef.current, 'chart')}>PNG</button>
                <button onClick={() => downloadSVG(chartRef.current, 'chart')}>SVG</button>
                <button onClick={() => downloadPDF(chartRef.current, 'chart')}>PDF</button>
              </div>
            </div>
            <ChartPreview data={chartData} config={config} chartRef={chartRef} />
            <DataSummary data={sheetData} columns={columns} />
          </div>
        </div>
      )}
    </div>
      <Breadcrumb toolId="excel-analyzer" />
      <ToolGuide toolId="excel-analyzer" />
      <RelatedTools toolId="excel-analyzer" />
    </>
  )
}
