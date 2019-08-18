export const createFilterTemplate = ({titles, counts}) => {
  return `
    <section class="main__filter filter container">
  ${titles.map((title, index) =>
    `<input type="radio" id="filter__${title}" class="filter__input visually-hidden" name="filter" checked="">
    <label for="filter__all" class="filter__label"> ${title}
      <span class="filter__all-count">${counts[index]}</span>
    </label>`).join(``)}
    </section>
  `;
};
