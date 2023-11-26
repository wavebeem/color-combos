import { split } from "../util.js";

class HTMLCcFormElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener("input", this.#update);
    this.addEventListener("checked", this.#update);
    this.addEventListener("submit", this.#preventDefault);
    this.#load();
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.#update);
    this.removeEventListener("checked", this.#update);
    this.removeEventListener("submit", this.#preventDefault);
  }

  get #inputFG() {
    return this.querySelector("[name='fg']");
  }

  get #inputBG() {
    return this.querySelector("[name='bg']");
  }

  get #formOutput() {
    return document.querySelector("cc-form-output");
  }

  get #groupByButtons() {
    return this.querySelectorAll("[name='group-by']");
  }

  get #groupByValue() {
    return this.querySelector("[name='group-by']:checked").value;
  }

  #preventDefault = (event) => {
    event.preventDefault();
  };

  #update() {
    const groupBy = this.#groupByValue;
    const fgs = split(this.#inputFG.value).join("\n");
    const bgs = split(this.#inputBG.value).join("\n");

    // Update URL
    const url = new URL(location.href);
    url.searchParams.set("fg", fgs);
    url.searchParams.set("bg", bgs);
    url.searchParams.set("group_by", groupBy);
    history.replaceState(null, "", url.href);

    // Update output
    const formOutput = this.#formOutput;
    formOutput.dataset.foregrounds = fgs;
    formOutput.dataset.backgrounds = bgs;
    formOutput.dataset.groupBy = groupBy;
  }

  #load() {
    const {
      fg = "",
      bg = "",
      group_by = "background",
    } = parseQueryString(location.search);
    this.#inputFG.value = fg;
    this.#inputBG.value = bg;
    for (const radio of this.#groupByButtons) {
      radio.checked = radio.value === group_by;
    }
    this.#update();
  }
}

function parseQueryString(query) {
  return Object.fromEntries(Array.from(new URLSearchParams(query)));
}

customElements.define("cc-form", HTMLCcFormElement);
