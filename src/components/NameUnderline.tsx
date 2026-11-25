/** Мягкая каллиграфическая черта под именами — не прямоугольник */
export function NameUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`name-underline ${className}`}
      viewBox="0 0 96 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="name-underline-fade"
          x1="0"
          y1="0"
          x2="96"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c97b8a" stopOpacity="0" />
          <stop offset="35%" stopColor="#c97b8a" stopOpacity="0.95" />
          <stop offset="65%" stopColor="#c97b8a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c97b8a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 3.2C18 4.8 34 5 48 3.8C62 2.6 78 1.6 94 2.8"
        stroke="url(#name-underline-fade)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
