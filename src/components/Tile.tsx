interface TileProps {
  letter: string;
  points: number;
  variant?: "default" | "active" | "wild" | "blank";
  size?: "sm" | "md" | "lg";
  badge?: string;
}

export default function Tile({
  letter,
  points,
  variant = "default",
  size = "md",
  badge,
}: TileProps) {
  const sizeClasses = {
    sm: "h-10 w-9",
    md: "h-10 w-10",
    lg: "h-24 w-20",
  };

  const variantClasses = {
    default:
      "border-[rgba(69,70,85,0.5)] bg-bg-tile text-text-primary shadow-[0_1px_1px_rgba(0,0,0,0.05)]",
    active:
      "border-2 border-accent-indigo-light bg-accent-indigo-bg text-accent-indigo-light shadow-[0_0_15px_rgba(88,101,242,0.2)]",
    wild:
      "border-[rgba(221,199,63,0.5)] bg-[rgba(192,172,35,0.1)] text-accent-yellow shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
    blank:
      "border-dashed border-border-default bg-bg-input text-accent-yellow",
  };

  const pointsColor = {
    default: "text-text-secondary",
    active: "text-accent-indigo-light",
    wild: "text-[rgba(221,199,63,0.7)]",
    blank: "text-[rgba(221,199,63,0.5)]",
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-sm border font-mono ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <span
        className={`font-bold ${
          size === "lg" ? "text-lg" : "text-lg"
        }`}
      >
        {letter}
      </span>
      <span
        className={`absolute text-[11px] font-medium tracking-[0.55px] ${pointsColor[variant]} ${
          size === "lg" ? "bottom-1 right-1" : "bottom-0.5 right-0.5"
        }`}
      >
        {points}
      </span>

      {/* Wild star icon */}
      {variant === "wild" && (
        <span className="absolute left-1 top-1 text-[8px] text-accent-yellow">
          ✦
        </span>
      )}

      {/* Badge (e.g. "NEW") */}
      {badge && (
        <span className="absolute -right-2 -top-2 rounded-sm bg-accent-indigo-light px-1 text-[11px] font-bold uppercase tracking-[0.88px] text-[#000da4] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          {badge}
        </span>
      )}
    </div>
  );
}
