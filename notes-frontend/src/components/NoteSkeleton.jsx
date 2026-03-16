function NoteSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>

      <div className="flex gap-3 mt-4">
        <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

    </div>
  );
}

export default NoteSkeleton;