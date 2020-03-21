import { getTilePositionNumber } from './FunctionStageProp';

export function layoutAuto(scene,player,mode){
  let playerArr = [];
  let group;
  if(player === "player1"){
    if(mode === "auto"){
      playerArr = scene.PlayerManager.player1Auto_Arr;
      scene.PlayerManager.player1_Arr = scene.PlayerManager.player1Auto_Arr;
    }else{
      playerArr = scene.PlayerManager.player1_Arr;
    }
    group = scene.PlayerManager.player1ChessGroup;
  }
  if(player === "player2"){
    if(mode === "auto" || mode === "fin"){
      playerArr = scene.PlayerManager.player2Auto_Arr;
      scene.PlayerManager.player2_Arr = scene.PlayerManager.player2Auto_Arr;
    }else{
      playerArr = scene.PlayerManager.player2_Arr;
    }
    group = scene.PlayerManager.player2ChessGroup;
  }
  let chess;
  let position;
  for(var i = 0; i < playerArr.length;i++){
    for(var k = 0; k < playerArr[i].length;k++){
      if(playerArr[i][k] !== 0){

        position = getTilePositionNumber(k,i,scene);

        chess = group.children.entries[playerArr[i][k]-1];
        chess.depth = 10;

        chess.move(position.world,{X:k,Y:i})

        // chess.x = position.world.x;
        // chess.y = position.world.y;
        // chess.pos.X = k;
        // chess.pos.Y = i;

      }
    }
  }

}