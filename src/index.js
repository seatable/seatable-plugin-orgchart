import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import './setting.js';
import './styles/main.scss';

class TaskList {

  static execute() {
    ReactDOM.render(
      <App showDialog={true} isDevelopment={true}/>,
      document.getElementById('root')
    );
  }

}

TaskList.execute();

const openBtn = document.getElementById('plugin-controller');
openBtn.addEventListener('click', function() {
  TaskList.execute();
}, false);

window.app = window.app ? window.app : {};
window.app.onClosePlugin = function() {};
