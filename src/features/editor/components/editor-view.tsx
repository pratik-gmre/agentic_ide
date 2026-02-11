import { useFile } from "@/features/projects/hooks/use-files";
import { Id } from "../../../../convex/_generated/dataModel";
import { useEditor } from "../hooks/use-editor";
import { FileBreadCrumbs } from "./file-breadcrums";

import { TopNavigation } from "./top-navigation";
import Image from "next/image";
import { CodeEditor } from "./code-editor";




export const EditorView = ({projectId}:{projectId:Id<"projects">})=>{

const {activeTabId} = useEditor(projectId)
const activeFile =useFile(activeTabId)
    return (

<div className="flex flex-col h-full ">
    <div className="flex items-center">
        <TopNavigation projectId={projectId}/>
    </div>

    {activeTabId && <FileBreadCrumbs projectId={projectId}/>}
    <div className="flex-1 min-h-0 bg-background">
        {!activeFile && 
        (
            <div className="size-full lfex items-center justify-center">
                <Image src={"/logo-alt-svg"} alt="logo" width={50} height={50} className="opacity-25"/>
            </div>
        )}
        {activeFile && (
            <CodeEditor/>
        )}
    </div>
</div>

    )

}