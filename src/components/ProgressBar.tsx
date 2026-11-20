type Props = {
  watched: number;
  total: number;
};

export default function ProgressBar({ watched, total }: Props) {
  const percent = total === 0 ? 100 : Math.round((watched / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-medium">
        <span>
          {watched} of {total} watched
        </span>
        <span>{percent}%</span>
      </div>

      <div
        role="progressbar"
        aria-label="Rewatch progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={watched}
        className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200"
      >
        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}