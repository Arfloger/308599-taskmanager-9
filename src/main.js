import {getTask} from "../src/data.js";
import {createMenuTemplate} from "../src/components/site-menu.js";
import {createSearchTemplate} from "../src/components/site-search.js";
import {getFilters} from "../src/components/site-filter.js";
import {createCardEditTemplate} from "../src/components/site-card-edit.js";
import {createCardTemplate} from "../src/components/site-card.js";
import {createLoadMoreTemplate} from "../src/components/site-load-more.js";

const MAX_CARD_TO_SHOW = 8;
const QUANTITY_CARD = 16;
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
let tasksOnPage = 0;
let leftCardsToRender = 0;

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

const showEditTask = (insertPlace, tasksArr) => {
  insertPlace.insertAdjacentHTML(
      `beforeend`,
      createCardEditTemplate(tasksArr[0])
  );
};

const showTasks = (insertPlace, tasksArr) => {
  insertPlace.insertAdjacentHTML(
      `beforeend`,
      tasksArr
      .map(createCardTemplate)
      .slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW)
      .join(``)
  );

  tasksOnPage += MAX_CARD_TO_SHOW;
  leftCardsToRender = QUANTITY_CARD - tasksOnPage;

  if (leftCardsToRender <= 0) {
    loadMoreButtonElement.classList.add(`visually-hidden`);
    loadMoreButtonElement.removeEventListener(`click`, onLoadMoreButtonClick);
  }
};

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

  return filterArr;
};

const renderFilters = (container, countFilterArr) => {
  let convertFilters = [];

  for (let [key, value] of Object.entries(countFilterArr)) {
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
};

const init = () => {
  const tasks = createTasks(QUANTITY_CARD);
  const currentCountFilters = getFilterCounts(tasks, filters);
  const onLoadMoreButtonClick = () => {
    showTasks(boardTasksElement, tasks);
  };
  leftCardsToRender = tasks.length - tasksOnPage;

  renderElement(menuElement, createMenuTemplate);
  renderElement(mainElement, createSearchTemplate);

  renderFilters(mainElement, currentCountFilters);
  createBoardElelement();

  showEditTask(boardTasksElement, tasks);
  showTasks(boardTasksElement, tasks);
  renderElement(boardElement, createLoadMoreTemplate);

  const loadMoreButtonElement = document.querySelector(`.load-more`);
  loadMoreButtonElement.addEventListener(`click`, onLoadMoreButtonClick);
};

init();
