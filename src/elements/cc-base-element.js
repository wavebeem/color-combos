export class CcBaseElement extends HTMLElement {
  constructor() {
    super();
    for (const field of this.constructor.fields) {
      const propName = kebabToCamel(field.name);
      let get = () => {
        return this._fieldValues[field.name];
      };
      let set = (value) => {
        this._markDirty();
        this._fieldValues[field.name] = value;
      };
      if (field.type === "string") {
        get = () => {
          if (!this.hasAttribute(field.name)) {
            return undefined;
          }
          return this.getAttribute(field.name);
        };
        set = (value) => {
          this._markDirty();
          if (value == undefined) {
            this.removeAttribute(field.name);
            return;
          }
          this.setAttribute(field.name, value);
        };
      }
      if (field.type === "number") {
        get = () => {
          if (!this.hasAttribute(field.name)) {
            return undefined;
          }
          return Number(this.getAttribute(field.name));
        };
        set = (value) => {
          this._markDirty();
          if (value == undefined) {
            this.removeAttribute(field.name);
            return;
          }
          this.setAttribute(field.name, value);
        };
      }
      if (field.type === "boolean") {
        get = () => {
          return this.hasAttribute(field.name);
        };
        set = (value) => {
          this._markDirty();
          if (value == undefined) {
            this.removeAttribute(field.name);
            return;
          }
          this.setAttribute(field.name, value);
        };
      }
      if (this[propName] != undefined) {
        set(this[propName]);
      }
      Object.defineProperty(this, propName, {
        get,
        set,
        enumerable: true,
        configurable: true,
      });
    }
  }

  connectedCallback() {
    this.render();
  }

  _fieldValues = {};

  _isDirty = false;

  _markDirty() {
    try {
      this.onUpdate();
    } finally {
      if (this._isDirty) {
        return;
      }
      this._isDirty = true;
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this._isDirty = false;
          this.render();
        }
      });
    }
  }

  onUpdate() {}

  static get fields() {
    throw new Error("Not implemented");
  }

  static get observedAttributes() {
    return this.fields.map((f) => f.name);
  }

  render() {
    throw new Error("Not implemented");
  }
}

function kebabToCamel(kebab) {
  return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
