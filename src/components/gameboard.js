import Card from './card';

const Gameboard = (props) => {
  const { allPokemon, currentSet, handleClick } = props;

  const renderPokemon = (number, i) => {
    return (
      <Card
        key={allPokemon[number[0]].name}
        pokemonNumber={number[0] + 1}
        pokemonName={allPokemon[number[0]].name}
        i={i}
        handleClick={handleClick}
      />
    );
  };

  return (
    <div className='gameboard'>
      {currentSet.map((number, i) => renderPokemon(number, i))}
    </div>
  );
};

export default Gameboard;
