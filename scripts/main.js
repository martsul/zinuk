import { ControlService } from './control-service.js'
import { TimerService } from './timer-service.js';

class Main {
  #controlService = new ControlService();
  #timerService = new TimerService();
  #pageWithTimer = Boolean(document.body.dataset.time);

  constructor() {
    this.#initControls();
    this.#initTimer();
    this.#timerService.endTimer = this.#controlService.nextPage;
  }

  #initTimer() {
    if(this.#pageWithTimer) {
      this.#timerService.startTimer();
    }
  }

  #initControls() {
    this.#controlService.init();
    this.#controlService.onPause = () => {
      this.#timerService.stopTimer()
    }
  }
}

new Main();