import React, { useState, useEffect } from 'react';
import Scoreboard from './components/score';
import Gameboard from './components/gameboard';
import Win from './components/win';
import Instructions from './components/instructions';
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
  const [setNumber, setSetNumber] = useState(1);
  const [maxSetSize, setMaxSetSize] = useState(5);

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
    const tempCurrentSet = [...currentSet];

    if (currentSet[i][1] === false) {
      tempCurrentSet[i][1] = true;

      while (
        currentSet.toString() === tempCurrentSet.toString() &&
        remainingPokemonNumbers.length > 1
      ) {
        randomizeSet(tempCurrentSet);
      }

      setCurrentScore(currentScore + 1);
      if (currentScore + 1 > highScore) {
        setHighScore(currentScore + 1);
        localStorage.savedHighScore = currentScore + 1;
      }

      if (currentSet.every((item) => item[1] === true)) {
        const removeCurrentSet = remainingPokemonNumbers.slice(currentSet.length);
        setRemainingPokemonNumbers(removeCurrentSet);

        setSetNumber(setNumber + 1);

        if (setNumber % 2 === 0) {
          let size = maxSetSize;

          remainingPokemonNumbers.length - maxSetSize * 2 < maxSetSize
            ? (size = remainingPokemonNumbers.length)
            : size++;

          setMaxSetSize(size);
        }
      }
    } else {
      setCurrentScore(0);
      setSetNumber(1);
      setMaxSetSize(5);
      setRemainingPokemonNumbers(allPokemonNumbers);

      tempCurrentSet.forEach((item) => (item[1] = false));
      randomizeSet(tempCurrentSet);
    }
  };

  const handleGameReset = () => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.savedHighScore = currentScore;
    }

    setCurrentScore(0);
    setSetNumber(1);
    setMaxSetSize(5);
    setRemainingPokemonNumbers(allPokemonNumbers);
  };

  useEffect(() => {
    const pokemonNumbers = [...Array(151).keys()];
    randomizeSet(pokemonNumbers);

    setCurrentScore(0);
    if (localStorage.savedHighScore) setHighScore(localStorage.savedHighScore);
    setSetNumber(1);
    setMaxSetSize(5);
    setRemainingPokemonNumbers(pokemonNumbers);
    setAllPokemonNumbers(pokemonNumbers);

    if (localStorage.pokemon) {
      const savedPokemon = JSON.parse(localStorage.pokemon);
      setAllPokemon(savedPokemon);
      setIsLoaded(true);
    } else {
      console.log('PokeAPI Called');

      fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then((res) => res.json())
        .then(
          (pokemon) => {
            setAllPokemon(pokemon.results);
            setIsLoaded(true);
            localStorage.pokemon = JSON.stringify(pokemon.results);
          },
          (error) => {
            setError(error);
          }
        );
    }
  }, []);

  useEffect(() => {
    const newSet = [];
    const setSize =
      remainingPokemonNumbers.length >= maxSetSize
        ? maxSetSize
        : remainingPokemonNumbers.length;

    for (let i = 0; i < setSize; i++) {
      newSet.push([parseInt(remainingPokemonNumbers.slice(i, i + 1)), false]);
    }

    setCurrentSet(newSet);
  }, [maxSetSize, remainingPokemonNumbers]);

  if (error) {
    return (
      <div className='memory-card'>
        <Instructions />
        <Scoreboard current={currentScore} highest={highScore} />
        <p className='gameboard error'>Error Loading Pokemon - {error.message}</p>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className='memory-card'>
        <Instructions />
        <Scoreboard current={currentScore} highest={highScore} />
        <p className='gameboard loading'>Loading Pokemon...</p>
      </div>
    );
  } else {
    return remainingPokemonNumbers.length > 0 ? (
      <div className='memory-card'>
        <Instructions />
        <Scoreboard current={currentScore} highest={highScore} />
        <Gameboard
          handleClick={handleClick}
          allPokemon={allPokemon}
          currentSet={currentSet}
        />
      </div>
    ) : (
      <div className='memory-card'>
        <Instructions />
        <Scoreboard current={currentScore} highest={highScore} />
        <Win handleGameReset={handleGameReset} />
      </div>
    );
  }
}

export default App;
