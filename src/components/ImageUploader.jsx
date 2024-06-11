// src/components/ImageUploader.jsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage"; // Utility function to crop the image

const ImageUploader = ({ onImageUpload, cropSize }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      alert("Only image files are allowed");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    console.log("handle crop");
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onImageUpload(croppedImage);
    setImageSrc(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Only accept image files
  });

  return (
    <div>
      {!imageSrc ? (
        <div
          {...getRootProps()}
          className="border-2 border-slate-600 rounded-md p-5 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
      ) : (
        <div className="relative w-full h-64">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropSize.width / cropSize.height}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <button
            onClick={handleCrop}
            className="btn btn-primary mt-2 relative z-50"
          >
            Crop
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
