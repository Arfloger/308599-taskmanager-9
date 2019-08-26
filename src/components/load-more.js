import {createElement} from "../utils.js";

export default class LoadMore {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <button class="load-more" type="button">load more</button>
  `.trim();
  }
}
