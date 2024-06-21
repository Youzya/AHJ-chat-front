import Controller from "./controller";

const container = document.querySelector(".container");

document.addEventListener("DOMContentLoaded", () => {
  const controller = new Controller(container);
  controller.connectHandler();

  window.addEventListener("unload", controller.onUnload);
});