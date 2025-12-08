export function SegmentedControl({ options, value, onChange, disabled = false }) {
    return (
        <div class={`segmented-control ${disabled ? 'disabled' : ''}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    class={`segment-btn ${value === option.value ? 'active' : ''}`}
                    onClick={() => !disabled && onChange(option.value)}
                    disabled={disabled}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
