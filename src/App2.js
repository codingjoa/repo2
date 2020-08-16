import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const books = [
  '죽지는 않았으나 시체는 찾았습니다.',
  '디자인을 괴롭히는 디자이너',
  '몸에는 해로우나 드십시오',
  '노 저을 때 물 들어와라'
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


const reducer = (state, action) => {
  switch(action.state) {
    case 1:
    return {state: action.state, result: action.result};
    case 2:
    return {state: action.state, result: `오류!: ${action.result.message}`};
    default:
    return {state: 0, result: '이상?'};
  }
};

const FetchAPI = () => {
  const [ state, dispatch ] = useReducer(reducer, {state: 0, result: '작업대기상태'});
  fetch('/api')
  .then(r => r.text())
  .catch(r => dispatch({state: 2, result: r}))
  .then(r => dispatch({state: 1, result: r}));
  return <h3>{state.result}</h3>;
};

const Books2 = ({ match }) => {
  const id = match.params.id;
  const book = books[id];
  if(book) {
    return (
      <div className="Info">
        <h2>{`${id}: `}{book}</h2>
      </div>
    );
    ;
  }
  return `${id} 그런 거 없다.`;
};

const SpreadLinks = () => {
  const r = books.map((v, i) => <Link to={`/info/${i}`}>{`${i}-${v}`}</Link>);
  return r;
};

class App2 extends React.Component {
  render() {
    return (
      <Router>
        <div><SpreadLinks /></div>
        <Route path="/info/:id" component={Books2} />
        <Route path="/fetch" component={FetchAPI} />
        <Route path="/" component={App} />
      </Router>
    );
  }
}


export { App2 };
