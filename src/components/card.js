const Card = (props) => {
  const { pokemonNumber, pokemonName, i, handleClick } = props;

  return (
    <figure className='card' onClick={() => handleClick(i)}>
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonNumber}.svg`}
        alt={`${pokemonName}`}
      />
      <figcaption>{pokemonName}</figcaption>
    </figure>
  );
};

export default Card;
