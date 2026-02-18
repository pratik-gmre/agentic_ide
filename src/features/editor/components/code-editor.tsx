import { useEffect, useMemo, useRef } from "react";
import { EditorView, keymap } from "@codemirror/view";

import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { indentWithTab } from "@codemirror/commands";
import { Minimap } from "../extensions/minimap";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { customSetup } from "./custom-setup";
import { suggestion } from "../extensions/suggestion";
import { quickEdit } from "../extensions/quick-edit";
import { selectionTooltip } from "../extensions/selection-tooltip";

interface Props {
  fileName: string;
  onChange: (value: string) => void;
  initialValue?: string;
}

export const CodeEditor = ({
  fileName,
  initialValue = "",
  onChange,
}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageExtension = useMemo(
    () => getLanguageExtension(fileName),
    [fileName],
  );

  useEffect(() => {
    if (!editorRef.current) return;
    const view = new EditorView({
      doc: initialValue,
      parent: editorRef.current,
      extensions: [
        customSetup,
        javascript({ typescript: true }),
        oneDark,
        customTheme,
        languageExtension,
        suggestion(fileName),
        quickEdit(fileName),
        selectionTooltip(),
        keymap.of([indentWithTab]),
        Minimap(),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = view;
    return () => {
      view.destroy();
    };
    //eslint-disable-next-line
  }, [languageExtension]);

  return <div className=" size-full pl-4 bg-background" ref={editorRef} />;
};
