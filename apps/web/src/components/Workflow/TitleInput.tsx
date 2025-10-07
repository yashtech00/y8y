interface TitleInputProps {
  title: string;
  onTitleChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const TitleInput = ({ title, onTitleChange, onSave, isSaving }: TitleInputProps) => (
  <div className="flex  bg-background text-foreground  justify-between">
    <div className="  gap-4">
   <span className="flex items-center">Workflow /</span>
    <input
      type="text"
      placeholder="Enter workflow title..."
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      className="px-4 py-2.5 rounded-lg  bg-background text-foreground placeholder:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-80"
      />
      
      </div>
    <button
      onClick={onSave}
      disabled={isSaving}
      className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
        isSaving
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
      }`}
    >
      {isSaving ? "Saving..." : "Save Workflow"}
    </button>
  </div>
);
