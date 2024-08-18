import { toHex } from "../contrast.js";
import { getContrast } from "../contrast.js";

export class CcFormOutputItem extends HTMLElement {
  static get observedAttributes() {
    return ["data-foreground", "data-background"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[name] = newValue;
    this.#render();
  }

  get #template() {
    return document
      .querySelector("#template--cc-form-output-item")
      .content.cloneNode(true);
  }

  get foreground() {
    return this.dataset.foreground || "";
  }

  get background() {
    return this.dataset.background || "";
  }

  connectedCallback() {
    this.#render();
  }

  #render() {
    this.innerHTML = "";
    const { foreground, background } = this;
    if (!(foreground && background)) {
      return;
    }
    const fg = toHex(foreground);
    const bg = toHex(background);
    this.append(this.#template);
    this.style.setProperty("--foreground", fg);
    this.style.setProperty("--background", bg);
    this.querySelector("[data-name=fg]").textContent = fg;
    this.querySelector("[data-name=bg]").textContent = bg;
    this.querySelector("[data-name=contrast]").textContent = getContrast({
      background: bg,
      foreground: fg,
    }).toFixed(2);
  }
}

customElements.define("cc-form-output-item", CcFormOutputItem);
