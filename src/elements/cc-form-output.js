// https://developers.google.com/web/fundamentals/web-components/best-practices

import { getContrast } from "../colors.js";
import { split, getCombinations } from "../util.js";

class HTMLCcFormOutputElement extends HTMLElement {
  static get observedAttributes() {
    return ["data-foregrounds", "data-backgrounds", "data-group-by"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[name] = newValue;
    this.#render();
  }

  get #templateEmpty() {
    return document
      .querySelector("#preview-empty-template")
      .content.cloneNode(true);
  }

  get #template() {
    return document.querySelector("#preview-template").content.cloneNode(true);
  }

  get foregrounds() {
    return this.dataset.foregrounds || "";
  }

  get backgrounds() {
    return this.dataset.backgrounds || "";
  }

  get groupBy() {
    return this.dataset.groupBy || "background";
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    const combos = Array.from(
      getCombinations({
        foregrounds: split(this.foregrounds),
        backgrounds: split(this.backgrounds),
        groupBy: this.groupBy,
      })
    );
    this.innerHTML = "";
    if (combos.length === 0) {
      this.append(this.#templateEmpty);
      return;
    }
    for (const { fg, bg } of combos) {
      const contrast = getContrast({ fg, bg });
      const node = document.createElement("div");
      // TODO: Make a <cc-form-output-item> element
      node.append(this.#template);
      node.style.setProperty("color", fg);
      node.style.setProperty("background", bg);
      node.querySelector("[data-name=fg]").textContent = fg;
      node.querySelector("[data-name=bg]").textContent = bg;
      node.querySelector("[data-name=contrast]").textContent =
        contrast.toFixed(1);
      this.append(node);
    }
  }
}

customElements.define("cc-form-output", HTMLCcFormOutputElement);
