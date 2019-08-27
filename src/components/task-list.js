import {AbstractComponent} from "../components/abstract-component.js";

export class TaskList extends AbstractComponent {
  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}
