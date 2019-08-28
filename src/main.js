import {render} from "./utils.js";
import {Position} from "./const.js";

import BoardController from "../src/components/board-controller.js";
import Menu from "../src/components/menu.js";
import Search from "../src/components/search.js";
import Filter from "../src/components/filter.js";
import {getTask} from "../src/data.js";

let QUANTITY_CARD = 20;
const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);
const taskMocks = new Array(QUANTITY_CARD).fill(``).map(getTask);

const boardController = new BoardController(mainElement, taskMocks);

const getFilterCounts = (taskArr, filterArr) => {
  const currentDate = new Date();
  const today = new Date().toLocaleDateString();

  taskArr.forEach((task) => {
    let taskDay = new Date(task.dueDate).toLocaleDateString();

    filterArr.overdue = task.dueDate < currentDate ? filterArr.overdue += 1 : filterArr.overdue;

    filterArr.today = taskDay === today ? filterArr.today += 1 : filterArr.today;

    filterArr.favorites = task.isFavorite ? filterArr.favorites += 1 : filterArr.favorites;

    filterArr.tags = Array.from(task.tags).length !== 0 ? filterArr.tags += 1 : filterArr.tags;

    filterArr.repeating = Object.values(task.repeatingDays).indexOf(true) !== -1 ? filterArr.repeating += 1 : filterArr.repeating;

    filterArr.archive = task.isArchive ? filterArr.archive += 1 : filterArr.archive;
  });

  filterArr.all = filterArr.all - filterArr.archive;

  return filterArr;
};

const renderFilter = () => {
  const filtersList = {
    all: QUANTITY_CARD,
    overdue: 0,
    today: 0,
    favorites: 0,
    repeating: 0,
    tags: 0,
    archive: 0,
  };
  const currentCountFilters = getFilterCounts(taskMocks, filtersList);
  const filters = [];

  for (let [key, value] of Object.entries(currentCountFilters)) {
    filters.push({
      title: key,
      count: value
    });
  }

  const filter = new Filter(filters);
  render(mainElement, filter.getElement(), Position.BEFOREEND);
};

const renderSearch = () => {
  const search = new Search();
  render(mainElement, search.getElement(), Position.BEFOREEND);
};

const renderMenu = () => {
  const menu = new Menu();
  render(menuElement, menu.getElement(), Position.BEFOREEND);
};

const init = () => {
  renderMenu();
  renderSearch();
  renderFilter();
  boardController.init();
};

init();
