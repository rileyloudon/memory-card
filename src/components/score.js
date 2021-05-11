const Scoreboard = (props) => {
  return (
    <div className='scoreboard'>
      <p className='current-score'>Current Score: {props.current}</p>
      <p className='high-score'>High Score: {props.highest}</p>
    </div>
  );
};

export default Scoreboard;
