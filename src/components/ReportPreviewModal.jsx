import React from 'react';
import DropdownNotifications from './DropdownNotifications';

const ReportPreviewModal = ({ report, onClose }) => {
  console.log(report)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-violet-600 dark:text-violet-300">🕵️ Report Preview</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>

        <div className="space-y-3">
          <p><strong>Title:</strong> {report.title}</p>
          <p><strong>User:</strong> {report.user?.name || '-'}</p>
          <p><strong>District:</strong> {report.district}</p>
          <p><strong>Status:</strong> <span className="capitalize">{report.status}</span></p>
          <p><strong>Description:</strong> {report.description}</p>
          <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
         
           {report.branch && (<p><strong>Branch:</strong> {report.branch }</p>)}
           {/* ✅ Added Updated By and Updated At */}
           
          {report?.updatedBy?.role && (
            <p><strong>Role By:</strong> {report?.updatedBy.role} ({report?.updatedBy.email})</p>
          )}
         
         
          {/* ✅ Added Updated By and Updated At */}
          {report?.updatedBy && (
            <p><strong>Updated By:</strong> {report.updatedBy.name} ({report.updatedBy.email})</p>
          )}
          {report.updatedAt && (
            <p><strong>Last Updated:</strong> {new Date(report.updatedAt).toLocaleString()}</p>
          )}
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {report.images?.map((img, i) => (
              <img
                key={i}
                src={`https://security991.onrender.com/uploads/report/${img}`}
                alt={`report-${i}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ReportPreviewModal;
