// src/components/DragCrop.jsx
import React, { useState, useRef, useEffect } from "react";
import ImageUploader from "./ImageUploader";

const DragCrop = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [cropSize, setCropSize] = useState({ width: 1080, height: 1080 });
  const [blendMode, setBlendMode] = useState("source-over");
  const [opacity, setOpacity] = useState(1); // State for opacity
  const canvasRef = useRef(null);
  const [blendedImage, setBlendedImage] = useState(null);

  const blendImages = (ctx, img1, img2, opacity) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img1, 0, 0, cropSize.width, cropSize.height);
    ctx.globalAlpha = opacity; // Set opacity
    ctx.globalCompositeOperation = blendMode;
    ctx.drawImage(img2, 0, 0, cropSize.width, cropSize.height);
    setBlendedImage(canvasRef.current.toDataURL("image/png"));
  };

  useEffect(() => {
    if (image1 && image2) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img1 = new Image();
      const img2 = new Image();

      img1.src = image1;
      img2.src = image2;

      img1.onload = () => {
        canvas.width = cropSize.width;
        canvas.height = cropSize.height;
        img2.onload = () => {
          blendImages(ctx, img1, img2, opacity);
        };
      };
    }
  }, [image1, image2, blendMode, cropSize, opacity]);

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-2xl font-bold">Image Blend App</h1>
      <div className="flex flex-wrap m-4">
        <div className="w-full max-w-xs mx-auto mb-5 form-control">
          <label className="label">
            <span className="label-text">Select Crop Size</span>
          </label>
          <select
            className="select select-bordered"
            value={JSON.stringify(cropSize)}
            onChange={(e) => setCropSize(JSON.parse(e.target.value))}
          >
            <option value='{"width":1080,"height":1080}'>1080x1080</option>
            <option value='{"width":1080,"height":1350}'>1080x1350</option>
            <option value='{"width":720,"height":720}'>720x720</option>
            <option value='{"width":1280,"height":720}'>1280x720</option>
            {/* Add more sizes here */}
          </select>
        </div>
        <div className="w-full max-w-xs mx-auto form-control">
          <label className="label">
            <span className="label-text">Select Blend Mode</span>
          </label>
          <select
            className="select select-bordered"
            value={blendMode}
            onChange={(e) => setBlendMode(e.target.value)}
          >
            <option value="source-over">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
            <option value="hard-light">Hard Light</option>
            <option value="soft-light">Soft Light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
            <option value="hue">Hue</option>
            <option value="saturation">Saturation</option>
            <option value="color">Color</option>
            <option value="luminosity">Luminosity</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <ImageUploader onImageUpload={setImage1} cropSize={cropSize} />
        {image1 && <img src={image1} alt="First" className="max-w-xs m-2" />}
      </div>
      <div className="mb-5">
        <ImageUploader onImageUpload={setImage2} cropSize={cropSize} />
        {image2 && <img src={image2} alt="Second" className="max-w-xs m-2" />}
      </div>
      {image1 && image2 && (
        <div className="mb-5">
          <canvas ref={canvasRef} className="hidden border-2 border-black" />
        </div>
      )}

      <div className="mb-5">
        <label htmlFor="opacity" className="text-sm font-medium">
          Opacity:
        </label>
        <input
          type="range"
          id="opacity"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="mb-5">
        <h2 className="mb-2 text-xl font-bold">Blended Image</h2>
        <img src={blendedImage} alt="Blended" className="max-w-xs m-2" />
        <a
          href={blendedImage}
          download="blended-image.png"
          className="mt-2 btn btn-primary"
        >
          Download Blended Image
        </a>
      </div>
    </div>
  );
};

export default DragCrop;
