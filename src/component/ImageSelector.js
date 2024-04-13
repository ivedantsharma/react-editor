document.querySelector("input").oninput = async (evt) => {
    try {
      const file = evt.target.files[0];
      const bitmap = await createImageBitmap(file);
      const canvas = document.querySelector("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0);
    }
    catch(err) {
      console.error(err);
    }
  };