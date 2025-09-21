class Answers {
  #answers = JSON.parse(sessionStorage.getItem("quizResults")) || {};
  #cards = document.querySelectorAll(".answer__card");

  constructor() {
    this.#countAnswers();
  }

  #countAnswers() {
    const partsAnswers = {};
    const typeAnswers = {};
    for (const key in this.#answers) {
      const [part, type, qNum] = key.split("-");
      const [answer, result] = this.#answers[key].split("-");
      if (result === "c") {
        if (partsAnswers[part]) {
          partsAnswers[part]++;
        } else {
          partsAnswers[part] = 1;
        }
        if (typeAnswers[type]) {
          typeAnswers[type]++;
        } else {
          typeAnswers[type] = 1;
        }
      }
    }
    this.#setPercents({ partsAnswers, typeAnswers });
  }

  #setPercents({ partsAnswers, typeAnswers }) {
    this.#setPartPercents(partsAnswers);
    this.#setTypeAnswers(typeAnswers);
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

  #setPartPercents(partsAnswers) {
    this.#cards.forEach((c, i) => {
      const mainPercent = c.querySelector(
        ".answer__head .answer__head-text:nth-child(2)"
      );
      const allCount = i === 2 ? 3 : 4;
      const countAnswers = partsAnswers[i + 1] || 0;
      mainPercent.innerText = Math.round((countAnswers * 100) / allCount) + "%";
    });
  }

  #setTypeAnswers(typeAnswers) {
    this.#cards.forEach((card, cardI) => {
      card.querySelectorAll(".answer__card-item").forEach((ci, ciIndex) => {
        const type = ci.dataset.type;
        const percentsField = ci.querySelector(".answer__card-item-percents");
        const countAnswers = typeAnswers[type] || 0;
        percentsField.innerText = Math.round((countAnswers * 100) / 1) + "%";

        ci.querySelectorAll(".answer__card-item-circle").forEach(
          (circle, circleI) => {
            const result = this.#answers[`${cardI + 1}-${type}-${circleI + 1}`];
            if (!result) return;

            const [_, status] = result.split("-");
            if (status === "c") {
              circle.classList.add("active");
            }
          }
        );
      });
    });
  }
}

new Answers();
