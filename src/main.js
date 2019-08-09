import {createSiteMenuTemplate} from '../src/components/site-menu.js';
import {createSiteSearchTemplate} from '../src/components/site-search.js';
import {createSiteFilterTemplate} from '../src/components/site-filter.js';
import {createSiteCardEditTemplate} from '../src/components/site-card-edit.js';
import {createSiteCardTemplate} from '../src/components/site-card.js';
import {createLoadMoreTemplate} from '../src/components/site-load-more.js';

const menuElement = document.querySelector(`.main__control`);
const mainElement = document.querySelector(`.main`);

const renderSomeElement = (insertPlace, callback, iteration = 1) => {
  if (iteration !== 1) {
    for (let i = 0; i < iteration; i++) {
      insertPlace.insertAdjacentHTML(`beforeend`, callback());
    }
    return;
  }
  insertPlace.insertAdjacentHTML(`beforeend`, callback());
};

const createBoardElelement = () => {
  const boardElement = document.createElement(`section`);
  const boardTasksElement = document.createElement(`div`);

  boardElement.classList.add(`board`, `container`);
  mainElement.appendChild(boardElement);

  boardTasksElement.classList.add(`board__tasks`);
  boardElement.appendChild(boardTasksElement);

  renderSomeElement(boardTasksElement, createSiteCardEditTemplate);
  renderSomeElement(boardTasksElement, createSiteCardTemplate, 3);
  renderSomeElement(boardElement, createLoadMoreTemplate);
};

const init = () => {
  renderSomeElement(menuElement, createSiteMenuTemplate);
  renderSomeElement(mainElement, createSiteSearchTemplate);
  renderSomeElement(mainElement, createSiteFilterTemplate);

  createBoardElelement();
};

init();
