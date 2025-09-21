import { QuestionService } from "./question-service.js";

export class ControlService {
  #questionService = new QuestionService();
  #nextPageLink = document.body.dataset.next;
  #answerField = document.querySelector(".question__choice-input");
  #availableAnswers = new Set(["Digit1", "Digit2", "Digit3", "Digit4"]);
  #paragraphs = {
    F2: 1,
    F3: 2,
    F4: 3,
    F5: 4,
    F6: 5,
    F7: 6,
    F8: 7,
    F9: 8,
    F10: 9,
  };
  #activeParagraph = 1;
  #questionParagraphsContainer = document.querySelector(".question-details");
  #questionsParagraphs = document.querySelectorAll(".question__text-container");
  #activeAudio = new Audio(this.#questionsParagraphs[0]?.dataset?.audio);
  #timer = document.querySelector("#timer");
  #skipPause = false;

  pauseSkip() {}

  init() {
    this.#initHandlers();
  }

  nextPage() {
    this.#nextPage();
  }

  #isAnswer() {
    return Boolean(document.body.dataset.answer);
  }

  #initHandlers() {
    document.addEventListener("keydown", (event) => {
      const { code, key } = event;
      if (code === "Enter") {
        this.#checkContinue();
      } else if (this.#availableAnswers.has(code)) {
        this.#answerNumHandle(key);
      } else if (code === "Digit5") {
        this.#pauseSkip();
      } else if (this.#paragraphs[code]) {
        this.#changeParagraph(this.#paragraphs[code]);
      } else if (code === "F1") {
        this.#playAudio();
      } else if (code === "F11") {
        this.#stopAudio();
      } else if (code === "Space") {
        this.#nextPage();
      } else if (code === "F12") {
        event.preventDefault();
        this.#toggleTimer();
      } else if (code === "Escape") {
        event.preventDefault();
        this.#closeExam();
      }
    });
  }

  #closeExam() {
    window.location.href = "/preview-page.html";
  }

  #toggleTimer() {
    if (this.#timer) {
      this.#timer.classList.toggle("hidden");
    }
  }

  #checkContinue() {
    if (this.#isPause() && !this.#skipPause) {
      return;
    }

    if (
      !(!this.#nextPageLink || (this.#answerField && !this.#answerField.value))
    ) {
      this.#nextPage();
    } else if (this.#answerField && !this.#answerField.value) {
      this.#answerField.classList.add("error");
    }
  }

  #nextPage() {
    if (this.#isAnswer()) {
      this.#questionService.saveAnswer();
    }
    window.location.href = this.#nextPageLink;
  }

  #answerNumHandle(code) {
    if (this.#answerField) {
      this.#answerField.value = code;
    }
  }

  #pauseSkip() {
    this.pauseSkip();
    this.#skipPause = true;
  }

  #isPause() {
    return Boolean(document.querySelector(".pause"));
  }

  #changeParagraph(num) {
    const selectedParagraph = this.#questionsParagraphs[num];
    if (this.#questionParagraphsContainer && selectedParagraph) {
      this.#activeParagraph = num;
      this.#scrollToActiveParagraph();
      this.#changeActiveAudio();
    }
  }

  #scrollToActiveParagraph() {
    const activeParagraph =
      this.#questionsParagraphs[this.#activeParagraph - 1];
    activeParagraph.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  #changeActiveAudio() {
    this.#activeAudio = new Audio(
      this.#questionsParagraphs[this.#activeParagraph - 1].dataset.audio
    );
  }

  #playAudio() {
    this.#activeAudio.play();
  }

  #stopAudio() {
    this.#activeAudio.pause();
  }
}
