export class ControlService {
  #nextPageLink = document.body.dataset.next

  init() {
    this.#initHandlers();
  }

  #initHandlers() {
    document.addEventListener("keydown", event => {
      const { code } = event;
      if (code === "Enter") {
        this.#entreHandle()
      }
    })
  }

  #entreHandle() {
    if (this.#nextPageLink) {
      window.location.href = this.#nextPageLink;
    }
  }
}