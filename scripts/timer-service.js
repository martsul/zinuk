export class TimerService {
  #fullTimeField = document.querySelector(
    "#full-time .question-aside__box-time"
  );
  #timerFiled = document.querySelector("#timer .question-aside__box-time");
  #fullTime = document.body.dataset.time * 60;
  #currentTime = this.#fullTime;
  #timerId;

  constructor() {
    this.#initTime();
  }

  startTimer() {
    this.#timerId = setInterval(() => {
      this.#decreaseTimer();
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.#timerId);
  }

  #initTime() {
    if (this.#fullTimeField && this.#timerFiled) {
      this.#setFullTimeField();
      this.#setTimerField();
    }
  }

  #decreaseTimer() {
    this.#currentTime -= 1;
    this.#setTimerField();
  }

  #setFullTimeField() {
    this.#fullTimeField.innerText = this.#fullTime / 60;
  }

  #setTimerField() {
    const time = this.#getMinuteSecondTime();
    this.#timerFiled.innerText = time;
  }

  #getMinuteSecondTime() {
    const minutes = Math.floor(this.#currentTime / 60);
    const seconds = this.#currentTime % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }
}
