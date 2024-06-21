export default class InnerLogin {
  #element;
  constructor(element) {
    this.#element = element;
    this.ws = null;
  }

  static get markup() {
    return `
        <form name="nickname">
            <p class="title">Выберите никнейм</p>
            <input type="text" class="input-nickname" name="input-nickname" minlength="6" maxlength="30" placeholder="Enter your nickname" required>
            <p class="validate">
              - latin letters only
              - no numbers allowed
              - no special characters(like @#$%^...)
            </p>
            <div class="button">Продолжить</div>
        </form>
        `;
  }

  bindToDom() {
    this.#element.insertAdjacentHTML("afterbegin", InnerLogin.markup);
    this.form = document.forms.nickname;
    this.input = this.form.elements["input-nickname"];
    this.button = document.querySelector(".button");
    this.validate = document.querySelector(".validate");
    
    this.input.addEventListener("focus", this.onFocus);
  }

  validNickname(value) {
    const result = /^[A-Za-z]+([\ A-Za-z]+)*/.test(value);
    return result && value;
  }

  onFocus = () => {
    this.validate.classList.add("invisible");
  };
  
  formVision() {
    this.form.classList.toggle("invisible");
  }
}
