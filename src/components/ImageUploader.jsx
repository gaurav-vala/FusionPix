// src/components/ImageUploader.jsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage"; // Utility function to crop the image

const ImageUploader = ({ onImageUpload, cropSize, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
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
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onImageUpload(croppedImage);
    setImageSrc(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div className="ImageUploader_Container">
      {!imageSrc ? (
        <div
          {...getRootProps()}
          className="p-5 text-center rounded-md cursor-pointer bg-gray-950 border-neutral-200 text-neutral-50"
        >
          <input {...getInputProps()} />
          <p className="text-sm md:text-md">{placeholder}</p>
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
            className="relative z-50 mt-2 btn btn-primary"
          >
            Crop
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
