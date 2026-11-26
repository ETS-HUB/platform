import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function TextBlock({ content }: { content: string }) {
  return (
    <div className="text-base leading-relaxed text-gray-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: (p) => (
            <h2
              className="text-2xl font-noto font-medium mt-5 mb-2 first:mt-0 text-[#0e1430]"
              {...p}
            />
          ),
          h3: (p) => (
            <h3
              className="text-lg font-noto font-medium mt-4 mb-2 text-[#0e1430]"
              {...p}
            />
          ),
          p: (p) => <p className="mb-3" {...p} />,
          ul: (p) => (
            <ul className="list-disc pl-5 mb-3 flex flex-col gap-1" {...p} />
          ),
          ol: (p) => (
            <ol className="list-decimal pl-5 mb-3 flex flex-col gap-1" {...p} />
          ),
          code: (p) => (
            <code
              className="text-base px-1.5 py-0.5 rounded"
              style={{ background: "#F5EEFE", color: "#7408B3" }}
              {...p}
            />
          ),
          pre: (p) => (
            <pre
              className="text-base p-5 rounded-lg overflow-x-auto mb-3"
              style={{ background: "#0e1430", color: "#E5E7EB" }}
              {...p}
            />
          ),
          table: (p) => (
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-base border-collapse" {...p} />
            </div>
          ),
          th: (p) => (
            <th
              className="text-left px-3 py-2 font-semibold"
              style={{ background: "#F5EEFE", color: "#3A0CA3" }}
              {...p}
            />
          ),
          td: (p) => (
            <td
              className="px-3 py-2 border-t"
              style={{ borderColor: "#E5E7EB" }}
              {...p}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
