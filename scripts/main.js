import { ControlService } from './control-service.js'

class Main {
  #controlService = new ControlService();

  constructor() {
    this.#controlService.init();
  }
}

new Main();