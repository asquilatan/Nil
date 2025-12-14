export function Toggle({ label, checked, onChange, disabled = false }) {
  const isMinimal = !label;
  return (
    <label class={`toggle-label ${disabled ? 'disabled' : ''} ${isMinimal ? 'minimal' : ''}`}>
      {label && <span class="toggle-text">{label}</span>}

      <div class="toggle-switch-wrapper">
        <input
          type="checkbox"
          class="sr-only"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div class="toggle-track"></div>
        <div class="toggle-thumb"></div>
      </div>
    </label>
  );
}