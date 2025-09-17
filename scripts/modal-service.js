export class ModalService {
  #modal;

  constructor() {
    this.#initModal();
    this.#initModalHandlers();
  }

  openModal(content) {
    const wrappedContent = this.#wrapContent(content)
    this.#modal.innerHTML = wrappedContent;
    document.body.appendChild(this.#modal);
  }

  closeModal() {
    this.#closeModal();
  }

  #initModalHandlers() {
    document.addEventListener('click', event => {
      const { target } = event;
      if (target.closest('.modal-close')) {
        this.#closeModal();
      }
    })
  }

  #closeModal() {
    this.#modal.remove();
  }

  #initModal() {
    this.#modal = document.createElement("div");
    this.#modal.classList.add("modal");
  }

  #wrapContent(content) {
    return `<button class="modal-close">
  <svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_153_1607)">
      <path
        d="M36 2L6 32M6 2L36 32"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_153_1607"
        x="0.5"
        y="0.5"
        width="41"
        height="41"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_153_1607"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_153_1607"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</button>
<div class="modal-wrapper">
  ${content}
</div>`;
  }
}
