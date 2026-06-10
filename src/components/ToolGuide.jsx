import { tools } from '../data/tools'

export default function ToolGuide({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  if (!tool) return null

  const { intro, steps, features, example, faq } = tool

  if (!intro && !steps?.length && !features?.length && !example && !faq?.length) return null

  return (
    <div className="tool-guide">
      {intro && (
        <div className="guide-card">
          <div className="guide-card-title">About {tool.name}</div>
          <div className="guide-card-text">{intro}</div>
        </div>
      )}

      {steps?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">How To Use</div>
          <ol className="guide-steps">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {features?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">Features</div>
          <ul className="guide-features">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {example && (
        <div className="guide-card">
          <div className="guide-card-title">Example</div>
          <div className="guide-example">
            {example.input && (
              <div className="guide-example-block">
                <div className="guide-example-label">Input</div>
                <pre className="guide-example-code">{example.input}</pre>
              </div>
            )}
            {example.output && (
              <div className="guide-example-block">
                <div className="guide-example-label">Output</div>
                <pre className="guide-example-code">{example.output}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {faq?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">FAQ</div>
          <div className="guide-faq">
            {faq.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question">{item.question}</div>
                <div className="faq-answer">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
