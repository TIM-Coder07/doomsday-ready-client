type Props = {
  watched: number;
  total: number;
};

export default function ProgressBar({ watched, total }: Props) {
  const percent = total === 0 ? 100 : Math.round((watched / total) * 100);

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium">
          {watched} of {total} watched
        </span>
        <span className="text-zinc-400">{percent}%</span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={watched}
        aria-label={`${watched} of ${total} watched`}
      >
        <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}