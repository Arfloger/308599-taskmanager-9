import {getTask} from "../src/data.js";

import {createSiteMenuTemplate} from "../src/components/site-menu.js";
import {createSiteSearchTemplate} from "../src/components/site-search.js";
import {getFilters} from "../src/components/site-filter.js";
import {createSiteCardEditTemplate} from "../src/components/site-card-edit.js";
import {createCardTemplate} from "../src/components/site-card.js";
import {createLoadMoreTemplate} from "../src/components/site-load-more.js";

const MAX_SHOW = 8;
// здесь необходим let, потому что в функции showTasks перезаписываются переменные, возникает ошибка типа
let TASKS_ON_PAGE = MAX_SHOW;
let QUANTITY_CARD = 25;

const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);
const boardElement = document.createElement(`section`);
const boardTasksElement = document.createElement(`div`);
const filters = {
  all: QUANTITY_CARD,
  overdue: 0,
  today: 0,
  favorites: 0,
  repeating: 0,
  tags: 0,
  archive: 0,
};

const renderElement = (insertPlace, callback) => {
  insertPlace.insertAdjacentHTML(`beforeend`, callback());
};

const createTasks = (count) => {
  const currentTasks = [];
  for (let i = 0; i < count; i++) {
    currentTasks.push(getTask());
  }
  return currentTasks;
};

const tasks = createTasks(QUANTITY_CARD);
let LEFT_CARDS_TO_RENDER = tasks.length - TASKS_ON_PAGE;

const onLoadMoreButtonClick = () => {
  showTasks(boardTasksElement, tasks);
};

const showTasks = (insertPlace, tasksArr) => {
  insertPlace.insertAdjacentHTML(
      `beforeend`,
      tasksArr
      .map(createCardTemplate)
      .slice(TASKS_ON_PAGE, TASKS_ON_PAGE + MAX_SHOW)
      .join(``)
  );

  TASKS_ON_PAGE += MAX_SHOW;
  LEFT_CARDS_TO_RENDER = tasks.length - TASKS_ON_PAGE;

  if (LEFT_CARDS_TO_RENDER <= 0) {
    loadMoreButtonElement.classList.add(`visually-hidden`);
    loadMoreButtonElement.removeEventListener(`click`, onLoadMoreButtonClick);
  }
};

const getFilterCounts = (taskArr, filterArr) => {
  const currentDate = new Date();
  const todayDate = new Date().getDay();

  taskArr.forEach((task) => {
    let taskDay = new Date(task.dueDate).getDay();

    filterArr.overdue = task.dueDate < currentDate ? filterArr.overdue += 1 : filterArr.overdue;

    filterArr.today = taskDay === todayDate ? filterArr.today += 1 : filterArr.today;
  });

  return filterArr;
};

const currentCountFilters = getFilterCounts(tasks, filters);

const renderFilters = (container) => {
  let convertFilters = [];

  for (let [key, value] of Object.entries(currentCountFilters)) {
    convertFilters.push({
      title: key,
      count: value
    });
  }

  container.insertAdjacentHTML(`beforeend`, getFilters(convertFilters));
};

const createBoardElelement = () => {
  boardElement.classList.add(`board`, `container`);
  mainElement.appendChild(boardElement);

  boardTasksElement.classList.add(`board__tasks`);
  boardElement.appendChild(boardTasksElement);

  renderElement(boardTasksElement, createSiteCardEditTemplate);
  showTasks(boardTasksElement, tasks);
  renderElement(boardElement, createLoadMoreTemplate);
};

const init = () => {
  renderElement(menuElement, createSiteMenuTemplate);
  renderElement(mainElement, createSiteSearchTemplate);

  renderFilters(mainElement);
  createBoardElelement();
};

init();

// не могу поместить ее выше, потому что она создается динамически после вызова функции
const loadMoreButtonElement = document.querySelector(`.load-more`);
loadMoreButtonElement.addEventListener(`click`, onLoadMoreButtonClick);
