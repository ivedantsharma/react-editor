import templateData from "./templateData.json";

const canvasScript = () => {
  const drawText = (ctx, textData) => {
    // Clear the area where the text will be drawn
    ctx.clearRect(
      textData.position.x,
      textData.position.y - textData.font_size, // Adjust Y position if needed
      ctx.measureText(textData.text).width,
      textData.font_size
    );
    // Draw the new text
    ctx.font = `${textData.font_size}px Arial`;
    ctx.fillStyle = textData.text_color;
    ctx.textAlign = textData.alignment;
    ctx.fillText(textData.text, textData.position.x, textData.position.y);
  };

  const drawImageAndText = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Draw image
    const img = new Image();
    ctx.globalCompositeOperation = "source-over";
    img.onload = () => {
      ctx.drawImage(
        img,
        templateData.image_mask.x,
        templateData.image_mask.y,
        templateData.image_mask.width,
        templateData.image_mask.height
      );

      // Draw caption
      drawText(ctx, templateData.caption);
    };
    img.src = templateData.urls.mask;
  };

  // Function to update text based on user input
  // Function to update text based on user input
  // Function to update text based on user input
  const updateText = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior

      const userInput = document.getElementById("caption-input").value;
      templateData.caption.text = userInput;

      if (userInput.trim() !== "") {
        // Clear entire canvas
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw everything on the canvas except the text
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(
            img,
            templateData.image_mask.x,
            templateData.image_mask.y,
            templateData.image_mask.width,
            templateData.image_mask.height
          );

          // Redraw caption
          drawText(ctx, templateData.caption);
        };
        img.src = templateData.urls.mask;
      }
    }
  };

  // Listen for keypress events on the input field
  const inputField = document.getElementById("caption-input");
  inputField.addEventListener("keypress", updateText);

  // Initial drawing
  drawImageAndText();
};

export default canvasScript;
