import { Button } from "@/components";

export function SessionCountPicker({
  maxAvailable,
  onStart,
}: {
  maxAvailable: number;
  onStart: (count: number) => void;
}) {
  const options = [5, 10, 15].filter((n) => n <= maxAvailable);
  if (options.length === 0 || !options.includes(maxAvailable)) {
    options.push(maxAvailable);
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#F5EEFE", border: "1.5px solid #DDC9F0" }}
    >
      <h3 className="text-base font-semibold mb-1 text-[#0e1430]">
        Start a practice session
      </h3>
      <p className="text-sm mb-4 text-gray-600">
        Choose how many questions — {maxAvailable} available in total.
      </p>
      <div className="flex items-center gap-2">
        {options.map((n) => (
          <Button fullWidth size="md" variant="outline" key={n} type="button" onClick={() => onStart(n)}>
            {n === maxAvailable ? `All ${n}` : n}
          </Button>
        ))}
      </div>
    </div>
  );
}
