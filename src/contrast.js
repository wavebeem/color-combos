import Color from "/lib/color.js";

export function getContrast({ foreground, background, algorithm = "WCAG21" }) {
  const isDarkMode = matchMedia("(prefers-color-scheme: dark)").matches;
  const pageBG = new Color(isDarkMode ? "#000" : "#fff");
  const bg = new Color(background).to("srgb");
  const computedBG = bg.mix(pageBG, 1 - bg.alpha);
  const fg = new Color(foreground).to("srgb");
  const computedFG = fg.mix(computedBG, 1 - fg.alpha);
  return computedBG.contrast(computedFG, algorithm);
}

export function toHex(color) {
  return new Color(color).to("srgb").toString({ format: "hex" });
}
