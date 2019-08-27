import {render, unrender} from "./utils.js";
import {Position} from "./const.js";

import Menu from "../src/components/menu.js";
import Search from "../src/components/search.js";
import Filter from "../src/components/filter.js";
import Task from "./components/card.js";
import TaskEdit from "./components/card-edit.js";
import LoadMore from "./components/load-more.js";
import Message from "./components/message.js";
import {getTask} from "../src/data.js";

let QUANTITY_CARD = 3;
const MAX_CARD_TO_SHOW = 8;
const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);
const boardElement = document.createElement(`section`);
const boardTasksElement = document.createElement(`div`);
const taskMocks = new Array(QUANTITY_CARD).fill(``).map(getTask);
let tasksContainer;
let loadMoreButtonElement;
let tasksOnPage = 0;
let leftCardsToRender = 0;

const createBoardElelement = () => {
  boardElement.classList.add(`board`, `container`);
  mainElement.appendChild(boardElement);

  boardTasksElement.classList.add(`board__tasks`);
  boardElement.appendChild(boardTasksElement);
};

const onLoadMoreButtonClick = () => {
  showTasks(taskMocks);
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

const renderLoadMore = () => {
  const loadMore = new LoadMore();
  render(boardElement, loadMore.getElement(), Position.BEFOREEND);
};

const renderMessage = () => {
  const message = new Message();
  render(boardTasksElement, message.getElement(), Position.BEFOREEND);
};

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__save`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(tasksContainer, task.getElement(), Position.BEFOREEND);
};

const showTasks = (tasksArr) => {

  for (let i = 0; i < tasksArr.length; i++) {

    if (tasksArr[i].isArchive) {
      tasksArr.splice(i, 1);
      i--;
    }
  }

  if (tasksArr.length === 0) {
    renderMessage();
    unrender(loadMoreButtonElement);
    return;
  }

  if (tasksArr.length <= MAX_CARD_TO_SHOW) {
    tasksArr.slice(0).map(renderTask)
    .join(``);
    unrender(loadMoreButtonElement);
    return;
  }

  tasksArr.slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW).map(renderTask)
  .join(``);

  tasksOnPage = tasksOnPage + MAX_CARD_TO_SHOW;
  leftCardsToRender = tasksArr.length - tasksOnPage;

  if (leftCardsToRender <= 0) {
    loadMoreButtonElement.removeEventListener(`click`, onLoadMoreButtonClick);
    unrender(loadMoreButtonElement);
  }
};

const init = () => {
  renderMenu();
  renderSearch();
  renderFilter();
  createBoardElelement();
  tasksContainer = document.querySelector(`.board__tasks`);
  renderLoadMore();
  loadMoreButtonElement = document.querySelector(`.load-more`);
  loadMoreButtonElement.addEventListener(`click`, onLoadMoreButtonClick);
  leftCardsToRender = taskMocks.length - tasksOnPage;
  showTasks(taskMocks);

};

init();
