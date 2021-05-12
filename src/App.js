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
  const [remainingPokemonNumbers, setRemainingPokemonNumbers] = useState([]);
  const [currentSet, setCurrentSet] = useState([]);

  const randomizeSet = (set) => {
    // https://stackoverflow.com/a/54814423/12843016
    let tempSet = set;

    for (let i = tempSet.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [tempSet[i], tempSet[j]] = [tempSet[j], tempSet[i]];
    }

    setCurrentSet(tempSet);
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
        const removeCurrentSet = remainingPokemonNumbers.slice(currentSet.length);
        setRemainingPokemonNumbers(removeCurrentSet);
      }
    } else {
      if (tempCurrentScore > highScore) setHighScore(tempCurrentScore);

      tempCurrentSet.forEach((item) => (item[1] = false));
      randomizeSet(tempCurrentSet);

      setCurrentScore(0);
      setRemainingPokemonNumbers(allPokemonNumbers);
    }
  };

  useEffect(() => {
    let pokemonNumbers = [...Array(386).keys()];
    randomizeSet(pokemonNumbers);

    setCurrentScore(0);
    setRemainingPokemonNumbers(pokemonNumbers);
    setAllPokemonNumbers(pokemonNumbers);

    console.log('PokeAPI Called');

    fetch('https://pokeapi.co/api/v2/pokemon?limit=386')
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

  useEffect(() => {
    const createNewSet = () => {
      const newSet = [];
      for (let i = 0; i < 10; i++) {
        newSet.push([parseInt(remainingPokemonNumbers.slice(i, i + 1)), false]);
      }
      setCurrentSet(newSet);
    };

    createNewSet();
  }, [remainingPokemonNumbers]);

  if (error) {
    return (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <div className='gameboard error'>Error Loading Pokeon - {error.message}</div>
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
