// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.tsx';

class TaskList {

  static execute(props = {}) {
    let wrapper = document.querySelector('#plugin-wrapper');
    ReactDOM.render(<App showDialog={true} {...props} />, wrapper);
  }

}

export default TaskList;

window.app.registerPluginItemCallback('OrgChart', TaskList.execute);
