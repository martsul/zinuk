import { ModalService } from "./modal-service.js";

export class QuestionWithScrolling {
  #modalService = new ModalService();
  #questionContainer = document.querySelector('#question');
  #answerContainer = document.querySelector('#answer');

  constructor() {
    this.#initHandlers();
  }

  #initHandlers() {
    document.addEventListener("click", (event) => {
      const { target } = event;
      if (target.closest("#question-full")) {
        this.#openQuestionModal();
      } else if (target.closest("#answer-full")) {
        this.#openAnswerModal();
      }
    });
  }

  #initModalHandlers() {
    document.addEventListener('keydown', this.#modalButtonsHandler)
  }

  #removeModalHandlers() {
    document.removeEventListener('keydown', this.#modalButtonsHandler)
  }

  #modalButtonsHandler = (event) => {
    const { code } = event;
    if (code === "Enter") {
      event.preventDefault();
      this.#closeModal();
    }
  }

  #closeModal() {
    this.#modalService.closeModal();
    this.#removeModalHandlers();
  }

  #openQuestionModal() {
    const modalContent = this.#wrapModal(this.#questionContainer.innerHTML);
    this.#openFullModal(modalContent);
  }

  #openAnswerModal() {
    const modalContent = this.#wrapModal(this.#answerContainer.innerHTML);
    this.#openFullModal(modalContent);
  }

  #openFullModal(content) {
    this.#modalService.openModal(content);
    this.#initModalHandlers()
  }

  #wrapModal(content) {
    return `<div class="qws-modal__content">
${content}
</div>
<button class="modal-close">Close</button>
<div class="qws-modal__note">Or Press &lt;Enter&gt; to Exit</div>`;
  }
}

new QuestionWithScrolling();