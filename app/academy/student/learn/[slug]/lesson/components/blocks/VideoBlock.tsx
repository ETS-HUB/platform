function toEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function VideoBlock({
  content,
  overview,
  metadata,
}: {
  content: string;
  overview?: string | null;
  metadata?: { duration?: string };
}) {
  return (
    <div>
      <div
        className="rounded-xl overflow-hidden mb-3"
        style={{ aspectRatio: "16/9", background: "#0e1430" }}
      >
        <iframe
          src={toEmbedUrl(content)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex items-center gap-2">
        {metadata?.duration && (
          <span className="text-base font-semibold px-2 py-0.5 rounded-full bg-[#F5EEFE] text-[#3A0CA3]">
            {metadata.duration}
          </span>
        )}
      </div>
      {overview && (
        <p className="text-base font-noto mt-2" style={{ color: "#6B7280" }}>
          {overview}
        </p>
      )}
    </div>
  );
}
