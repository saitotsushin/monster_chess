import Chess from './chess/Chess';

export default class ChessData {
  constructor() {
    this.chessList = [
      {
        key: "chess_1",
        className: Chess
      },
      {
        key: "chess_2",
        className: Chess
      },
      {
        key: "chess_3",
        className: Chess
      },
      {
        key: "chess_4",
        className: Chess
      },
      {
        key: "chess_5",
        className: Chess
      }
    ];
  }
}