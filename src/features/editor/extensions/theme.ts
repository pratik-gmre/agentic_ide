import { EditorView } from "codemirror";

export const customTheme  = EditorView.theme({
    "&":{
        outline:"none !important",
        height:"100%",
    },
    ".cm-content":{
        fontfamily:"var(--font-plex-mono), monospace",
        fontSize:"14px",
    },

})