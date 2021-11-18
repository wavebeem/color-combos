function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function update() {
  resize($("#fg"));
  resize($("#bg"));
  const groupBy = $("[name=group-by]:checked").value;
  const fgs = $("#fg").value;
  const bgs = $("#bg").value;
  const container = $("#preview-container");
  container.innerHTML = "";
  for (const { fg, bg } of getCombinations({ fgs, bgs, groupBy })) {
    const contrast = tinycolor.readability(fg, bg);
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
  const rows = Math.max(4, value + 1);
  textarea.rows = rows;
}

for (const element of $$("input")) {
  element.addEventListener("input", update);
  element.addEventListener("checked", update);
}
update();
