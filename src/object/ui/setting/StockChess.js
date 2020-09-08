import Chess from '../menu/Chess';

export default class StockChess{
  constructor(config) {

    this.scene = config.scene;

  }
  create(){
    this.playerStockChessGroup = this.scene.add.group();
    this.StockChessContainer = this.scene.add.container(0, 0);
    this.ChessBaseGroup = this.scene.add.group();
    /*=================
    ストックしているチェス
    =================*/
    /*タイトル：TEAM*/
    this.titleStockChess = this.scene.add.bitmapText(
      10,
      45,
      'bitmapFont',
      'STOCK CHESS',
      10
    );
    this.StockChessContainer.add(
      [
        this.titleStockChess
      ]
    );

    

  }
  /*==============================
  所有しているチェスたち
  ------------------------------*/   
  setStockChessGroup(setting){
    let chessList = setting.chessList;
    let stockData = setting.stockData;
    let chessData = setting.chessData;
    let sprite;
    let group = this.playerStockChessGroup;
    /*レイアウトの設定周り START*/
    let baseHeight = 68;
    let addHeight = 20;
    let n = 0;
    let tileX = 0;
    let tileY = 0;
    let panel = "";
    /*レイアウトの設定周り END*/

    for(var i = 0; i < stockData.length; i++){
      chessList.filter(function(item, index){
        if(item.key === stockData[i]){
          /*レイアウトの設定周り START*/
          if(i % 6 === 0 && i !== 0){
            baseHeight += addHeight;
            tileX = 0;
            tileY++;
          }
          if(5 < i && i < 12){
            if(i % 2 === 1){
              panel = "panel_layout_2";
            }else{
              panel = "panel_layout_1";
            }
          }else{
            if(i % 2 === 1){
              panel = "panel_layout_1";
            }else{
              panel = "panel_layout_2";
            }
          }
          /*レイアウトの設定周り END*/
    
          
          sprite = new Chess({
            scene: this.scene,
            x: tileX * addHeight + 20,
            y: baseHeight,
            frame: item.key,
            key: 'spritesheet'
          });

          /*すでにチームに設定されていたら押せない*/
          if (chessData.indexOf(item.key) >= 0){
            sprite.alpha = 0.4;
            sprite.isTeam = true;
          }
          
          sprite.cost = item.cost;
          sprite.no = item.no;

          sprite.moveAreaMapBase = item.moveAreaMapBase;
          sprite.attackAreaMapBase = item.attackAreaMapBase;

          
          sprite.areaMapBase = sprite.mergeArea(
            sprite.moveAreaMapBase,
            sprite.attackAreaMapBase,
            sprite.areaMapBase
          );
          sprite.status = item.status;
          sprite.type = "stock";
          sprite.charaName = item.key;
          sprite.setted = false;
          sprite.depth = 12;

          group.add(sprite);

          let base = this.scene.add.sprite(
            tileX * addHeight + 20,
            baseHeight,
            'spritesheet',
            panel
          );
          base.depth = 8;


          this.ChessBaseGroup.add(base);

          tileX++;

        }

      },this);

    }

  }
  updateStockChess(){
    let teamChessList = this.scene.teamGroup;
    this.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        sprite.alpha = 1;
      }
    );
    this.playerStockChessGroup.children.entries.forEach(
      (sprite) => {
        if (teamChessList.indexOf(sprite.charaName) >= 0){
          sprite.alpha = 0.4;
          // sprite.isTeam = true;
        }
      }
    );
  }
}
