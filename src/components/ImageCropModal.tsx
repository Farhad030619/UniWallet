
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageCropModalProps {
  onClose: () => void;
  onSave: (base64Image: string) => void;
}

const CROP_AREA_SIZE = 280;
const OUTPUT_IMAGE_SIZE = 256;

export const ImageCropModal: React.FC<ImageCropModalProps> = ({ onClose, onSave }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, over: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(over);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileChange(e.dataTransfer.files[0]);
      }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const aspectRatio = naturalWidth / naturalHeight;
    
    let displayWidth, displayHeight;
    if (aspectRatio > 1) { // Landscape
      displayHeight = CROP_AREA_SIZE;
      displayWidth = CROP_AREA_SIZE * aspectRatio;
    } else { // Portrait or square
      displayWidth = CROP_AREA_SIZE;
      displayHeight = CROP_AREA_SIZE / aspectRatio;
    }
    setImageDimensions({ width: displayWidth, height: displayHeight });
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const zoomedWidth = imageDimensions.width * zoom;
    const zoomedHeight = imageDimensions.height * zoom;
    
    const maxX = Math.max(0, (zoomedWidth - CROP_AREA_SIZE) / 2);
    const maxY = Math.max(0, (zoomedHeight - CROP_AREA_SIZE) / 2);
    
    const newX = position.x + dx;
    const newY = position.y + dy;

    setPosition({ 
        x: Math.max(-maxX, Math.min(newX, maxX)), 
        y: Math.max(-maxY, Math.min(newY, maxY))
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, position, zoom, imageDimensions]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const zoomedWidth = imageDimensions.width * zoom;
    const zoomedHeight = imageDimensions.height * zoom;
    const maxX = Math.max(0, (zoomedWidth - CROP_AREA_SIZE) / 2);
    const maxY = Math.max(0, (zoomedHeight - CROP_AREA_SIZE) / 2);
    const newX = Math.max(-maxX, Math.min(position.x, maxX));
    const newY = Math.max(-maxY, Math.min(position.y, maxY));
    if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
    }
  }, [zoom, imageDimensions, position]);

  const handleSave = () => {
    const image = imageRef.current;
    if (!image || !image.naturalWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_IMAGE_SIZE;
    canvas.height = OUTPUT_IMAGE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = image.naturalWidth / imageDimensions.width;
    
    const sWidth = (CROP_AREA_SIZE / zoom) * scale;
    const sHeight = (CROP_AREA_SIZE / zoom) * scale;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;
    
    const sx = centerX - (sWidth / 2) - (position.x * scale);
    const sy = centerY - (sHeight / 2) - (position.y * scale);

    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, OUTPUT_IMAGE_SIZE, OUTPUT_IMAGE_SIZE);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 flex flex-col" onMouseDown={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-center">Update Profile Picture</h2>
        
        {!imageSrc ? (
            <div 
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <svg xmlns="http://www.w.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="mt-2 font-semibold text-gray-700 dark:text-gray-300">Drag & Drop an image here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
                <button type="button" className="mt-2 bg-blue-500 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:bg-blue-600 transition">Import Image</button>
                <input type="file" ref={fileInputRef} onChange={onFileSelected} accept="image/*" className="hidden" />
            </div>
        ) : (
             <div className="space-y-4">
                <div 
                    className={`relative mx-auto bg-gray-200 dark:bg-gray-900 overflow-hidden touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ width: CROP_AREA_SIZE, height: CROP_AREA_SIZE, borderRadius: '50%'}}
                    onMouseDown={handleMouseDown}
                >
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Preview"
                        onLoad={onImageLoad}
                        className="max-w-none absolute top-1/2 left-1/2"
                        style={{
                            width: imageDimensions.width,
                            height: imageDimensions.height,
                            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        }}
                    />
                </div>
                 <div className="flex items-center gap-3 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                     />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                </div>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">Drag to pan, use slider to zoom</p>
            </div>
        )}
        
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!imageSrc} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
