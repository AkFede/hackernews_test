import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React for beginners',
    url: 'https://react.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux at its best',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Anrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const heading = "Welcome to the road to learn React";
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      heading,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    console.log(result);
    this.setState({result});
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  render() {
    const { result, heading, searchTerm } = this.state;

    if(!result) {return null;}

    return (
      <div className="page">
        <h2>{heading}</h2>
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} children="Suche:" />
        </div>
        <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}
const largeColumn = {
  width:'40%',
}

const midColumn = {
  width:'30%',
}

const smallColumn = {
  width:'10%',
}

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}><Button className="button-inline" onClick={() => onDismiss(item.objectID)}>Dismiss</Button></span>
        </div>
      )}
    </div>
  )
}

const Button = ({ onClick, className, children }) =>
  <button onClick={onClick} className={className}>{children}</button>

const Search = ({ value, onChange, children }) =>
  <form>{children} <input type="text" value={value} onChange={onChange} /></form>

export default App;

if (module.hot) {
  module.hot.accept();
}