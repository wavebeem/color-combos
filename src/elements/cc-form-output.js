// https://developers.google.com/web/fundamentals/web-components/best-practices

import { split, getCombinations } from "../util.js";
import { CcFormOutputItem } from "./cc-form-output-item.js";

export class CcFormOutput extends HTMLElement {
  static get observedAttributes() {
    return ["data-foregrounds", "data-backgrounds", "data-group-by"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[name] = newValue;
    this.#render();
  }

  get #templateEmpty() {
    return document
      .querySelector("#template--cc-form-output")
      .content.cloneNode(true);
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
      const item = new CcFormOutputItem();
      item.dataset.foreground = fg;
      item.dataset.background = bg;
      this.append(item);
    }
  }
}

customElements.define("cc-form-output", CcFormOutput);
