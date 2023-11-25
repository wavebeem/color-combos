class HTMLCcTextareaResizerElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener("input", this.#onInput);
    for (const textarea of this.querySelectorAll("textarea")) {
      this.#resize(textarea);
    }
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.#onInput);
  }

  #onInput = (event) => {
    this.#resize(event.target);
  };

  #resize(textarea) {
    const value = textarea.value.split(/\n/).length;
    const rows = Math.max(4, value);
    textarea.rows = rows;
  }
}
customElements.define("cc-textarea-resizer", HTMLCcTextareaResizerElement);
