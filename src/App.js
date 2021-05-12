import React, { useState, useEffect } from 'react';
import Scoreboard from './components/score';
import Gameboard from './components/gameboard';
import './App.css';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [allPokemon, setAllPokemon] = useState([]);
  const [allPokemonNumbers, setAllPokemonNumbers] = useState([]);
  const [currentSet, setCurrentSet] = useState([]);

  const randomizeSet = (set) => {
    // https://stackoverflow.com/a/54814423/12843016

    let temp = set;

    for (let i = temp.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }

    setCurrentSet(temp);
  };

  const createNewSet = () => {
    const temp = allPokemonNumbers;
    const tempArray = [];

    for (let i = 0; i < 10; i++) {
      tempArray.push([parseInt(temp.splice(i, 1)), false]);
    }
    console.log(allPokemonNumbers);
    setCurrentSet(tempArray);
  };

  const handleClick = (i) => {
    let tempCurrentScore = currentScore;
    const tempCurrentSet = [...currentSet];

    if (currentSet[i][1] === false || currentScore === 10) {
      tempCurrentSet[i][1] = true;

      tempCurrentScore += 1;
      randomizeSet(tempCurrentSet);

      setCurrentScore(tempCurrentScore);
      if (currentScore % currentSet.length === currentSet.length - 1) {
        createNewSet();
      }
    } else {
      if (tempCurrentScore > highScore) setHighScore(tempCurrentScore);
      setCurrentScore(0);

      tempCurrentSet.forEach((item) => (item[1] = false));

      randomizeSet(tempCurrentSet);
    }
  };

  useEffect(() => {
    setCurrentScore(0);

    let temp = [...Array(151).keys()];
    randomizeSet(temp);

    const tempArray = [];

    for (let i = 0; i < 10; i++) {
      tempArray.push([parseInt(temp.splice(i, 1)), false]);
    }

    setAllPokemonNumbers(temp);
    setCurrentSet(tempArray);
  }, []);

  useEffect(() => {
    console.log('Pokemon API Called');

    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((res) => res.json())
      .then(
        (pokemon) => {
          setAllPokemon(pokemon);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
        }
      );
  }, []);

  if (error) {
    return (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <div className='gameboard error'>Oops, error: {error.message}</div>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <div className='gameboard loading'>Loading Pokemon...</div>
      </div>
    );
  } else {
    return (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <Gameboard
          onClick={handleClick}
          allPokemon={allPokemon}
          currentSet={currentSet}
        />
      </div>
    );
  }
}

export default App;
