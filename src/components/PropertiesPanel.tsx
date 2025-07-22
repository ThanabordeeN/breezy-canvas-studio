import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CanvasObject } from "./OpenCanvas";

interface PropertiesPanelProps {
  selectedObject: CanvasObject | null;
  onObjectUpdate: (object: CanvasObject | null) => void;
}

export const PropertiesPanel = ({ selectedObject }: PropertiesPanelProps) => {
  if (!selectedObject) {
    return (
      <div className="w-80 bg-panel border-l border-panel-border p-6">
        <div className="text-center text-muted-foreground mt-8">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto bg-muted rounded-lg flex items-center justify-center">
              <span className="text-xl">🎨</span>
            </div>
          </div>
          <p className="text-sm">Select an object to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-panel border-l border-panel-border p-6">
      <div className="space-y-6">
        {/* Object Type Header */}
        <div>
          <h3 className="text-lg font-semibold text-foreground capitalize">
            {selectedObject.type} Properties
          </h3>
          <p className="text-sm text-muted-foreground">ID: {selectedObject.id}</p>
        </div>

        {/* Fill Color */}
        {selectedObject.fill && (
          <div className="space-y-2">
            <Label htmlFor="fill-color">Fill Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="fill-color"
                type="color"
                value={selectedObject.fill}
                className="w-12 h-8 border border-input rounded cursor-pointer"
              />
              <Input
                value={selectedObject.fill}
                placeholder="#000000"
                className="flex-1 text-sm"
              />
            </div>
          </div>
        )}

        {/* Stroke Color */}
        {selectedObject.stroke && (
          <div className="space-y-2">
            <Label htmlFor="stroke-color">Stroke Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="stroke-color"
                type="color"
                value={selectedObject.stroke}
                className="w-12 h-8 border border-input rounded cursor-pointer"
              />
              <Input
                value={selectedObject.stroke}
                placeholder="#000000"
                className="flex-1 text-sm"
              />
            </div>
          </div>
        )}

        {/* Stroke Width */}
        {selectedObject.strokeWidth !== undefined && (
          <div className="space-y-2">
            <Label htmlFor="stroke-width">Stroke Width</Label>
            <Input
              id="stroke-width"
              type="number"
              value={selectedObject.strokeWidth}
              min="0"
              max="20"
              className="text-sm"
            />
          </div>
        )}

        {/* Text Properties */}
        {selectedObject.type === "textbox" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="text-content">Text</Label>
              <Input
                id="text-content"
                value={selectedObject.text || ""}
                placeholder="Enter text..."
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                id="font-size"
                type="number"
                value={selectedObject.fontSize || 16}
                min="8"
                max="72"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <select
                id="font-family"
                value={selectedObject.fontFamily || "Arial"}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-input"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
          </>
        )}

        {/* Object Actions */}
        <div className="pt-4 border-t border-border">
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
              Duplicate Object
            </button>
            <button className="w-full px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/80 transition-colors">
              Delete Object
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};