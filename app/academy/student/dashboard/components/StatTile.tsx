function StatTile({
  icon,
  iconBg,
  value,
  label,
  valueColor = "#111",
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: number;
  label: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-xl p-3"
      style={{ background: "#FAFAFA" }}
    >
      <div
        className="flex items-center justify-center rounded-full w-7 h-7"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-[18px] font-bold leading-none"
          style={{ color: valueColor }}
        >
          {value}
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#9CA3AF" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatTile;