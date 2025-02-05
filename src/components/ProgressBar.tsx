interface ProgressBarProps {
  limit: number;
  currentValue: number;
  color?: "green" | "yellow" | "red";
}

export default function ProgressBar({
  limit,
  currentValue,
  color = "green",
}: ProgressBarProps) {
  const percentage = Math.min((currentValue / limit) * 100, 100);

  const colorClasses = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500",
  };

  const glowClasses = {
    green: "shadow-emerald-500/50",
    yellow: "shadow-amber-500/50",
    red: "shadow-rose-500/50",
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{currentValue}</span>
        <span>{limit}</span>
      </div>
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out shadow-lg ${glowClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
