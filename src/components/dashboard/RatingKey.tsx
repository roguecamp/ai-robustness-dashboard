export const RatingKey = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-100 sticky top-4">
      <div className="text-sm font-medium mb-2">Rating Key</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-700"></div>
          <span className="text-sm">Largely in Place</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-300"></div>
          <span className="text-sm">Somewhat in Place</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
          <span className="text-sm">Not in Place</span>
        </div>
      </div>
    </div>
  );
};