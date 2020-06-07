
import ChessData     from '../../data/ChessData';
import Chess         from '../ui/menu/Chess';

export default class CreateChessInfo {
  constructor(config) {
    this.scene = config.scene;
    this.addGroup = config.addGroup;
    this.chessData = config.chessData;
    this.create();
  }
  create(){

    this.ChessInfoMoveGroup = this.scene.add.group();

    this.titleYourChess = this.scene.add.sprite(
      this.scene.sys.game.config.width/2,
      110,
      'spritesheet',
      'tile_your_chess'
    );
    this.overlapArea = this.scene.add.graphics(
      {
        fillStyle: { color: 0x000000 }
      }
    );    
    this.rect = new Phaser.Geom.Rectangle(0, 140, this.scene.game.config.width, 100);
    this.overlapArea.fillRectShape(this.rect);
    // this.overlapArea.alpha = 0.75;
    // this.overlapArea.setScrollFactor(0);    
    /*==============================
    チェスグループの生成
    ------------------------------*/  
    this.ChessData = new ChessData();

    let playerChessList = this.chessData;
    
    let chessDataList = this.ChessData.chessList;

    for(var i = 0; i < playerChessList.length;i++){
      chessDataList.filter(function(item, index){
        if(item.key === playerChessList[i]){
          let sprite = new Chess({
            scene: this.scene,
            x: i * 32 + 16,
            y: 140,
            frame: item.key,
            key: 'spritesheet'
          });
          sprite.depth = 20;
          // sprite.setInteractive();
          sprite.status = item.status;
          sprite.cost = item.cost;
          sprite.no = item.no;
          sprite.maxHp = item.maxHp;
          sprite.status = item.status;
          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );

          let settingPos = {
            x: i * 32 + 16,
            y: 140
          };
          sprite.move(settingPos);

          let settingStatus = {
            power: item.status.power,
            hp: item.status.maxHp
          };
          sprite.setStatus(settingStatus);

          this.addGroup.add(sprite);

          
          for(var l = 0; l < 9; l++){
            for(var n = 0; n < 9; n++){
              let movearea;
              if(sprite.areaMapBase[l][n] === 1){//移動
                movearea = "movearea_s_move";
              }
              if(sprite.areaMapBase[l][n] === 2){//攻撃
                movearea = "movearea_s_attack";
              }
              if(sprite.areaMapBase[l][n] === 3){//移動＆攻撃
                movearea = "movearea_s_move_attack";
              }
              if(sprite.areaMapBase[l][n] === 9){//移動
                movearea = "movearea_s_chess";
              }
              if(sprite.areaMapBase[l][n] === 0){//なし
                movearea = "movearea_s_default";
              }              
              let move_area_sprite = this.scene.add.sprite(
                n * 5 + i * 32 + n - 8,
                l * 5 + 152 + l,
                'spritesheet',
                movearea
              );
              if( l < 2 || 6 < l){
                move_area_sprite.setVisible(false);
              }
              if( n < 2 || 6 < n){
                move_area_sprite.setVisible(false);
              }
            }
          }            
        }
      },this);
    }
  }
  getAreaMap(X,Y,target){

    let base1 = target.areaMapBase;
    let base = [];
    if(target.playerType === "player2"){
      base = base1.slice().reverse();
    }else{
      base = base1;
    }
    let moveArea = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2 + 0.5;
    // let harfWidth = 7;
    let baseY = harfHeight - Y;
    let baseX = harfWidth - X - 0.5;
    let i2 = 0;
    let k2 = 0;
    let centePos = {
      X: 0,
      Y: 0
    }

    let groupCount = 0;
    let ChessInfoMoveGroup = this.ChessInfoMoveGroup.children.entries;

    /*初期化*/
    for(var i = baseY; i < harfHeight + baseY + 1; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX + 1; k++){//横（x）
        if(base[i][k] === 1){//移動
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move');
        }
        if(base[i][k] === 2){//攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_attack');
        }
        if(base[i][k] === 3){//移動＆攻撃
          moveArea[i2][k2] = base[i][k];
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_move_attack');
        }
        if(base[i][k] === 9){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_chess');
        }
        if(base[i][k] === 0){
          ChessInfoMoveGroup[groupCount].setTexture('spritesheet','movearea_s_default');
        }
        k2++;
        groupCount++;
      }
      k2 = 0;
      i2++;
    }
    
  }  
}