import 'bootstrap';
import {Aurelia} from 'aurelia-framework';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  // aurelia.use.plugin('aurelia-cycle');
  // aurelia.use.plugin('./dist/cycle/index');
  aurelia.use.plugin('./dist/cycle/index');
  aurelia.start().then(() => aurelia.setRoot('todo'));
  // aurelia.start().then(() => aurelia.setRoot());
}
