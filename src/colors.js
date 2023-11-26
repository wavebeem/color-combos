export function getContrast({ foreground, background }) {
  const isDarkMode = matchMedia("(prefers-color-scheme: dark)").matches;
  const pageBG = isDarkMode ? "#000" : "#fff";
  const computedBG = colorToRGB({
    foreground: background,
    background: pageBG,
  });
  const computedFG = colorToRGB({
    foreground: foreground,
    background: computedBG,
  });
  return tinycolor.readability(computedBG, computedFG);
}

// tinycolor doesn't properly support color blending, and even when you hack it
// together, the results are just slightly inaccurate. Anything less than
// perfection is unacceptable for this. So let's actually blend the colors
// together on a canvas element and measure them.
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1;
canvas.height = 1;

function colorToRGB({ foreground, background }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = foreground;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Big array of [r,g,b,a,r,g,b,a] values, but we only need the first pixel
  const [r, g, b] = data;
  return { r, g, b };
}
