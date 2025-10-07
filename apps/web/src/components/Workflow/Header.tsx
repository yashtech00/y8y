import { Zap } from "lucide-react";

export const Header = () => (
  <div className="flex justify-between items-center px-6 py-4 bg-background text-foreground ">
    <div className="flex items-center gap-3">
      <Zap className="w-6 h-6 text-blue-600" />
      <h1 className="text-xl font-semibold text-primary">Workflow Editor</h1>
    </div>
    
  </div>
);
