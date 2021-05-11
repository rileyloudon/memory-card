import Card from './card';

const Gameboard = (props) => {
  const { allPokemon, currentSet } = props;

  const renderPokemon = (number, i) => {
    return (
      <Card
        key={allPokemon.results[number[0]].name}
        pokemonNumber={number[0] + 1}
        pokemonName={allPokemon.results[number[0]].name}
        i={i}
        onClick={props.onClick}
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
