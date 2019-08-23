const getFilter = ({title, count}) => {
  return `
      ${`<input type="radio" id="filter__${title}" 
      class="filter__input visually-hidden" 
      name="filter" 
      checked="">
      <label for="filter__all" class="filter__label">${title}
      <span class="filter__all-count">${count}</span>
      </label>`}
 `;
};

export const getFilters = (filters) => {
  return `
    <section class="main__filter filter container"> 
      ${filters.map((filter) => getFilter(filter)).join(``)}
    </section>
  `;
};
