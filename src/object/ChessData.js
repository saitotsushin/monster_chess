import Chess from './chess/Chess';
import Chess1 from './chess/Chess1';
import Chess2 from './chess/Chess2';
import Chess3 from './chess/Chess3';
import Chess4 from './chess/Chess4';
import Chess5 from './chess/Chess5';

export default class ChessData {
  constructor() {
    this.chessList = [
      {
        key: "chess",
        className: Chess,
        status: {
          hp: 35,
          maxHp: 35,
          power: 10,
          difence: 3
        }
      },
      {
        key: "chess_1",
        className: Chess1,
        status: {
          hp: 35,
          maxHp: 35,
          power: 10,
          difence: 3
        }
      },
      {
        key: "chess_2",
        className: Chess2,
        status: {
          hp: 25,
          maxHp: 25,
          power: 6,
          difence: 2
        }
      },
      {
        key: "chess_3",
        className: Chess3,
        status: {
          hp: 5,
          maxHp: 5,
          power: 2,
          difence: 1
        }
      },
      {
        key: "chess_4",
        className: Chess4,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4,
          difence: 1
        }
      },
      {
        key: "chess_5",
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4,
          difence: 1
        }
      }
    ];
  }
}