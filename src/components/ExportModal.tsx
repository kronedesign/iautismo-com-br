import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportModalProps {
  onClose: () => void;
  data: Record<string, any>[];
}

export function ExportModal({ onClose, data }: ExportModalProps) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    setExporting(true);
    try {
      // Convert data to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      onClose();
    } catch (error) {
      console.error('Error exporting to CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToXLSX = () => {
    setExporting(true);
    try {
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Usuários');

      // Generate and download file
      XLSX.writeFile(wb, `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      onClose();
    } catch (error) {
      console.error('Error exporting to XLSX:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Exportar Lista</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Escolha o formato para exportar a lista de usuários:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">CSV</span>
            </button>

            <button
              onClick={exportToXLSX}
              disabled={exporting}
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <FileSpreadsheet className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Excel</span>
            </button>
          </div>

          {exporting && (
            <div className="text-center text-sm text-gray-600">
              Preparando arquivo...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}