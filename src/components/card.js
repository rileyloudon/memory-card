const Card = (props) => {
  const { pokemonNumber, pokemonName, i, onClick } = props;

  return (
    <div className='card' onClick={() => onClick(i)}>
      <img
        src={`https://pokeres.bastionbot.org/images/pokemon/${pokemonNumber}.png`}
        alt='{pokemonName}'
      />
      <p>{pokemonName}</p>
    </div>
  );
};

export default Card;
