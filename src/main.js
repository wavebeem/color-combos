const html = String.raw;

// This is all a big nasty mess without a JS framework, lol
function update() {
  resize($("#fg"));
  resize($("#bg"));
  const groupBy = $("[name=group-by]:checked").value;
  const fgs = $("#fg").value;
  const bgs = $("#bg").value;
  const container = $("#preview-container");
  const url = new URL(location.href);
  url.searchParams.set("fg", fgs);
  url.searchParams.set("bg", bgs);
  url.searchParams.set("group_by", groupBy);
  history.replaceState(null, "", url.href);
  container.innerHTML = html`
    <p class="mh3 bit-card">
      <span role="presentation">&larr;</span> Enter at least one foreground
      color and background color to continue
    </p>
  `;
  const combos = Array.from(getCombinations({ fgs, bgs, groupBy }));
  if (combos.length > 0) {
    container.innerHTML = "";
  }
  for (const { fg, bg } of combos) {
    const contrast = getContrast({ fg, bg });
    const template = $("#preview-template");
    const frag = template.content.cloneNode(true);
    const node = document.createElement("div");
    node.appendChild(frag);
    node.style.setProperty("color", fg);
    node.style.setProperty("background", bg);
    $("[data-name=fg]", node).textContent = fg;
    $("[data-name=bg]", node).textContent = bg;
    $("[data-name=contrast]", node).textContent = contrast.toFixed(1);
    container.appendChild(node);
  }
}

// Remember manually syncing the UI with data? Haha, good times
function load() {
  const {
    fg = "",
    bg = "",
    group_by = "background",
  } = Object.fromEntries(Array.from(new URLSearchParams(location.search)));
  $("#fg").value = fg;
  $("#bg").value = bg;
  for (const radio of $$("[name=group-by]")) {
    radio.checked = radio.value === group_by;
  }
  update();
}

// tinycolor doesn't properly support color blending, and even when you hack it
// together, the results are just slightly inaccurate. Anything less than
// perfection is unacceptable for this. So let's actually blend the colors
// together on a canvas element and measure them.
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1;
canvas.height = 1;
function getContrast({ fg, bg }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Big array of [r,g,b,a,r,g,b,a] values, but we only need the first pixel
  const [r, g, b] = data;
  return tinycolor.readability(bg, { r, g, b });
}

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function split(str) {
  return str
    .trim()
    .split(/\n+/)
    .filter((x) => x);
}

function* getCombinations({ fgs, bgs, groupBy }) {
  if (groupBy === "foreground") {
    for (const fg of split(fgs)) {
      for (const bg of split(bgs)) {
        yield { fg, bg };
      }
    }
  } else {
    for (const bg of split(bgs)) {
      for (const fg of split(fgs)) {
        yield { fg, bg };
      }
    }
  }
}

function resize(textarea) {
  const value = textarea.value.split(/\n/).length;
  const rows = Math.max(4, value);
  textarea.rows = rows;
}

for (const element of $$("input, textarea")) {
  element.addEventListener("input", update);
  element.addEventListener("checked", update);
}

load();
