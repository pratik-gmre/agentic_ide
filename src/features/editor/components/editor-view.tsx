import { useFile, useUpdateFiles } from "@/features/projects/hooks/use-files";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { FileBreadCrumbs } from "./file-breadcrums";

import { TopNavigation } from "./top-navigation";
import Image from "next/image";
import { CodeEditor } from "./code-editor";
import { useRef } from "react";

const DEBOUNCE_MS = 1500;
export const EditorView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const { activeTabId } = useEditor(projectId);
  const activeFile = useFile(activeTabId);
  const updateFile = useUpdateFiles();
  const timeoutref = useRef<NodeJS.Timeout | null>(null);


  const isActiveFileBinary = activeFile && activeFile.storageId;
  const isActiveFileText = activeFile && !activeFile.storageId

  return (
    <div className="flex flex-col h-full ">
      <div className="flex items-center">
        <TopNavigation projectId={projectId} />
      </div>

      {activeTabId && <FileBreadCrumbs projectId={projectId} />}
      <div className="flex-1 min-h-0 bg-background">
        {!activeFile && (
          <div className="size-full lfex items-center justify-center">
            <Image
              src={"/logo-alt-svg"}
              alt="logo"
              width={50}
              height={50}
              className="opacity-25"
            />
          </div>
        )}
        {isActiveFileText && (
          <CodeEditor
            key={activeFile._id}
            initialValue={activeFile.content}
            onChange={(content: string) => {
                if(timeoutref.current){
                    clearTimeout(timeoutref.current);
                }

                timeoutref.current = setTimeout(() => {
                    updateFile({
                        id: activeFile._id,
                        content,
                    });
                }, DEBOUNCE_MS);
              
            }}
            fileName={activeFile.name}
          />
        )}
         {isActiveFileBinary && (
        <p className="">ToDo</p>
    )}
      </div>
    </div>
   
  );
};
