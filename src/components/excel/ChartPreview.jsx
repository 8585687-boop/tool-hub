import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#89b4fa', '#a6e3a1', '#f9e2af', '#fab387', '#f38ba8', '#cba6f7', '#94e2d5', '#74c7ec']

export default function ChartPreview({ data, config, chartRef }) {
  if (!data || data.length === 0 || !config.xField || !config.yFields?.length) {
    return (
      <div className="ea-chart-empty">
        <div className="ea-chart-empty-icon">📈</div>
        <div>Select X/Y axes to preview chart</div>
      </div>
    )
  }

  const { xField, yFields, chartType } = config

  const renderChart = () => {
    switch (chartType) {
      case 'Bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
              <XAxis dataKey={xField} stroke="#a6adc8" fontSize={12} />
              <YAxis stroke="#a6adc8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
              <Legend />
              {yFields.map((yf, i) => (
                <Bar key={yf} dataKey={yf} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      case 'Line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
              <XAxis dataKey={xField} stroke="#a6adc8" fontSize={12} />
              <YAxis stroke="#a6adc8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
              <Legend />
              {yFields.map((yf, i) => (
                <Line key={yf} type="monotone" dataKey={yf} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      case 'Pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={data} dataKey={yFields[0]} nameKey={xField} cx="50%" cy="50%" outerRadius={150} label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'Area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
              <XAxis dataKey={xField} stroke="#a6adc8" fontSize={12} />
              <YAxis stroke="#a6adc8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
              <Legend />
              {yFields.map((yf, i) => (
                <Area key={yf} type="monotone" dataKey={yf} fill={COLORS[i % COLORS.length]} stroke={COLORS[i % COLORS.length]} fillOpacity={0.3} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )
      case 'Scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#45475a" />
              <XAxis dataKey={xField} name={xField} stroke="#a6adc8" fontSize={12} />
              <YAxis dataKey={yFields[0]} name={yFields[0]} stroke="#a6adc8" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
              <Scatter data={data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        )
      case 'Radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={data} cx="50%" cy="50%" outerRadius={150}>
              <PolarGrid stroke="#45475a" />
              <PolarAngleAxis dataKey={xField} stroke="#a6adc8" fontSize={12} />
              <PolarRadiusAxis stroke="#a6adc8" fontSize={12} />
              {yFields.map((yf, i) => (
                <Radar key={yf} name={yf} dataKey={yf} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.3} />
              ))}
              <Legend />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #45475a', borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="ea-chart-preview" ref={chartRef}>
      {renderChart()}
    </div>
  )
}
