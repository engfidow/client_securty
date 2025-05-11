import React from 'react';

const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
      <table className="min-w-full text-sm text-left border dark:border-gray-700">
        <thead>
          <tr>
            {[...Array(7)].map((_, index) => (
              <th key={index} className="p-3">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse">
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-t dark:border-gray-700">
              <td className="p-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
              <td className="p-3">
                <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingSkeleton;
