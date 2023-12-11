/**
 * entrypoint for local plugin development.
 * This has only one task: open the plugin modal in a local development environment.
 * There is no need to change anything on this file.
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./app.tsx";
import "./setting.js";
import "./styles/main.scss";

class TaskList {
  static execute() {
    ReactDOM.render(
      <App showDialog={true} isDevelopment={true} />,
      document.getElementById("root")
    );
  }
}

// open it on first launch
TaskList.execute();

const openBtn = document.getElementById("plugin-controller");
openBtn.addEventListener(
  "click",
  function () {
    TaskList.execute();
  },
  false
);

window.app = window.app ? window.app : {};
window.app.onClosePlugin = function () {};
