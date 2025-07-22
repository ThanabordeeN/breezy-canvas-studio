import { useState } from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { toast } from "sonner";

export type Tool = "select" | "rectangle" | "circle" | "text";

export interface CanvasObject {
  id: string;
  type: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}

export const OpenCanvas = () => {
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedObject, setSelectedObject] = useState<CanvasObject | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [canvasBackground, setCanvasBackground] = useState("#ffffff");

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    toast(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`);
  };

  const handleObjectSelect = (object: CanvasObject | null) => {
    setSelectedObject(object);
  };

  const handleCanvasClear = () => {
    setSelectedObject(null);
    toast("Canvas cleared");
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Left Toolbar */}
      <Toolbar 
        activeTool={activeTool} 
        onToolChange={handleToolChange}
        onCanvasClear={handleCanvasClear}
      />
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Header */}
        <div className="bg-panel border-b border-panel-border px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">OpenCanvas</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="canvas-width" className="text-sm text-muted-foreground">W</label>
                <input
                  id="canvas-width"
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="w-20 px-2 py-1 text-sm border border-input rounded bg-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="canvas-height" className="text-sm text-muted-foreground">H</label>
                <input
                  id="canvas-height"
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-20 px-2 py-1 text-sm border border-input rounded bg-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="canvas-bg" className="text-sm text-muted-foreground">BG</label>
                <input
                  id="canvas-bg"
                  type="color"
                  value={canvasBackground}
                  onChange={(e) => setCanvasBackground(e.target.value)}
                  className="w-8 h-8 border border-input rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 p-6 bg-background overflow-auto">
          <div className="flex justify-center">
            <Canvas
              activeTool={activeTool}
              onObjectSelect={handleObjectSelect}
              canvasSize={canvasSize}
              backgroundColor={canvasBackground}
            />
          </div>
        </div>
      </div>

      {/* Right Properties Panel */}
      <PropertiesPanel 
        selectedObject={selectedObject}
        onObjectUpdate={setSelectedObject}
      />
    </div>
  );
};