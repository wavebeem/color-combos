import { split } from "../util.js";

export class CcForm extends HTMLElement {
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
    const params = new URLSearchParams(location.search);
    const fg = params.get("fg") || "";
    const bg = params.get("bg") || "";
    const groupBy = params.get("group_by") || "background";
    this.#inputFG.value = fg;
    this.#inputBG.value = bg;
    for (const radio of this.#groupByButtons) {
      radio.checked = radio.value === groupBy;
    }
    this.#update();
  }
}

customElements.define("cc-form", CcForm);
