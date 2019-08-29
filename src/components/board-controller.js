import {Position} from "../const.js";
import {render, unrender} from "../utils.js";
import Board from "./board.js";
import TaskList from "./task-list.js";
import Message from "./message.js";
import Task from "./card.js";
import TaskEdit from "./card-edit.js";
import LoadMore from "./load-more.js";

export default class BoardController {
  constructor(container, tasks) {
    this._MAX_CARD_TO_SHOW = 8;
    this._tasksOnPage = 0;
    this._leftCardsToRender = 0;
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._loadMore = new LoadMore();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._leftCardsToRender = this._tasks.length - this._tasksOnPage;
    this._renderLoadMore();
    this._showTasks(this._tasks);
  }

  _showTasks(tasks) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isArchive) {
        tasks.splice(i, 1);
        i--;
      }
    }

    if (tasks.length === 0) {
      this._renderMessage();
      unrender(this._loadMore.getElement());
      return;
    }

    if (tasks.length <= this._MAX_CARD_TO_SHOW) {
      tasks.slice(0).map((task) => this._renderTask(task))
      .join(``);
      unrender(this._loadMore.getElement());
      return;
    }

    tasks.slice(this._tasksOnPage, this._tasksOnPage + this._MAX_CARD_TO_SHOW).map((task) => this._renderTask(task))
    .join(``);

    this._tasksOnPage = this._tasksOnPage + this._MAX_CARD_TO_SHOW;
    this._leftCardsToRender = tasks.length - this._tasksOnPage;

    if (this._leftCardsToRender <= 0) {
      unrender(this._loadMore.getElement());
    }
  }

  _renderTask(task) {
    const taskComponent = new Task(task);
    const taskEditComponent = new TaskEdit(task);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._taskList
          .getElement()
          .replaceChild(
              taskComponent.getElement(),
              taskEditComponent.getElement()
          );
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent
      .getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._taskList.replaceChild(
            taskEditComponent.getElement(),
            taskComponent.getElement()
        );
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent
      .getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent
      .getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent
      .getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, () => {
        this._taskList.replaceChild(
            task.getElement(),
            taskEditComponent.getElement()
        );
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._taskList.getElement(), taskComponent.getElement(), Position.BEFOREEND);
  }

  _renderMessage() {
    const message = new Message();
    render(this._taskList.getElement(), message.getElement(), Position.BEFOREEND);
  }

  _renderLoadMore() {
    render(this._board.getElement(), this._loadMore.getElement(), Position.BEFOREEND);

    this._loadMore.getElement().addEventListener(`click`, () => {
      this._showTasks(this._tasks);
    });
  }
}
