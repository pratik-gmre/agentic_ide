"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { NavBar } from "./navbar";

import { Allotment } from "allotment";
import "allotment/dist/style.css";
interface ProjectIdLayoutProps {
  projectId: Id<"projects">;
  children: React.ReactNode;
}

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;
export const ProjectIdLayout = ({
  projectId,
  children,
}: ProjectIdLayoutProps) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <NavBar projectId={projectId} />
      <div className="flex-1 flex overflow-hidden ">
        <Allotment
          className="flex-1"
          defaultSizes={[DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <div className="">Conversation </div>
          </Allotment.Pane>
          <Allotment.Pane>{children}</Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
