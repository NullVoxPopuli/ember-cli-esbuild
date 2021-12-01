import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ButtonComponent extends Component {
  @tracked wasClicked = false;

  @action click() {
    this.wasClicked = true;
  }

  @action async notUsed() {
    await fetch('/robert-bahn-98KcGRrN4LQ-unsplash.jpg');
  }
}
