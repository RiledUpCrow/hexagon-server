import Game from '../../database/Game';

export default () => (game: Game) => {
  const { gameId: id } = game;
  return {
    id,
  };
};
