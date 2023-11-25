export function getContrast({ fg, bg }) {
  const isDarkMode = matchMedia("(prefers-color-scheme: dark)").matches;
  const pageBG = isDarkMode ? "#000" : "#fff";
  const computedBG = colorToRGB({ fg: bg, bg: pageBG });
  const computedFG = colorToRGB({ fg, bg: computedBG });
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
function colorToRGB({ fg, bg }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Big array of [r,g,b,a,r,g,b,a] values, but we only need the first pixel
  const [r, g, b] = data;
  return { r, g, b };
}
