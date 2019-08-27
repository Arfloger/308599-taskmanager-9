import {AbstractComponent} from "../components/abstract-component.js";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
