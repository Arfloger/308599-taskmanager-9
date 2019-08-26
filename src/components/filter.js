import {createElement} from "../utils.js";

export default class Filter {
  constructor(filters) {
    this._filters = filters;
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
    <section class="main__filter filter container"> 
      ${this._filters.map((filter) => `<input type="radio" id="filter__${filter.title}" 
      class="filter__input visually-hidden" 
      name="filter" 
      checked=""
      ${filter.count === 0 ? `disabled` : ``}>
      <label for="filter__all" class="filter__label">${filter.title}
      <span class="filter__all-count">${filter.count}</span>
      </label>`).join(``)}
    </section>
  `.trim();
  }
}
