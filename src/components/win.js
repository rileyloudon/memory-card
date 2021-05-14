const Win = (props) => {
  const { handleGameReset } = props;

  return (
    <div className='gameboard complete'>
      <img src='./img/win.jpg' alt='Pokemon Celebration' />
      <div>
        <h2>Congratulations!</h2>
        <p>You Win!</p>
        <button onClick={handleGameReset}>Play Again</button>
      </div>
    </div>
  );
};

export default Win;
