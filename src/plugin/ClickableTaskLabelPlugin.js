import {PluginInterface} from "./PluginInterface";
import * as d3 from 'd3';
import template from 'lodash.template';
import getFormData from 'get-form-data';

export class ClickableTaskLabelPlugin extends PluginInterface {

  doubleClickTimerId;
  clickCount = 0;

  /**
   * @param {Roadmappy} roadmappy
   */
  initialize(roadmappy) {
    this.roadmappy = roadmappy;
    this.form = document.createElement('form');
    this.form.addEventListener('submit', this._onSubmit);
    this.form.addEventListener('click', this._onClick);
    roadmappy.on('click:task-label', this._onTaskLabelClick);
  }

  _initializeForm(task) {
    this.form.innerHTML = template(`
      <input type="hidden" name="id" value="<%= task.id %>">
      <div>
        <label>
          <span class="form-label">name</span>
          <input type="text" name="name" value=<%= task.name  %>>
        </label>
      </div>
      <div>
        <label>
          <span class="form-label">story</span>
          <select name="storyId">
            <% for (const s of stories) { %>
            <option value="<%= s.id %>"<%= task.storyId === s.id ? " selected": "" %>><%= s.name %></option>
            <% } %>
          </select>
        </label>
      </div>
      <div>
        <label>
          <span class="form-label">assignee</span>
          <select name="assigneeIds" multiple="true">
            <% for (const a of assignees) { %>
            <option value="<%= a.id %>"<%= task.assigneeIds.indexOf(a.id) >= 0 ? " selected": "" %>><%= a.name %></option>
            <% } %>
          </select>
        </label>
      </div>
      <div>
        <input type="submit" value="Save" data-button-type="save">
        /
        <input type="submit" value="Delete" data-button-type="delete">
        /
        <input type="submit" value="Cancel" data-button-type="cancel">
      </div>
    `)({
      task: task.toAssoc(),
      stories: this.roadmappy.roadmap._stories.map(s => s.toAssoc()),
      assignees: this.roadmappy.roadmap._assignees.map(a => a.toAssoc()),
    });
  }

  _onSubmit = e => {
    e.preventDefault();
  };

  _onClick = e => {
    const name = e.target.getAttribute('data-button-type');
    switch (name) {
      case 'save':
        const assoc = getFormData(this.form);
        assoc.id = parseInt(assoc.id, 10);
        const task = this.roadmappy.roadmap.getTaskById(assoc.id);
        task.merge(assoc);
        this.roadmappy.render();
      case 'delete':
      case 'cancel':
    }
  };

  _onTaskLabelClick = (task, labelNode) => {
    if (this.clickCount === 0) {
      ++this.clickCount;

      if (this.doubleClickTimerId) {
        clearTimeout(this.doubleClickTimerId);
      }
      this.doubleClickTimerId = setTimeout(() => this.clickCount = 0, 350);
    } else {
      this.clickCount = 0;
      d3.event.preventDefault();
      this._onTaskLabelDoubleClick(task, labelNode);

    }
  }

  _onTaskLabelDoubleClick = (task, labelNode) => {
    this._initializeForm(task);
    this.roadmappy.canvas.element.node().parentElement.appendChild(this.form);
  }

}
