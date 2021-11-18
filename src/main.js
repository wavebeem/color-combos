// This is all a big nasty mess without a JS framework, lol
function update() {
  console.log(Date());
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

// Remember manually syncing the UI with data? Haha, good times
function load() {
  const {
    fg = "",
    bg = "",
    group_by = "background",
  } = Object.fromEntries(Array.from(new URLSearchParams(location.search)));
  console.log({ fg, bg, group_by });
  $("#fg").value = fg;
  $("#bg").value = bg;
  for (const radio of $$("[name=group-by]")) {
    radio.checked = radio.value === group_by;
  }
  update();
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
  const rows = Math.max(4, value + 1);
  textarea.rows = rows;
}

for (const element of $$("input, textarea")) {
  element.addEventListener("input", update);
  element.addEventListener("checked", update);
}

load();
