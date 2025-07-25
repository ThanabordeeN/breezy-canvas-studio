import { useState, useEffect } from "react";
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
    (window as any).clearCanvas?.();
    setSelectedObject(null);
    toast("Canvas cleared");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'v':
        case 's':
          e.preventDefault();
          handleToolChange("select");
          break;
        case 'r':
          e.preventDefault();
          handleToolChange("rectangle");
          break;
        case 'c':
          e.preventDefault();
          handleToolChange("circle");
          break;
        case 't':
          e.preventDefault();
          handleToolChange("text");
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">OpenCanvas</h1>
              <div className="text-xs text-muted-foreground">
                Shortcuts: S/V=Select, R=Rectangle, C=Circle, T=Text, Del=Delete
              </div>
            </div>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (window as any).exportCanvas?.('png')}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Export PNG
                </button>
                <button
                  onClick={() => (window as any).exportCanvas?.('jpg')}
                  className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Export JPG
                </button>
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