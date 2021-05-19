import win from '../img/win.jpg';

const Win = (props) => {
  const { handleGameReset } = props;

  return (
    <div className='gameboard complete'>
      <img src={win} alt='Pokemon Celebration' />
      <div>
        <h2>Congratulations!</h2>
        <p>You Win!</p>
        <button onClick={handleGameReset}>Play Again</button>
      </div>
    </div>
  );
};

export default Win;
