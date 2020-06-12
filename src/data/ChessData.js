import Chess  from '../object/chess/Chess';
import Chess1 from '../object/chess/Chess1';
import Chess2 from '../object/chess/Chess2';
import Chess3 from '../object/chess/Chess3';
import Chess4 from '../object/chess/Chess4';
import Chess5 from '../object/chess/Chess5';

export default class ChessData {
  constructor() {
    this.chessList = [
      {
        key: "chess",
        no: '--',
        className: Chess,
        status: {
          hp: 5,
          maxHp: 5,
          power: 5
        },
        cost: 1,
        moveAreaMapBase: 
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase: 
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]     
      },
      {
        key: "chess_1",
        no: '01',
        className: Chess1,
        status: {
          hp: 5,
          maxHp: 5,
          power: 5
        },
        cost: 1,
        attribute: 1,
        moveAreaMapBase: 
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase: 
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]  
      },
      {
        key: "chess_2",
        no: '02',
        className: Chess2,
        status: {
          hp: 5,
          maxHp: 5,
          power: 5
        },
        cost: 2,
        attribute: 2,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase: 
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_3",
        no: '03',
        className: Chess3,
        status: {
          hp: 10,
          maxHp: 10,
          power: 5
        },
        cost: 3,
        attribute: 3,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_4",
        no: '04',
        className: Chess4,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 4,
        attribute: 1,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_5",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_6",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_7",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },      
      {
        key: "chess_8",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_9",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      },
      {
        key: "chess_10",
        no: '05',
        className: Chess5,
        status: {
          hp: 5,
          maxHp: 5,
          power: 4
        },
        cost: 5,
        attribute: 5,
        moveAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,0,0,0],
          [0,0,0,1,9,1,0,0,0],
          [0,0,0,0,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ],
        attackAreaMapBase:
        [
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0],
          [0,0,0,0,9,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0]
        ]
      }
    ];
  }
}