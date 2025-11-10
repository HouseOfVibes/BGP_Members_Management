import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

const BulkUpload = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast.error('Please select a CSV or Excel file');
        event.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading('Uploading and processing file...');

    try {
      const response = await adminAPI.bulkImport(selectedFile);

      setUploadResult(response.results);

      if (response.results.failed === 0) {
        toast.success(`Successfully imported ${response.results.success} members!`, {
          id: uploadToast
        });
      } else {
        toast.success(
          `Imported ${response.results.success} members. ${response.results.failed} failed.`,
          { id: uploadToast }
        );
      }

      // Clear file selection
      setSelectedFile(null);

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed', { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadResult(null);
    document.getElementById('file-upload').value = '';
  };

  const downloadTemplate = () => {
    const csvContent = 'First Name,Last Name,Email,Phone,Street Address,City,State,ZIP Code,Date of Birth,Baptism Date,Marital Status,Spouse Name\n' +
                      'John,Doe,john.doe@example.com,(919) 555-0123,123 Main St,Wendell,NC,27591,1985-05-15,,married,Jane Doe';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'member_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Bulk Import Members
        </h3>
        <p className="text-gray-600 text-sm">
          Upload a CSV or Excel file to import multiple members at once.
        </p>
      </div>

      {/* Template Download */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-blue-700 mb-2">
              Download our template to ensure your data is formatted correctly.
            </p>
            <button
              onClick={downloadTemplate}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 underline"
            >
              Download CSV Template
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>
        <div className="flex items-center space-x-3">
          <label className="flex-1">
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              disabled={uploading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
          {selectedFile && (
            <button
              onClick={handleClear}
              disabled={uploading}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{selectedFile.name}</span>
            {' '}({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bgp-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Upload and Import'
        )}
      </button>

      {/* Upload Results */}
      {uploadResult && (
        <div className="mt-6 p-4 border rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Import Results</h4>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-green-600 text-sm font-medium">Successful</div>
              <div className="text-2xl font-bold text-green-700">{uploadResult.success}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-red-600 text-sm font-medium">Failed</div>
              <div className="text-2xl font-bold text-red-700">{uploadResult.failed}</div>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Errors:</h5>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uploadResult.errors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-900">{error.row}</td>
                        <td className="px-3 py-2 text-gray-600">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">File Requirements:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>File must be CSV (.csv) or Excel (.xlsx, .xls) format</li>
          <li>Required columns: First Name, Last Name, Email, Phone</li>
          <li>Optional columns: Address, City, State, ZIP, Date of Birth, etc.</li>
          <li>Maximum file size: 10 MB</li>
          <li>Duplicate emails will be skipped</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkUpload;
