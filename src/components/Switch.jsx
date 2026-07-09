export default function Switch({ checked, onChange, onLabel = 'ON', offLabel = 'OFF', disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'inline-flex items-center gap-2 font-mono text-2xs select-none',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span className={checked ? 'text-ink' : 'text-ink/35'}>{offLabel}</span>
      <span
        className={[
          'switch-track relative inline-block w-9 h-5 border border-ink/60',
          checked ? 'bg-accent/90' : 'bg-ink/10',
        ].join(' ')}
      >
        <span
          className={[
            'switch-thumb absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-paper border border-ink/70',
            checked ? 'translate-x-4' : 'translate-x-0',
          ].join(' ')}
        />
      </span>
      <span className={checked ? 'text-ink' : 'text-ink/35'}>{onLabel}</span>
    </button>
  )
}
