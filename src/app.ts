import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'counter'], name: 'counter',      moduleId: 'counter',      nav: true, title: 'Counter' },
      { route: 'counter-shared', name: 'counter-shared',      moduleId: 'counter-shared',      nav: true, title: 'Counter Shared' },
      // { route: 'todo', name: 'todo',      moduleId: 'todo',      nav: true, title: 'TodoMVC' },
      { route: 'test', name: 'test',      moduleId: 'test',      nav: true, title: 'Test' }
    ]);

    this.router = router;
  }
}
