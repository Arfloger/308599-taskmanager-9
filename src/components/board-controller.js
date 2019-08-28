import {Position} from "../const.js";
import {render} from "../utils.js";
import Board from "../components/board.js";
import TaskList from "../components/task-list.js";

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
  }
}
