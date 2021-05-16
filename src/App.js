import React, { useState, useEffect } from 'react';
import Scoreboard from './components/score';
import Gameboard from './components/gameboard';
import Win from './components/win';
import './App.css';

// ADD: Increase currentSet size by 1 every successful board completion(10 -> 11)
//      or 5/10 every 100?

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
    let tempCurrentScore = currentScore;
    const tempCurrentSet = [...currentSet];

    if (currentSet[i][1] === false) {
      tempCurrentSet[i][1] = true;

      tempCurrentScore += 1;
      randomizeSet(tempCurrentSet);

      setCurrentScore(tempCurrentScore);

      if (currentSet.every((item) => item[1] === true)) {
        const removeCurrentSet = remainingPokemonNumbers.slice(currentSet.length);
        setRemainingPokemonNumbers(removeCurrentSet);

        let i = setNumber;
        i++;
        setSetNumber(i);

        if (setNumber % 2 === 0) {
          // if remaing pokemon is less than max set size * 2, add remaing pokemon to current set
          if (maxSetSize < 12) {
            let size = maxSetSize;
            size++;
            setMaxSetSize(size);
          } else {
            let size = maxSetSize;
            size = 15;
            setMaxSetSize(size);
          }
        }
      }
    } else {
      tempCurrentSet.forEach((item) => (item[1] = false));
      randomizeSet(tempCurrentSet);

      if (tempCurrentScore > highScore) setHighScore(tempCurrentScore);
      setCurrentScore(0);
      setSetNumber(1);
      setMaxSetSize(5);
      setRemainingPokemonNumbers(allPokemonNumbers);
    }
  };

  const handleGameReset = () => {
    setHighScore(currentScore);
    setCurrentScore(0);
    setSetNumber(1);
    setMaxSetSize(5);
    setRemainingPokemonNumbers(allPokemonNumbers);
  };

  useEffect(() => {
    let pokemonNumbers = [...Array(151).keys()];
    randomizeSet(pokemonNumbers);

    setCurrentScore(0);
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
        <Scoreboard current={currentScore} highest={highScore} />
        <p className='gameboard error'>Error Loading Pokemon - {error.message}</p>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <p className='gameboard loading'>Loading Pokemon...</p>
      </div>
    );
  } else {
    return remainingPokemonNumbers.length > 0 ? (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <Gameboard
          handleClick={handleClick}
          allPokemon={allPokemon}
          currentSet={currentSet}
        />
      </div>
    ) : (
      <div className='memory-card'>
        <Scoreboard current={currentScore} highest={highScore} />
        <Win handleGameReset={handleGameReset} />
      </div>
    );
  }
}

export default App;
