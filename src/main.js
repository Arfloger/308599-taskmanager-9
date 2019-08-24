import {Position, render} from "./utils.js";

import Menu from "../src/components/menu.js";
import Search from "../src/components/search.js";
import Filter from "../src/components/filter.js";
import Task from "./components/card.js";
import TaskEdit from "./components/card-edit.js";
import LoadMore from "./components/load-more.js";
import {getTask} from "../src/data.js";


// const MAX_CARD_TO_SHOW = 8;
const QUANTITY_CARD = 16;
const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);
const boardElement = document.createElement(`section`);
const boardTasksElement = document.createElement(`div`);
let tasksContainer;
// let tasksOnPage = 0;
// let leftCardsToRender = 0;


// const showTasks = (insertPlace, tasksArr) => {
//   insertPlace.insertAdjacentHTML(
//       `beforeend`,
//       tasksArr
//       .map(createCardTemplate)
//       .slice(tasksOnPage, tasksOnPage + MAX_CARD_TO_SHOW)
//       .join(``)
//   );

//   tasksOnPage += MAX_CARD_TO_SHOW;
//   leftCardsToRender = QUANTITY_CARD - tasksOnPage;

//   if (leftCardsToRender <= 0) {
//     loadMoreButtonElement.classList.add(`visually-hidden`);
//     loadMoreButtonElement.removeEventListener(`click`, onLoadMoreButtonClick);
//   }
// };

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

const createBoardElelement = () => {
  boardElement.classList.add(`board`, `container`);
  mainElement.appendChild(boardElement);

  boardTasksElement.classList.add(`board__tasks`);
  boardElement.appendChild(boardTasksElement);
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
    });

  taskEdit.getElement().querySelector(`textarea`).
  addEventListener(`focus`, () => {
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  taskEdit.getElement().querySelector(`textarea`).
  addEventListener(`blur`, () => {
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

const taskMocks = new Array(QUANTITY_CARD).fill(``).map(getTask);

const init = () => {
  renderMenu();
  renderSearch();
  renderFilter();
  createBoardElelement();
  tasksContainer = document.querySelector(`.board__tasks`);
  taskMocks.forEach((taskMock) => renderTask(taskMock));
  renderLoadMore();

  // const onLoadMoreButtonClick = () => {
  // showTasks(boardTasksElement, tasks);
  // };
  // leftCardsToRender = tasks.length - tasksOnPage;
  // showEditTask(boardTasksElement, tasks);
  // showTasks(boardTasksElement, tasks);
  // renderElement(boardElement, createLoadMoreTemplate);

  // const loadMoreButtonElement = document.querySelector(`.load-more`);
  // loadMoreButtonElement.addEventListener(`click`, onLoadMoreButtonClick);
};

init();
