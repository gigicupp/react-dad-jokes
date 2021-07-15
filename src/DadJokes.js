import React, { Component } from 'react';
const DAD_API = 'https://icanhazdadjoke.com/';
import { fetchData } from './helpers.js';
import Joke from './Joke';
import './DadJokes.css'

class DadJokes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || `[]`),
      isLoading: false
    }
    this.seenJokes = new Set(this.state.jokes.map(j => j.joke.id))
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    if (!this.state.jokes.length) this.getJokes();
  }

  async getJokes() {
    try {
      let jokes = [];
      do {
        let newJoke = await fetchData(DAD_API)
        if (!this.seenJokes.has(newJoke.joke.id)) {
          jokes.push({ joke: newJoke, votes: 0 })
        }
      } while (jokes.length < 10)

      this.setState(
        st => ({
          isLoading: false,
          jokes: [...st.jokes, ...jokes]
        }),
        () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes)))
      window.localStorage.setItem('jokes', JSON.stringify(jokes));
    } catch (err) {
      alert(err)
    }
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.joke.id === id ? { ...j, votes: j.votes + delta } : j)
      }),
      () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    )
  }

  handleClick(e) {
    this.setState({ isLoading: true }, this.getJokes)
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className='DadJokes-spinner'>
          <i className='far fa-8x fa-laugh fa-spin'></i>
          <h1 className='DadJokes-title'>Loading...</h1>
        </div>
      )
    }
    let sortedJokes = this.state.jokes.sort((a,b) => b.votes - a.votes)
    let jokeList = sortedJokes.map(joke => {
      return <Joke
        joke={joke.joke.joke}
        key={joke.joke.id}
        id={joke.joke.id}
        votes={joke.votes}
        upvote={() => this.handleVote(joke.joke.id, 1)}
        downvote={() => this.handleVote(joke.joke.id, -1)}
      />
    })
    return (
      <div className='DadJokes'>
        <div className='DadJokes-sidebar'>
          <h1 className='DadJokes-title'><span>Dad</span> Jokes</h1>
          <img
            src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
          />
          <button className='Dadjokes-getmore' onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className='DadJokes-jokes'>
          {jokeList}
        </div>
      </div>
    )
  }
}

export default DadJokes;