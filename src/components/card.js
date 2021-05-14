const Card = (props) => {
  const { pokemonNumber, pokemonName, i, handleClick } = props;

  return (
    <figure className='card' onClick={() => handleClick(i)}>
      <img
        src={`https://pokeres.bastionbot.org/images/pokemon/${pokemonNumber}.png`}
        alt='{pokemonName}'
      />
      <figcaption>{pokemonName}</figcaption>
    </figure>
  );
};

export default Card;
