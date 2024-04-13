import React, { useEffect } from "react";
import "./style.css";
import canvasScript from "./canvasScript";
import ctaScript from "./ctaScript.js";

function CanvasEditor() {
  // adding text functionality
  useEffect(() => {
    // Call the canvas script logic when the component mounts
    canvasScript();
    ctaScript();
  }, []);
  // adding image functionlity
  function onChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 56, 442, canvas.width / 2, canvas.height / 2);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  return (
    <>
      <div className="main-container">
        {/* Left column for editor */}
        <div className="left editor-container">
          <div className="canvas-container">
            <canvas
              height={1080}
              width={1080}
              style={{ height: 400, width: 400 }}
              id="canvas"
              className="scaled-canvas"
            ></canvas>
            <div className="mask"></div>
          </div>
        </div>

        {/* Right column for controls */}
        <div className="right controls">
          <div className="container">
            {/* Heading */}
            <div className="heading">
              <div className="main-heading">Ad Customization</div>
              <div className="sub-heading">
                Customize your ad and get the templates accordingly
              </div>
            </div>

            {/* Image Selector */}
            <div className="image-selector">
              <div>
                <span className="image-icon">SVG</span>
                <span className="image-text">
                  Change the ad creative image.
                </span>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={onChangeFile}
                ></input>
              </div>
            </div>

            {/* Partition */}
            <div className="partition">
              <hr />
              <span className="partition-text">Edit Contents</span>
              <hr />
            </div>

            {/* Content Selector */}
            <div className="content-selector">
              <div className="input-container">
                <label htmlFor="caption-input">Ad content</label>
                <input
                  type="text"
                  id="caption-input"
                  placeholder="Enter caption"
                ></input>
              </div>
              <div className="content-emoji-container">Emo</div>
            </div>

            {/* CTA Selector */}
            <div className="cta-selector">
              <div className="input-container">
                <label htmlFor="cta-input">CTA</label>
                <input
                  type="text"
                  id="cta-input"
                  placeholder="Enter call to action"
                ></input>
              </div>
            </div>

            {/* Color Selector */}
            <div className="color-selector">
              <div className="color-picker-container">
                <label htmlFor="background-color">Select a color:</label>
                <input
                  type="color"
                  id="background-color"
                  value="#ffffff"
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CanvasEditor;
