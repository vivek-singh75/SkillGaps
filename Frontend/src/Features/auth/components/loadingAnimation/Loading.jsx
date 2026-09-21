import "./Loading.scss";

const DOT_COUNT = 24;

export default function Loading({ label = "LOADING", size = 260 }) {
  return (
    <div
      className="loader"
      style={{ "--loader-size": `${size}px` }}
      role="status"
      aria-live="polite"
    >
      <div className="loader__ring">
        {Array.from({ length: DOT_COUNT }, (_, i) => (
          <span key={i} className={`loader__dot loader__dot--${i + 1}`} />
        ))}
      </div>
      <span className="loader__label">{label}</span>
    </div>
  );
}