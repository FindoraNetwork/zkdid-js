import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from '_src/routes';
import 'highlight.js/styles/github.css'
import '_src/assets/less/index.less';

const Root = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
