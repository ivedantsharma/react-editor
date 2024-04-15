import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import { SketchPicker } from "react-color";
import templateData from "./templateData.json";

function CanvasEditor() {
  const canvasRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [inputTextforCTA, setInputTextforCTA] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [colorHistory, setColorHistory] = useState([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false); // New state to track color picker visibility
  const ctaCoordinates = templateData.cta.position;

  // Inline styles for positioning the CTA button
  const ctaButtonStyle = {
    position: "absolute",
    top: `${ctaCoordinates.y}px`,
    left: `${ctaCoordinates.x}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "50px",
    borderRadius: "20px",
    backgroundColor: "#FFF",
    color: "black",
    textAlign: "center",
    verticalAlign: "middle",
    wordWrap: "break-word",
    whiteSpace: "normal",
    padding: "24px",
    fontSize: "17px",
  };

  // adding color picker functionality
  function handleColorChange(color) {
    setSelectedColor(color.hex);
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = color.hex; // Change the background color of the canvas
    updateColorHistory(color.hex);
  }
  // Update color history array
  function updateColorHistory(color) {
    setColorHistory((prevHistory) => {
      // Add the new color to the beginning of the history array
      const newHistory = [color, ...prevHistory];
      // If history length exceeds 5, remove the oldest color
      if (newHistory.length > 5) {
        newHistory.pop();
      }
      console.log(newHistory);
      return newHistory;
    });
  }
  function toggleColorPicker() {
    setColorPickerOpen(!colorPickerOpen);
  }
  const renderColorHistory = () => {
    return colorHistory.map((color, index) => (
      <div
        key={index}
        className="color-circle"
        style={{ backgroundColor: color }}
      />
    ));
  };

  // function wrapText(context, text, x, y, maxWidth, lineHeight) {
  //   var words = text.split(" ");
  //   var line = "";
  //   for (var n = 0; n < words.length; n++) {
  //     var testLine = line + words[n] + " ";
  //     var metrics = context.measureText(testLine);
  //     var testWidth = metrics.width;
  //     if (testWidth > maxWidth && n > 0) {
  //       context.fillText(line, x, y);
  //       line = words[n] + " ";
  //       y += lineHeight;
  //     } else {
  //       line = testLine;
  //     }
  //   }
  //   context.fillText(line, x, y);
  // }

  // adding text and cta functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load mask image
    const maskImg = new Image();
    maskImg.crossOrigin = "anonymous"; // Enable cross-origin request for the image
    maskImg.onload = function () {
      console.log("Mask image loaded"); // Log when mask image is loaded
      ctx.drawImage(
        maskImg,
        templateData.image_mask.x,
        templateData.image_mask.y,
        templateData.image_mask.width,
        templateData.image_mask.height
      );

      // Load stroke image
      const strokeImg = new Image();
      strokeImg.crossOrigin = "anonymous"; // Enable cross-origin request for the image
      strokeImg.onload = function () {
        console.log("Stroke image loaded"); // Log when stroke image is loaded
        ctx.drawImage(
          strokeImg,
          templateData.image_mask.x,
          templateData.image_mask.y,
          templateData.image_mask.width,
          templateData.image_mask.height
        );

        // Load design pattern image
        const designPatternImg = new Image();
        designPatternImg.crossOrigin = "anonymous"; // Enable cross-origin request for the image
        designPatternImg.onload = function () {
          console.log("Design pattern image loaded"); // Log when design pattern image is loaded
          // Draw design pattern image on canvas (behind mask area)
          ctx.drawImage(designPatternImg, 0, 0, canvas.width, canvas.height);

          // Render caption text after loading all images
          renderCaptionText(ctx);
          console.log("Caption text rendered"); // Log when caption text is rendered
        };
        designPatternImg.src =
          templateData.urls.design_pattern + "?random=" + Math.random(); // Add random query parameter to avoid CORS issues
      };
      strokeImg.src = templateData.urls.stroke + "?random=" + Math.random(); // Add random query parameter to avoid CORS issues
    };
    maskImg.src = templateData.urls.mask + "?random=" + Math.random(); // Add random query parameter to avoid CORS issues
  }, [templateData]);

  const renderCaptionText = (ctx) => {
    const canvas = canvasRef.current;
    ctx.font = `${templateData.caption.font_size}px Arial`;
    ctx.fillStyle = templateData.caption.text_color;
    ctx.textAlign = templateData.caption.alignment;
    const maxCharactersPerLine = templateData.caption.max_characters_per_line;
    const lineHeight = 24;
    const x = templateData.caption.position.x;
    let y = templateData.caption.position.y;
    const lineSpacing = 20; // Adjust spacing between lines as needed

    const words = inputText.split(" ");
    let line = "";
    // let y = templateData.caption.position.y;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > canvas.width / 2 && i > 0) {
        ctx.fillText(line, templateData.caption.position.x, y);
        line = words[i] + " ";
        y += lineHeight + lineSpacing; // Add line spacing
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, templateData.caption.position.x, y);
  };

  const handleInputforCTA = (e) => {
    const text = e.target.value;
    setInputTextforCTA(text);
  };
  const handleInput = (e) => {
    const text = e.target.value;
    setInputText(text);
  };

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
        ctx.drawImage(img, 56, 442, 970, 600);
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
              ref={canvasRef}
              height={1080}
              width={1080}
              style={{
                height: 400,
                width: 400,
                backgroundColor: "#FFF",
                zIndex: 1,
              }}
              id="canvas"
              className="scaled-canvas"
            ></canvas>
            {inputTextforCTA && (
              <button style={ctaButtonStyle}>{inputTextforCTA}</button>
            )}
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
                <span className="image-icon">
                  <img
                    width="25"
                    height="25"
                    src="https://img.icons8.com/sf-ultralight/25/gallery.png"
                    alt="gallery"
                  />
                </span>
                <span className="image-text">
                  Change the ad creative image.
                </span>
                <label className="custom-file-upload">
                  <span>Select file.</span>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={onChangeFile}
                  ></input>
                </label>
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
                  value={inputText}
                  id="caption-input"
                  placeholder="Enter caption"
                  onChange={handleInput}
                ></input>
              </div>
              <div className="content-emoji-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#f9a825"
                    d="M24.5,12L24.5,12c-1.381,0-2.5-1.119-2.5-2.5v-3C22,5.119,23.119,4,24.5,4h0 C25.881,4,27,5.119,27,6.5v3C27,10.881,25.881,12,24.5,12z"
                  ></path>
                  <path
                    fill="#f9a825"
                    d="M24.5,33L24.5,33c-1.381,0-2.5-1.119-2.5-2.5v-13c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v13C27,31.881,25.881,33,24.5,33z"
                  ></path>
                  <path
                    fill="#f9a825"
                    d="M24.5,44L24.5,44c-1.381,0-2.5-1.119-2.5-2.5v-3c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v3C27,42.881,25.881,44,24.5,44z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M15.5,36L15.5,36c-1.381,0-2.5-1.119-2.5-2.5v-3c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v3C18,34.881,16.881,36,15.5,36z"
                  ></path>
                  <path
                    fill="#43a047"
                    d="M33.5,20L33.5,20c-1.381,0-2.5-1.119-2.5-2.5v-3c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v3C36,18.881,34.881,20,33.5,20z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M15.5,25L15.5,25c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v9C18,23.881,16.881,25,15.5,25z"
                  ></path>
                  <path
                    fill="#43a047"
                    d="M33.5,37L33.5,37c-1.381,0-2.5-1.119-2.5-2.5v-9c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v9C36,35.881,34.881,37,33.5,37z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M6.5,28L6.5,28C5.119,28,4,26.881,4,25.5v-3C4,21.119,5.119,20,6.5,20h0C7.881,20,9,21.119,9,22.5v3 C9,26.881,7.881,28,6.5,28z"
                  ></path>
                  <path
                    fill="#1e88e5"
                    d="M42.5,28L42.5,28c-1.381,0-2.5-1.119-2.5-2.5v-3c0-1.381,1.119-2.5,2.5-2.5h0 c1.381,0,2.5,1.119,2.5,2.5v3C45,26.881,43.881,28,42.5,28z"
                  ></path>
                </svg>
              </div>
            </div>

            {/* CTA Selector */}
            <div className="cta-selector">
              <div className="input-container">
                <label htmlFor="cta-input">CTA</label>
                <input
                  type="text"
                  id="cta-input"
                  placeholder="Enter call to action"
                  onChange={handleInputforCTA}
                  value={inputTextforCTA}
                ></input>
              </div>
            </div>

            {/* Color Selector */}
            <div className="color-selector">
              <div className="color-picker-container">
                <label htmlFor="background-color">Select a color</label>
                <div className="color-picker-wrapper">
                  <div className="color-history">{renderColorHistory()}</div>
                  <button onClick={toggleColorPicker}>+</button>
                  {colorPickerOpen && (
                    <SketchPicker
                      className="color-picker"
                      color={selectedColor}
                      onChange={handleColorChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CanvasEditor;
