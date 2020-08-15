import React from 'react';
const ReactRouter = require('react-router');
const { Router, Route, hashHistory } = ReactRouter;

const books = [
  {id: 1, name: 'node.js 완전정복', url: 'part1'}
];

class App extends React.Component {
  render() {
    return (
        <div className="App">
          <header className="App-header">
            {'Hello World'}
          </header>
        </div>
    );
    ;
  }
}

class App2 extends React.Component {
  render() {
    return <Router routes={routesConfig} />
  }
}

class Books extends React.Component {
  render() {
    const id = this.props.params.id - 0;
    const book = books[id];
    return (
      <div className="Info">
        <h2>{`${book.id}: `}{book.name}</h2>
      </div>
    );
    ;
  }
}

const routesConfig = [
  { path: '/info/:id', component: Books },
  { path: '*', component: App }
];

//module.exports = App2;
export default App2;
