// https://developers.google.com/web/fundamentals/web-components/best-practices

import { split, getCombinations } from "../util.js";
import { CcBaseElement } from "./cc-base-element.js";
import { CcFormOutputItem } from "./cc-form-output-item.js";

export class CcFormOutput extends CcBaseElement {
  static get fields() {
    return [
      {
        name: "foregrounds",
        type: "string",
      },
      {
        name: "backgrounds",
        type: "string",
      },
      {
        name: "group-by",
        type: "string",
      },
    ];
  }

  get #templateEmpty() {
    return document
      .querySelector("#template--cc-form-output")
      .content.cloneNode(true);
  }

  render() {
    const combos = Array.from(
      getCombinations({
        foregrounds: split(this.foregrounds ?? ""),
        backgrounds: split(this.backgrounds ?? ""),
        groupBy: this.groupBy ?? "background",
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
