import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { markdown } from "@codemirror/lang-markdown";

export const getLanguageExtension = (fileName: string): Extension => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
      return javascript();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "py":
      return python();
    case "md":
    case "mdx":
      return markdown();
    default:
      return [];
  }
};
