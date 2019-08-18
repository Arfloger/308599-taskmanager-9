import {getRandomValue} from "../src/utils";
import {getTask} from "../src/data.js";

import {createSiteMenuTemplate} from "../src/components/site-menu.js";
import {createSiteSearchTemplate} from "../src/components/site-search.js";
import {createSiteFilterTemplate} from "../src/components/site-filter.js";
import {createSiteCardEditTemplate} from "../src/components/site-card-edit.js";
import {createCardTemplate} from "../src/components/site-card.js";
import {createLoadMoreTemplate} from "../src/components/site-load-more.js";

const MAX_SHOW = 8;
const QUANTITY_CARD = getRandomValue(50);
const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);
const boardElement = document.createElement(`section`);
const boardTasksElement = document.createElement(`div`);
const tasks = [];
let TASKS_ON_PAGE = MAX_SHOW;
let LEFT_CARDS_TO_RENDER = tasks.length - TASKS_ON_PAGE;

const renderElement = (insertPlace, callback) => {
  insertPlace.insertAdjacentHTML(`beforeend`, callback());
};

const createTasks = (count) => {
  for (let i = 0; i <= count; i++) {
    tasks.push(getTask());
  }
  return tasks;
};

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

  TASKS_ON_PAGE = TASKS_ON_PAGE + MAX_SHOW;
  LEFT_CARDS_TO_RENDER = tasks.length - TASKS_ON_PAGE;

  if (LEFT_CARDS_TO_RENDER <= 0) {
    loadMoreButton.style.display = `none`;
    loadMoreButton.removeEventListener(`click`, onLoadMoreButtonClick);
  }
};

const createBoardElelement = () => {
  boardElement.classList.add(`board`, `container`);
  mainElement.appendChild(boardElement);

  boardTasksElement.classList.add(`board__tasks`);
  boardElement.appendChild(boardTasksElement);

  renderElement(boardTasksElement, createSiteCardEditTemplate);
  createTasks(QUANTITY_CARD);
  showTasks(boardTasksElement, tasks);
  renderElement(boardElement, createLoadMoreTemplate);
};

const init = () => {
  renderElement(menuElement, createSiteMenuTemplate);
  renderElement(mainElement, createSiteSearchTemplate);
  renderElement(mainElement, createSiteFilterTemplate);

  createBoardElelement();
};

init();

const loadMoreButton = document.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, onLoadMoreButtonClick);
