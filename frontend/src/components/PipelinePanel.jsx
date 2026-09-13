import StepCard from './StepCard.jsx'

const STEPS = [
  { key: 'search', num: '01', title: 'Search Agent', desc: 'Gathers recent web information' },
  { key: 'reader', num: '02', title: 'Reader Agent', desc: 'Scrapes & extracts deep content' },
  { key: 'writer', num: '03', title: 'Writer Chain', desc: 'Drafts the full research report' },
  { key: 'critic', num: '04', title: 'Critic Chain', desc: 'Reviews & scores the report' },
]

// activeIndex: index of the currently running step (-1 if idle, STEPS.length if all done)
export default function PipelinePanel({ activeIndex, done }) {
  const statusFor = (index) => {
    if (done) return 'done'
    if (activeIndex < 0) return 'waiting'
    if (index < activeIndex) return 'done'
    if (index === activeIndex) return 'running'
    return 'waiting'
  }

  return (
    <div>
      <div className="section-heading">Pipeline</div>
      {STEPS.map((step, i) => (
        <StepCard
          key={step.key}
          num={step.num}
          title={step.title}
          desc={step.desc}
          status={statusFor(i)}
        />
      ))}
    </div>
  )
}
