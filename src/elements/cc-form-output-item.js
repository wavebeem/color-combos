import { getContrast } from "../colors.js";

class HTMLCcFormOutputItemElement extends HTMLElement {
  static get observedAttributes() {
    return ["data-foreground", "data-background"];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    this[name] = newValue;
    this.#render();
  }

  get #template() {
    return document.querySelector("#preview-template").content.cloneNode(true);
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
    this.append(this.#template);
    this.style.setProperty("--foreground", foreground);
    this.style.setProperty("--background", background);
    this.querySelector("[data-name=fg]").textContent = foreground;
    this.querySelector("[data-name=bg]").textContent = background;
    this.querySelector("[data-name=contrast]").textContent = getContrast({
      foreground,
      background,
    }).toFixed(1);
  }
}

customElements.define("cc-form-output-item", HTMLCcFormOutputItemElement);
