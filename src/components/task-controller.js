import {Position, Keycode} from "../const.js";
import {render} from "../utils.js";
import Task from "./card.js";
import TaskEdit from "./card-edit.js";

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);
    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.keyCode === Keycode.ESC) {
        this._container
          .getElement()
          .replaceChild(
              this._taskView.getElement(),
              this._taskEdit.getElement()
          );
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskEdit
      .getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit
      .getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskView
      .getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        this._container
          .getElement()
          .replaceChild(
              this._taskEdit.getElement(),
              this._taskView.getElement()
          );
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit
      .getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        this._container
          .getElement()
          .replaceChild(
              this._taskView.getElement(),
              this._taskEdit.getElement()
          );
      });

    this._taskEdit
      .getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const entry = this.setNewData();
        this._onDataChange(entry, this._data);

        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit
      .getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, () => {

        this._taskEdit.getElement().querySelector(`.card__btn--favorites`).classList.toggle(`card__btn--disabled`);

      });

    this._taskEdit
      .getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, () => {

        this._taskEdit.getElement().querySelector(`.card__btn--archive`).classList.toggle(`card__btn--disabled`);

      });


    this._taskEdit.getElement()
      .querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const fieldsetElement = this._taskEdit.getElement().querySelector(`.card__date-deadline`);
        if (fieldsetElement.hasAttribute(`disabled`)) {
          fieldsetElement.removeAttribute(`disabled`);
          this._taskEdit.getElement().querySelector(`.card__date-status`).textContent = `yes`;
        } else {
          fieldsetElement.setAttribute(`disabled`, `true`);
          this._taskEdit.getElement().querySelector(`.card__date-status`).textContent = `no`;

        }
      });

    this._taskEdit.getElement()
      .querySelector(`.card__repeat-toggle`).addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const fieldsetElement = this._taskEdit.getElement().querySelector(`.card__repeat-days`);
        if (fieldsetElement.hasAttribute(`disabled`)) {
          fieldsetElement.removeAttribute(`disabled`);
          this._taskEdit.getElement().querySelector(`.card__repeat-status`).textContent = `yes`;
        } else {
          fieldsetElement.setAttribute(`disabled`, `true`);
          this._taskEdit.getElement().querySelector(`.card__repeat-status`).textContent = `no`;
          this._taskEdit.getElement().querySelectorAll(`.card__repeat-day-input`).forEach((checkItem) => {
            checkItem.checked = false;
          });
        }
      });

    // //

    render(
        this._container.getElement(),
        this._taskView.getElement(),
        Position.BEFOREEND
    );
  }

  setNewData() {
    const formData = new FormData(
        this._taskEdit.getElement().querySelector(`.card__form`)
    );

    const entry = {
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      dueDate: new Date(formData.get(`date`)),
      isFavorite: this._taskEdit.getElement().querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? true : false,
      isArchive: this._taskEdit.getElement().querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? true : false,
      repeatingDays: formData.getAll(`repeat`).reduce(
          (acc, it) => {
            acc[it] = true;
            return acc;
          },
          {
            mo: false,
            tu: false,
            we: false,
            th: false,
            fr: false,
            sa: false,
            su: false,
          }
      ),
      isRepeating: this._taskEdit.getElement().querySelector(`.card__repeat-days`).hasAttribute(`disabled`) ? false : true,
      isDate: this._taskEdit.getElement().querySelector(`.card__date-deadline`).hasAttribute(`disabled`) ? false : true,
    };

    return entry;
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container
        .getElement()
        .replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
