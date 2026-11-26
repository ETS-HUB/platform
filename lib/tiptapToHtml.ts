/**
 * Convert TipTap JSON format to HTML
 * Used for rendering roadmap question descriptions and other rich text content
 */

interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

interface TipTapNode {
  type: string;
  text?: string;
  marks?: TipTapMark[];
  content?: TipTapNode[];
  attrs?: Record<string, any>;
}

function applyMarks(text: string, marks?: TipTapMark[]): string {
  if (!marks || marks.length === 0) return text;

  let result = text;

  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = `<strong>${result}</strong>`;
        break;
      case "italic":
        result = `<em>${result}</em>`;
        break;
      case "code":
        result = `<code>${result}</code>`;
        break;
      case "link":
        const href = mark.attrs?.href || "#";
        const target = mark.attrs?.target || "_blank";
        const rel = mark.attrs?.rel || "noopener noreferrer";
        result = `<a href="${href}" target="${target}" rel="${rel}" style="color: #3A0CA3; text-decoration: underline; font-weight: 500;" onmouseover="this.style.color='#2B0879'" onmouseout="this.style.color='#3A0CA3'">${result}</a>`;
        break;
      case "strike":
        result = `<s>${result}</s>`;
        break;
      default:
        // Unknown mark type, leave as is
        break;
    }
  }

  return result;
}

function nodeToHtml(node: TipTapNode): string {
  switch (node.type) {
    case "paragraph":
      const pContent = node.content?.map(nodeToHtml).join("") || "";
      // Skip empty paragraphs to avoid excessive spacing
      if (!pContent.trim()) return "";
      return `<p style="margin-bottom: 1rem; line-height: 1.7; color: #374151;">${pContent}</p>`;

    case "heading":
      const level = node.attrs?.level || 1;
      const hContent = node.content?.map(nodeToHtml).join("") || "";
      const headingStyles =
        level === 1
          ? "font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem; color: #111827;"
          : level === 2
            ? "font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.25rem; color: #111827;"
            : "font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #111827;";
      return `<h${level} style="${headingStyles}">${hContent}</h${level}>`;

    case "text":
      return applyMarks(node.text || "", node.marks);

    case "bulletList":
      const ulContent = node.content?.map(nodeToHtml).join("") || "";
      return `<ul style="list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #374151;">${ulContent}</ul>`;

    case "orderedList":
      const olContent = node.content?.map(nodeToHtml).join("") || "";
      return `<ol style="list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #374151;">${olContent}</ol>`;

    case "listItem":
      const liContent = node.content?.map(nodeToHtml).join("") || "";
      return `<li style="margin-bottom: 0.25rem; line-height: 1.6;">${liContent}</li>`;

    case "codeBlock":
      const code = node.content?.map((n) => n.text || "").join("") || "";
      return `<pre style="background-color: #F3F4F6; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; overflow-x: auto; font-family: monospace; font-size: 0.875rem;"><code>${code}</code></pre>`;

    case "blockquote":
      const bqContent = node.content?.map(nodeToHtml).join("") || "";
      return `<blockquote style="border-left: 4px solid #7408B3; padding-left: 1rem; font-style: italic; margin: 1rem 0; color: #6B7280;">${bqContent}</blockquote>`;

    case "hardBreak":
      return "<br/>";

    case "horizontalRule":
      return '<hr style="margin: 1.5rem 0; border-color: #D1D5DB;"/>';

    default:
      // Unknown node type, try to render content if it exists
      if (node.content) {
        return node.content.map(nodeToHtml).join("");
      }
      return "";
  }
}

export function tiptapToHtml(tiptapJson: any): string {
  if (!tiptapJson) return "";

  // Handle both single node and array of nodes
  if (Array.isArray(tiptapJson)) {
    return tiptapJson.map(nodeToHtml).join("");
  }

  // Handle object with content array
  if (tiptapJson.content && Array.isArray(tiptapJson.content)) {
    return tiptapJson.content.map(nodeToHtml).join("");
  }

  // Handle single node
  return nodeToHtml(tiptapJson);
}
