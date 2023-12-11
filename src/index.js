/**
 * entrypoint for local plugin development.
 * This has only one task: open the plugin modal in a local development environment.
 * There is no need to change anything on this file.
 */

import React from "react";
import ReactDOM from "react-dom";
import DTable from "dtable-sdk";
import App from "./app.tsx";
import "./setting.js";

import "./styles/main.scss";

class PluginModal {
  static async init() {
    const dtableSDK = new DTable();

    // local development
    window.app = {};
    window.app.state = {};
    window.dtable = {
      ...window.dtablePluginConfig,
    };
    await dtableSDK.init(window.dtablePluginConfig);
    await dtableSDK.syncWithServer();

    window.app.collaborators = dtableSDK.dtableStore.collaborators;
    window.app.collaboratorsCache = {};
    window.app.state.collaborators = dtableSDK.dtableStore.collaborators;
    window.dtableWebAPI = dtableSDK.dtableWebAPI;
    window.app.onClosePlugin = () => {};
    window.dtableSDK = dtableSDK;
  }

  static async execute() {
    await this.init();
    ReactDOM.render(
      <App isDevelopment showDialog />,
      document.getElementById("root")
    );
  }
}

document.getElementById("plugin-controller").addEventListener(
  "click",
  function () {
    PluginModal.execute();
  },
  false
);

PluginModal.execute();
