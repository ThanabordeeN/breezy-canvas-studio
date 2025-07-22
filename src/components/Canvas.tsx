import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Textbox } from "fabric";
import type { Tool, CanvasObject } from "./OpenCanvas";

interface CanvasProps {
  activeTool: Tool;
  onObjectSelect: (object: CanvasObject | null) => void;
  canvasSize: { width: number; height: number };
  backgroundColor: string;
}

export const Canvas = ({ activeTool, onObjectSelect, canvasSize, backgroundColor }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: backgroundColor,
      selection: true,
    });

    // Set up event listeners
    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        onObjectSelect({
          id: Math.random().toString(36).substr(2, 9),
          type: activeObject.type || '',
          fill: activeObject.fill as string,
          stroke: activeObject.stroke as string,
          strokeWidth: activeObject.strokeWidth,
          text: (activeObject as any).text,
          fontSize: (activeObject as any).fontSize,
          fontFamily: (activeObject as any).fontFamily,
        });
      }
    });

    canvas.on('selection:updated', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        onObjectSelect({
          id: Math.random().toString(36).substr(2, 9),
          type: activeObject.type || '',
          fill: activeObject.fill as string,
          stroke: activeObject.stroke as string,
          strokeWidth: activeObject.strokeWidth,
          text: (activeObject as any).text,
          fontSize: (activeObject as any).fontSize,
          fontFamily: (activeObject as any).fontFamily,
        });
      }
    });

    canvas.on('selection:cleared', () => {
      onObjectSelect(null);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas size and background
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.setDimensions(canvasSize);
      fabricCanvas.backgroundColor = backgroundColor;
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas, canvasSize, backgroundColor]);

  // Handle tool changes and keyboard shortcuts
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleCanvasClick = (e: any) => {
      if (activeTool === "select") return;
      
      // Don't create new object if clicking on existing object
      if (e.target && e.target !== fabricCanvas) return;

      const pointer = fabricCanvas.getPointer(e.e);
      let newObject: any = null;

      switch (activeTool) {
        case "rectangle":
          newObject = new Rect({
            left: pointer.x - 50,
            top: pointer.y - 25,
            fill: "#3b82f6",
            width: 100,
            height: 50,
            stroke: "#1e3a8a",
            strokeWidth: 2,
          });
          break;

        case "circle":
          newObject = new Circle({
            left: pointer.x - 35,
            top: pointer.y - 35,
            fill: "#ef4444",
            radius: 35,
            stroke: "#991b1b",
            strokeWidth: 2,
          });
          break;

        case "text":
          newObject = new Textbox("Type here...", {
            left: pointer.x,
            top: pointer.y,
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#000000",
            width: 200,
          });
          break;
      }

      if (newObject) {
        fabricCanvas.add(newObject);
        fabricCanvas.setActiveObject(newObject);
        fabricCanvas.renderAll();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'v':
        case 's':
          onObjectSelect(null);
          break;
        case 'r':
          e.preventDefault();
          break;
        case 'c':
          e.preventDefault();
          break;
        case 't':
          e.preventDefault();
          break;
        case 'delete':
        case 'backspace':
          const activeObject = fabricCanvas.getActiveObject();
          if (activeObject) {
            fabricCanvas.remove(activeObject);
            fabricCanvas.renderAll();
            onObjectSelect(null);
          }
          break;
      }
    };

    fabricCanvas.on('mouse:down', handleCanvasClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas, activeTool, onObjectSelect]);

  // Clear canvas function
  const clearCanvas = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = backgroundColor;
      fabricCanvas.renderAll();
      onObjectSelect(null);
    }
  };

  // Expose clear function to parent
  useEffect(() => {
    (window as any).clearCanvas = clearCanvas;
  }, [fabricCanvas, backgroundColor]);

  // Update selected object properties
  const updateObjectProperties = (updates: Partial<CanvasObject>) => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (!activeObject) return;

    Object.keys(updates).forEach(key => {
      if (key === 'text' && activeObject.type === 'textbox') {
        (activeObject as any).set('text', updates[key]);
      } else if (key === 'fontSize' && activeObject.type === 'textbox') {
        (activeObject as any).set('fontSize', updates[key]);
      } else if (key === 'fontFamily' && activeObject.type === 'textbox') {
        (activeObject as any).set('fontFamily', updates[key]);
      } else if (key === 'fill') {
        activeObject.set('fill', updates[key]);
      } else if (key === 'stroke') {
        activeObject.set('stroke', updates[key]);
      } else if (key === 'strokeWidth') {
        activeObject.set('strokeWidth', updates[key]);
      }
    });

    fabricCanvas?.renderAll();
  };

  // Delete and duplicate functions
  const deleteObject = () => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (activeObject) {
      fabricCanvas?.remove(activeObject);
      fabricCanvas?.renderAll();
      onObjectSelect(null);
    }
  };

  const duplicateObject = async () => {
    const activeObject = fabricCanvas?.getActiveObject();
    if (!activeObject) return;

    try {
      const cloned = await activeObject.clone();
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10,
      });
      fabricCanvas?.add(cloned);
      fabricCanvas?.setActiveObject(cloned);
      fabricCanvas?.renderAll();
    } catch (error) {
      console.error('Error duplicating object:', error);
    }
  };

  // Expose functions to global scope
  useEffect(() => {
    (window as any).updateObjectProperties = updateObjectProperties;
    (window as any).deleteObject = deleteObject;
    (window as any).duplicateObject = duplicateObject;
  }, [fabricCanvas]);

  return (
    <div className="bg-canvas rounded-lg shadow-lg border border-canvas-border overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};