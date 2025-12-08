export function Card({ children, title, className = '' }) {
    return (
        <div class={`card ${className}`}>
            {title && (
                <div class="card-header">
                    <h3 class="card-title">{title}</h3>
                </div>
            )}
            <div class="card-content">
                {children}
            </div>
        </div>
    );
}