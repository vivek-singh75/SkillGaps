import "./AnimatedButton.scss";

function AnimatedButton({
    children,
    loading = false,
    className = "",
    disabled = false,
    ...props
}) {
    return (
        <button
            className={`animated-btn ${loading ? "is-loading" : ""} ${className}`}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            <span className="button-content">
                {children}
            </span>

            {loading && <span className="loader-cube" />}
        </button>
    );
}

export default AnimatedButton;