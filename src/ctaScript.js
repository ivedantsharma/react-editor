import templateData from "./templateData.json";

const ctaScript = () => {
  const drawButton = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Clear area occupied by previous CTA button
    ctx.clearRect(
      templateData.cta.position.x,
      templateData.cta.position.y,
      templateData.cta.width,
      templateData.cta.height
    );

    // Draw new CTA button
    ctx.fillStyle = templateData.cta.background_color;
    ctx.fillRect(
      templateData.cta.position.x,
      templateData.cta.position.y,
      templateData.cta.width,
      templateData.cta.height
    );

    ctx.font = `${templateData.cta.font_size}px Arial`;
    ctx.fillStyle = templateData.cta.text_color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      templateData.cta.text,
      templateData.cta.position.x + templateData.cta.width / 2,
      templateData.cta.position.y + templateData.cta.height / 2
    );
  };

  // Event listener for input changes
  document.getElementById("cta-input").addEventListener("input", (event) => {
    const userInput = event.target.value;
    templateData.cta.text = userInput;
    drawButton();
  });

  // Initial drawing
  drawButton();
};

export default ctaScript;
