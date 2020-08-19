export default class MoveArea{
  constructor(config) {

    this.scene = config.scene;

    this.StageManager = config.StageManager;

    // this.x = 0;
    // this.y = 0;

    /*基準位置*/
    this.positionInt = {
      x: 0,
      y: 0
    }
    /*タイルの大きさを指定*/
    this.x = config.x;
    this.y = config.y;    
    /*タイルの大きさを指定*/
    this.tileWidth = config.tileWidth;
    this.tileHeight = config.tileHeight;

    this.area1Group = config.scene.add.group();
    this.area2Group = config.scene.add.group();
    this.area3Group = config.scene.add.group();
    this.createAreaPanel();
  }

  getAreaMap(setting){
    let _X = setting.pos.X;
    let _Y = setting.pos.Y;
    let target = setting.chess;
    let mapAll = setting.mapAll;
    let map  = setting.map;//自分のチェスマップ
    let map2 = setting.map2;//相手のチェスマップ
    let base1 = target.areaMapBase;
    console.log("map",map)
    console.log("map2",map2)
    let base = [];
    if(target.playerType === "player2"){
      base = base1.slice().reverse();
    }else{
      base = base1;
    }
    let moveArea = [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0]
    ];
    let harfHeight = (base.length - 1) / 2;
    let harfWidth = (base[0].length - 1) / 2;
    let baseY = harfHeight - _Y;
    let baseX = harfWidth - _X;
    let i2 = 0;
    let k2 = 0;
    let centePos = {
      X: 0,
      Y: 0
    }

    /*初期化*/

    for(var i = baseY; i < harfHeight + baseY + 1; i++){//縦（y）
      for(var k = baseX; k < harfWidth + baseX + 1; k++){//横（x）
        if(base[i][k] !== 0){
          moveArea[i2][k2] = base[i][k];
        }
        if(base[i][k] === 9){
          centePos.X = k2;
          centePos.Y = i2;
        }
        k2++;
      }
      k2 = 0;
      i2++;
    }

    for(var Y = 0; Y < mapAll.length; Y++){
      for(var X = 0; X < mapAll[Y].length; X++){
        if(mapAll[Y][X] !== 0){
          
          if(moveArea[Y][X] !== 0 && moveArea[Y][X] !== 9){
            if(centePos.Y > Y && centePos.X === X){//真上にある時
              for(var Y_TT = 0; Y_TT < Y; Y_TT++){
                moveArea[Y_TT][X] = 0;
              }
            }
            if(centePos.Y > Y && centePos.X > X){//上&左にあるとき
              for(var Y_T = 0; Y_T < Y; Y_T++){
                for(var X_l = 0; X_l <= X; X_l++){
                  moveArea[Y_T][X_l] = 0;
                }
              }
            }
            if(centePos.Y > Y && centePos.X < X){//上&右にあるとき
              for(var Y_T = 0; Y_T < Y; Y_T++){
                for(var X_R = X; X_R < mapAll[Y].length; X_R++){
                  moveArea[Y_T][X_R] = 0;
                }
              }
            }
            if(centePos.Y === Y && centePos.X > X){//真左にある時
              for(var X_LL = 0; X_LL < X; X_LL++){
                moveArea[Y][X_LL] = 0;
              }
            }
            if(centePos.Y < Y && centePos.X > X){//下&左にあるとき
              for(var Y_B = Y; Y_B < mapAll.length; Y_B++){
                for(var X_L = 0; X_L < X; X_L++){
                  moveArea[Y_B][X_L] = 0;
                }
              }
            }
            if(centePos.Y < Y && centePos.X < X){//下&右にあるとき
              for(var Y_B = Y; Y_B < mapAll.length; Y_B++){
                for(var X_R = X + 1; X_R < mapAll[Y].length; X_R++){
                  moveArea[Y_B][X_R] = 0;
                }
              }
            }
            if(centePos.Y < Y && centePos.X === X){//真下にある時
              for(var Y_BB = Y + 1; Y_BB < mapAll.length; Y_BB++){
                moveArea[Y_BB][X] = 0;
              }
            }       
            if(centePos.Y === Y && centePos.X < X){//真右にある時
              for(var X_RR = X + 1; X_RR < mapAll[Y].length; X_RR++){
                moveArea[Y][X_RR] = 0;
              }
            }
          }
        }
      }
    }


    for(var Y = 0; Y < map.length; Y++){
      for(var X = 0; X < map[Y].length; X++){
        if(map[Y][X] !== 0){
          moveArea[Y][X] = 0;
        }
      }
    }
    for(var Y = 0; Y < map2.length; Y++){
      for(var X = 0; X < map2[Y].length; X++){
        if(map2[Y][X] !== 0){
          if(moveArea[Y][X] === 1){
            moveArea[Y][X] = 0;
          }
        }
      }
    }

    return moveArea;
    
  }
  createAreaPanel(){
    //1:移動      | move_area
    //2:攻撃      | attack_area
    //3:移動＋攻撃 | attack_move_area
    this.setAreaPanel(this.area1Group,"panel_move");
    this.setAreaPanel(this.area2Group,"panel_attack");
    this.setAreaPanel(this.area3Group,"panel_move_attack");    
  }
  setAreaPanel(group,key){
    let area;
    let col = 5;
    let row = 5;
    for(var i = 0; i < row; i++){
      for(var k = 0; k < col; k++){
        area = this.scene.add.sprite(0,0,'spritesheet',key);
        area.x = k * this.tileWidth + this.tileWidth/2 + this.x;
        area.y = i * this.tileHeight + this.tileHeight/2 + this.y;  
        area.setVisible(false);
        area.depth = 10;
        group.add(area);
      }
    }
  }
  show(target){
    //添え字（y*幅+x)
    for(var i = 0; i < target.areaMap.length; i++){//y
      for(var k = 0; k < target.areaMap[i].length; k++){//x
        if(target.areaMap[i][k] === 1){
          this.area1Group.children.entries[i*target.areaMap[i].length + k].setVisible(true);
        }
        if(target.areaMap[i][k] === 2){
          this.area2Group.children.entries[i*target.areaMap[i].length + k].setVisible(true);
        }
        if(target.areaMap[i][k] === 3){
          this.area3Group.children.entries[i*target.areaMap[i].length + k].setVisible(true);
        }
      }
    };
  }
  hide(){
    this.area1Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    ); 
    this.area2Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );     
    this.area3Group.children.entries.forEach(
      (sprite) => {
        sprite.setVisible(false);
      }
    );  
  }
}
