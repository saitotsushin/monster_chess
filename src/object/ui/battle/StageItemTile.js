
export default class StageitemTile {
  constructor(config) {
    this.scene = config.scene;
    this.mapData = config.mapData;
    this.mapTile = config.mapTile;
    this.layer = config.layer;
    this.itemTouchTileGroup;
    this.selecteditem;
    this.create();
  }
  create(){
    let area;
    this.itemTouchTileGroup = this.scene.add.group();
    for(var i = 0; i < this.mapData.length; i++){
      for(var k = 0; k < this.mapData[i].length; k++){
        area = this.scene.add.sprite(0,0,'spritesheet',"chess_shadow");
        area.x = k * this.mapTile.tileWidth + this.mapTile.tileWidth/2 + this.layer.x;
        area.y = i * this.mapTile.tileHeight + this.mapTile.tileHeight/2 + this.layer.y;
        area.pos = {
          X: k,
          Y: i
        }
        area.setInteractive();
        area.setVisible(false);
        let _this = this;
        area.depth = 300;
        area.canSet = false;
        this.itemTouchTileGroup.add(area);
        area.on('pointerdown', function (pointer) {
          if(this.canSet){
            if(!_this.scene.GameManager.UIManager.selectedItem){
              alert("トラップが選択されていません。")
            }else{
              let itemIndex = _this.scene.GameManager.UIManager.selectedItem.itemIndex;
              _this.scene.GameManager.UIManager.selectedItem.isStage = true;
              _this.scene.touchCanPutTile(this.pos,itemIndex);

            }  
          }else{
          }
        }); 
      }
    }
  }
  show(){
    this.itemTouchTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(true);
      }
    );  
  }  
  hide(){
    this.itemTouchTileGroup.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );  
  }
  showCanPutTile(setting){
    let map = setting.map;
    let itemMap = setting.itemMap;
    let row = 0;
    let COL_MAX = map[0].length;

    let itemTouchTileGroup = this.itemTouchTileGroup.children.entries;
    let _this = this;

    for(var i = 0; i < map.length; i++){
      for(var k = 0; k < map[i].length; k++){
        let tile = itemTouchTileGroup[k + i * COL_MAX];
        if(map[i][k] !== 0){
          if(itemMap[i][k] === 0){
            tile.setTexture('spritesheet','panel_add_layout');
            tile.canSet = true;  
          }else{
            tile.setTexture('spritesheet','chess_shadow');
            tile.canSet = false;  
          }
        }else{
          // tile.setTexture('spritesheet','chess_shadow');
          tile.setTexture('spritesheet','chess_shadow');
          tile.canSet = false;
        }
      }
      row++;
    }

  }
}