/**
 * entrypoint for the plugin in production environment
 * There is no need to change anything on this file.
 */

// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import App from "./app.tsx";

class SeaTablePlugin {
  static execute(props = {}) {
    ReactDOM.render(
      <App showDialog={true} {...props} />,
      document.querySelector("#plugin-wrapper")
    );
  }
}

export default SeaTablePlugin;

window.app.registerPluginItemCallback("OrgChart", SeaTablePlugin.execute);
