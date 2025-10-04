export class QuestionService {
  #part = document.body.dataset.part;
  #type = document.body.dataset.type;
  #answer = document.body.dataset.answer;
  #qNum = document.body.dataset.qNum;
  #answerField = document.querySelector(".question__choice-input");

  constructor() {
    this.#logQuestionInfo();
  }

  saveAnswer() {
    this.#saveAnswer()
  }

  #logQuestionInfo() {
    console.log("Part: ", this.#part);
    console.log("Type: ", this.#type);
    console.log("Answer: ", this.#answer);
    console.log("Question number: ", this.#qNum);
  }

  #saveAnswer() {
    const { key, value } = this.#getAnswerDto();
    let otherAnswers = JSON.parse(sessionStorage.getItem("quizResults"));
    if (otherAnswers) {
      otherAnswers[key] = value;
    } else {
      otherAnswers = {
        [key]: value
      }
    }
    sessionStorage.setItem("quizResults", JSON.stringify(otherAnswers))
  }

  #getAnswerDto() {
    const answer = this.#answerField.value || 0;
    const result = answer == this.#answer ? "c" : "i";
    const key = `${this.#part}-${this.#type}-${this.#qNum}`;
    const value = `${answer}-${result}`;
    return { key, value };
  }
}
