import { MousePointer, Square, Circle, Type, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "./OpenCanvas";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onCanvasClear: () => void;
}

export const Toolbar = ({ activeTool, onToolChange, onCanvasClear }: ToolbarProps) => {
  const tools: Array<{ id: Tool; icon: React.ReactNode; label: string }> = [
    { id: "select", icon: <MousePointer size={20} />, label: "Select" },
    { id: "rectangle", icon: <Square size={20} />, label: "Rectangle" },
    { id: "circle", icon: <Circle size={20} />, label: "Circle" },
    { id: "text", icon: <Type size={20} />, label: "Text" },
  ];

  return (
    <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 gap-2">
      {/* Tools */}
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant="ghost"
          size="icon"
          onClick={() => onToolChange(tool.id)}
          className={cn(
            "w-12 h-12 rounded-lg transition-all duration-200",
            activeTool === tool.id
              ? "bg-tool-active text-primary-foreground shadow-lg"
              : "text-sidebar-foreground hover:bg-sidebar-border hover:text-tool-hover"
          )}
          title={tool.label}
        >
          {tool.icon}
        </Button>
      ))}

      {/* Separator */}
      <div className="w-8 h-px bg-sidebar-border my-2" />

      {/* Clear Canvas */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onCanvasClear}
        className="w-12 h-12 rounded-lg text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
        title="Clear Canvas"
      >
        <Trash2 size={20} />
      </Button>
    </div>
  );
};