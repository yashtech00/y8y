import { X } from "lucide-react";
import { SearchBar } from './SearchBar';
import { PlatformList } from './PlatformList';
import type { Platform } from '../../../types/workflow';

interface PlatformDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  platforms: Platform[];
  onPlatformSelect: (platform: string) => void;
}

export const PlatformDrawer = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  platforms,
  onPlatformSelect,
}: PlatformDrawerProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Add Step</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Choose a platform to add to your workflow
          </p>
        </div>

        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange} 
        />

        {/* Platform List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PlatformList 
            platforms={platforms} 
            onPlatformSelect={onPlatformSelect} 
          />
        </div>
      </div>
    </>
  );
};
