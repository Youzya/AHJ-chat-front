import InnerChat from "./innerchat";
import InnerLogin from "./innerlogin";

export default class Controller {
  #element;
  #InnerLogin;
  #ws;
  #InnerChat;
  #you;
  #nicknames;
  constructor(element) {
    this.#element = element;
    this.#you = null;
    this.#nicknames;
    this.#InnerLogin = new InnerLogin(this.#element);
    this.#InnerLogin.bindToDom();
    this.#ws = new WebSocket("https://ahj-chat-back-1tkf.onrender.com");
    this.#InnerLogin.ws = this.#ws;
    this.#InnerChat = new InnerChat(this.#element);
    this.#InnerChat.bindToDom();
  }

  connectHandler() {
    this.#ws.addEventListener("open", (e) => {
      console.log(e);

      console.log("ws open");
    });

    this.#ws.addEventListener("close", (e) => {
      console.log(e);

      console.log("ws close");
    });

    this.#ws.addEventListener("error", (e) => {
      console.log(e);

      console.log("ws error");
    });

    this.#ws.addEventListener("message", (e) => {
      console.log(e);

      const data = JSON.parse(e.data);
      console.log(data);
      if (data.nicknames) {
        const { nicknames } = data;
        this.#nicknames = nicknames;
        this.#InnerChat.owners = nicknames;
        this.#InnerChat.innerOwner();
      }

      if (data.chat) {
        this.#InnerChat.messages = data.chat;
        this.#InnerChat.innerMessages();
      }

      console.log("ws message");
    });

    this.#InnerLogin.form.addEventListener("click", this.onClickForm);
    this.#InnerChat.input.addEventListener("keydown", this.onKeydownChat);
  }

  onUnload = () => {
    this.#ws.send(
      JSON.stringify({
        nickname: this.#you,
        status: false,
      })
    );
  };

  onClickForm = (e) => {
    e.preventDefault();
    const target = e.target;
    if (target == this.#InnerLogin.button) {
      const value = this.#InnerLogin.input.value.trim();
      const nickname = this.#InnerLogin.validNickname(value);
      if (nickname && this.#nicknames.includes(nickname) === true)
        alert("This nickname is already taken!");
      if (nickname && this.#nicknames.includes(nickname) === false) {
        this.#ws.send(JSON.stringify({ nickname: nickname }));
        this.#InnerLogin.formVision();
        this.#InnerChat.chatVisibility();
        this.#you = nickname;
        this.#InnerChat.you = nickname;
      } else {
        this.#InnerLogin.validate.classList.remove("invisible");
      }
    }
    this.#InnerLogin.input.value = "";
  };

  onKeydownChat = (e) => {
    const target = e.target;

    if (e.keyCode === 13) {
      if (e.ctrlKey) {
        if (target.value === "") return;
        e.preventDefault();
        const start = target.selectionStart;
        const end = target.selectionEnd;
        target.value =
          target.value.substring(0, start) + "\n" + target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;
      } else {
        e.preventDefault();
        const value = target.value;
        this.#ws.send(
          JSON.stringify({
            nickname: this.#you,
            message: encodeURIComponent(value),
          })
        );
      }
      target.value = "";
    }
  };
}
