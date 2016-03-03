import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'counter'], name: 'counter',      moduleId: 'counter',      nav: true, title: 'Counter' }
    ]);

    this.router = router;
  }
}
