import type { Movie } from "@/types";

type Props = {
  movies: Movie[];
  selected: string[];
  onChange: (ids: string[]) => void;
  // The movie being edited, left out so it cannot be picked as its own prerequisite
  excludeId?: string;
};

export default function PrerequisitePicker({ movies, selected, onChange, excludeId }: Props) {
  const options = movies.filter((m) => m._id !== excludeId);

  if (options.length === 0) {
    return <p className="text-sm text-zinc-500">No other movies yet.</p>;
  }

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  return (
    <div className="grid max-h-48 gap-1 overflow-y-auto rounded-md border border-white/10 p-2 sm:grid-cols-2">
      {options.map((movie) => (
        <label key={movie._id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-white/5">
          <input
            type="checkbox"
            className="accent-red-600"
            checked={selected.includes(movie._id)}
            onChange={() => toggle(movie._id)}
          />
          {movie.title}
        </label>
      ))}
    </div>
  );
}