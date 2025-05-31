import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CsvTable from './CsvTable';
import Header from '../Header';
import axios from 'axios';

const userInfo = {
  name: "Profile",
  jobTitle: "Manager",
  profileImage: ""
};

const onLogout = () => {
  console.log("Logging out...");
};

const CsvPage = () => {
  const [csvData, setCsvData] = useState<{ [key: string]: string }[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/csv-files');
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching CSV files:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setCsvData(results.data as { [key: string]: string }[]);
      }
    });
  };

  const handleDownload = (filePath: string, originalName: string) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${filePath.replace(/\\/g, '/')}`;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/csv/${fileId}`);
      setFiles(prev => prev.filter(f => f._id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };
  

  return (
    <div className="min-h-screen bg-bizerta-beige/50">
      <Header onLogout={onLogout} userInfo={userInfo} />

      <main className="max-w-6xl mx-auto px-4 py-10">

        {files.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto bg-white border border-gray-200">
              <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Filename</th>
                  <th className="px-6 py-3 text-left">Uploaded At</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {files.map(file => (
                  <tr key={file._id}>
                    <td className="px-6 py-4">{file.originalname}</td>
                    <td className="px-6 py-4">{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownload(file.path, file.originalname)}
                        className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No CSV files found.</p>
        )}

        {csvData.length > 0 && (
          <div className="mt-8">
            <CsvTable
              data={csvData}
              title="CSV Preview"
              description="This is a preview of the CSV data you've just uploaded."
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default CsvPage;
