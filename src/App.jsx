import React, { useState, useRef, useEffect } from "react";
import ImageUploader from "./components/ImageUploader";
import { Eclipse } from "lucide-react";

const App = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [cropSize, setCropSize] = useState({ width: 1080, height: 1080 });
  const [blendMode, setBlendMode] = useState("source-over");
  const [opacity, setOpacity] = useState(1); // New state for opacity control
  const canvasRef = useRef(null);
  const [blendedImage, setBlendedImage] = useState(null);

  const blendImages = (ctx, img1, img2) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img1, 0, 0, cropSize.width, cropSize.height);
    ctx.globalAlpha = opacity; // Set opacity for second image
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
          blendImages(ctx, img1, img2);
        };
      };
    }
  }, [image1, image2, blendMode, cropSize, opacity]); // Added opacity to dependencies

  return (
    <section className="w-full max-w-4xl px-6 py-8 mx-auto md:py-12">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 mb-5 text-2xl font-bold text-neutral-200">
          <Eclipse />
          <span>FusionPix</span>
        </h1>
        <div className="flex flex-wrap md:m-4">
          <div className="w-full mx-auto mb-5 max-w-96 form-control">
            <label className="justify-center label">
              <span className="text-lg font-semibold tracking-tight text-center md:text-xl label-text">
                Select Crop Size
              </span>
            </label>
            <select
              className="rounded-md select select-bordered"
              value={JSON.stringify(cropSize)}
              onChange={(e) => setCropSize(JSON.parse(e.target.value))}
            >
              <option value='{"width":1080,"height":1080}'>1080x1080</option>
              <option value='{"width":1080,"height":1350}'>1080x1350</option>
              <option value='{"width":720,"height":720}'>720x720</option>
              <option value='{"width":1280,"height":720}'>1280x720</option>
              <option value='{"width":1080,"height":1920}'>1080x1920</option>
              <option value='{"width":1152,"height":600}'>1152x600</option>
              {/* Add more sizes here */}
            </select>
          </div>
        </div>

        <div className="mb-5">
          <ImageUploader
            onImageUpload={setImage1}
            cropSize={cropSize}
            placeholder="Click to select one - IMAGE"
          />
          {image1 && (
            <img src={image1} alt="First" className="max-w-xs m-2 mx-auto " />
          )}
        </div>
        <div className="mb-5">
          <ImageUploader
            onImageUpload={setImage2}
            cropSize={cropSize}
            placeholder="Click to select one - TEXTURE"
          />
          {image2 && (
            <img
              src={image2}
              alt="Second"
              className="max-w-xs m-2 mx-auto rounded"
            />
          )}
        </div>

        {image1 && image2 && (
          <div className="mb-5">
            <canvas ref={canvasRef} className="hidden border-2 border-black" />
          </div>
        )}

        {blendedImage && (
          <div className="mb-5">
            <h2 className="mb-2 text-xl font-bold">Blended Images</h2>
            <img
              src={blendedImage}
              alt="Blended"
              className="max-w-xs m-2 mx-auto rounded"
            />

            {/* Blend Mode Selection */}
            <div className="w-full max-w-xs mx-auto form-control">
              <label className="label">
                <span className="label-text">Select Blend Mode</span>
              </label>
              <select
                className="select select-bordered"
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value)}
              >
                <option value="source-over">Source Over</option>
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

            {/* Opacity Control */}
            <div className="mb-5">
              <label className="label">
                <span className="label-text">Opacity</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.10"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="range"
              />
              <span>{Math.round(opacity * 100)}%</span>
            </div>

            <a
              href={blendedImage}
              download="blended-image.png"
              className="mt-2 btn btn-primary"
            >
              Download Blended Image
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
