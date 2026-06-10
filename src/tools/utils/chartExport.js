import { toPng, toSvg } from 'html-to-image'
import { jsPDF } from 'jspdf'

export async function downloadPNG(element, filename = 'chart') {
  const dataUrl = await toPng(element, { backgroundColor: '#1e1e2e', pixelRatio: 2 })
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = dataUrl
  link.click()
}

export async function downloadSVG(element, filename = 'chart') {
  const dataUrl = await toSvg(element, { backgroundColor: '#1e1e2e' })
  const link = document.createElement('a')
  link.download = `${filename}.svg`
  link.href = dataUrl
  link.click()
}

export async function downloadPDF(element, filename = 'chart') {
  const dataUrl = await toPng(element, { backgroundColor: '#1e1e2e', pixelRatio: 2 })
  const pdf = new jsPDF('landscape', 'mm', 'a4')
  const imgWidth = 280
  const imgHeight = 160
  pdf.addImage(dataUrl, 'PNG', 8, 8, imgWidth, imgHeight)
  pdf.save(`${filename}.pdf`)
}
