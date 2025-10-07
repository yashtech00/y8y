import { Search } from 'lucide-react';
import type { Platform } from '../../../types/workflow';

interface PlatformListProps {
  platforms: Platform[];
  onPlatformSelect: (platform: string) => void;
}

export const PlatformList = ({ platforms, onPlatformSelect }: PlatformListProps) => {
  if (platforms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium mb-1">No platforms found</p>
        <p className="text-sm text-gray-500">Try searching with different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {platforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => onPlatformSelect(platform.name)}
          className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{platform.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {platform.name}
                </h3>
                {platform.requiresAuth && (
                  <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                    Auth
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {platform.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
