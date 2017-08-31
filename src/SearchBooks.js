import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as BooksAPI from './BooksAPI';
import SearchBooksBar from './SearchBooksBar';
import SearchBooksResults from './SearchBooksResults';

class SearchBooks extends Component {
  state = {
    query: '',
    queryChanged: false,
    lastUserInput: 0,
    searchResults: [],
    updateInterval: null
  }

  onUpdateQuery = (query) => {
    this.setState({
      query,
      lastUserInput: new Date(),
      queryChanged: true,
    });
  }

  fetchResults = () => {
    console.log(this.state.query);
    if (this.state.query.length > 0) {
      BooksAPI.search(this.state.query, 20)
      .then(this.handleAPIResponse)
      .catch(err => {
        console.log(`Could not fetch results: ${err}`);
        this.setState({ searchResults: [] });
      })
    }
  }

  handleAPIResponse = (response) => {
    if (response.error) {
      console.log('No search results: ', response.error);
      this.setState({ searchResults: [] });
    } else {
      console.log('Got results: ', response);
      this.setState({ searchResults: response });
    }
  }

  timeSinceLastUserInput = () => (Date.now() - this.state.lastUserInput);

  isUpdateNecessary = () => (
    this.state.queryChanged &&
    this.state.query.length > this.props.minQueryLength &&
    this.timeSinceLastUserInput() > this.props.updateTimeout
  )

  updateIfNecessary = () => {
    if (this.isUpdateNecessary()) {
      this.setState({ queryChanged: false });
      this.fetchResults();
    }
  }

  componentDidMount = () => {
    this.updateInterval = setInterval(this.updateIfNecessary, 100);
  }

  componentWillUnmount = () => {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  render() {
    return (
      <div className="search-books">
        <SearchBooksBar
          query={this.state.query}
          onUpdateQuery={this.onUpdateQuery}
        />
        <SearchBooksResults
          books={this.state.searchResults}
        />
      </div>
    );
  }
}

SearchBooks.propTypes = {
  minQueryLength: PropTypes.number,
  updateTimeout: PropTypes.number,
};

SearchBooks.defaultProps = {
  minQueryLength: 2,
  updateTimeout: 1000
};

export default SearchBooks