import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
}

export const FileUpload = ({ onFileSelect, accept, label }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match(accept)) {
      onFileSelect(file);
    } else {
      toast.error('Invalid file type');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        id={`file-upload-${label}`}
      />
      <label htmlFor={`file-upload-${label}`} className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium">{label}</h3>
        <p className="text-sm text-gray-500">
          Drag and drop or click to upload
        </p>
      </label>
    </div>
  );
};