const PARTS = {
  1: ["Inference", "Reading", "Analogies", "Sentence Completion"],
  2: ["Graphs", "Problem Solving", "Geometry", "Algebra"],
  3: ["Sentence Completion", "Restatements", "Reading Comprehension"],
};

class AnswerDetails {
  #answers = JSON.parse(sessionStorage.getItem("quizResults")) || {};
  #cards = document.querySelectorAll(".answer-details__card");
  #title = document.querySelector(".answer-details__result-head-text");
  #answer = document.querySelector(".answer-details__result-footer-answer");

  constructor() {
    this.#countAnswers();
    this.#setStatus();
    this.#initHandlers();
    this.#openAnswer(document.querySelector(".answer-details__card-item"));
  }

  #initHandlers() {
    document.addEventListener("click", (event) => {
      const { target } = event;
      if (target.closest(".answer-details__card-item")) {
        this.#openAnswer(target.closest(".answer-details__card-item"));
      }
    });
  }

  #openAnswer(answer) {
    const answerNum = +answer.querySelector(".answer-details__card-item-text")
      .innerText;
    const [_, partNum] = answer
      .closest(".answer-details__card")
      .querySelector(".answer-details__card-title")
      .innerText.split(" ");
    const result =
      this.#answers[`${partNum}-${PARTS[+partNum][answerNum - 1]}-1`];
    if (!result) {
      return;
    }

    this.#title.innerText = `Part ${partNum}, Question ${answerNum}`;
    this.#answer.innerText = answerNum;
  }

  #setStatus() {
    this.#cards.forEach((card, cardI) => {
      card.querySelectorAll(".answer-details__card-item").forEach((sq, sqI) => {
        const questionChoice = `${cardI + 1}-${PARTS[cardI + 1][sqI]}-${1}`;
        const result = this.#answers[questionChoice];
        if (!result) {
          sq.classList.add("warning");
          return;
        }

        const [_, status] = result.split("-");
        const classStyle = status === "i" ? "incorrect" : "success";
        sq.classList.add(classStyle);
      });
    });
  }

  #countAnswers() {
    const partsAnswers = {};
    for (const key in this.#answers) {
      const [part, type, qNum] = key.split("-");
      const [answer, result] = this.#answers[key].split("-");
      if (result === "c") {
        if (partsAnswers[part]) {
          partsAnswers[part]++;
        } else {
          partsAnswers[part] = 1;
        }
      }
    }
    this.#setPercents(partsAnswers);
  }

  #setPercents(partsAnswers) {
    this.#setAllPercents(partsAnswers);
  }

  #setAllPercents(partsAnswers) {
    let countAnswers = 0;
    const fields = document.querySelectorAll(
      ".main-head__progress-text .percents"
    );
    for (const key in partsAnswers) {
      countAnswers += partsAnswers[key];
    }

    fields.forEach((e) => {
      e.innerText = Math.round((countAnswers * 100) / 11) + "%";
    });
  }
}

new AnswerDetails();
