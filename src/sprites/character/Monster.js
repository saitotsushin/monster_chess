import Character from './Character';



export default class Monster extends Character {

  constructor(config) {

    super(config);

    this.type = config.type;

    this.depth = 10;

    this.x +=  this.width/2;
    this.y +=  this.height/2;

    this.groupIndex = config.groupIndex;
    
    this.beforePosition = {
      x: this.x,
      y: this.y
    };
    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.moveAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,9,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.attackAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,2,2,2,0,0,0,0],
      [0,0,0,0,0,2,0,0,0,0,0],
      [0,0,0,0,0,9,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.areaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,9,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];

    this.areaArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]      
    ];
    this.areaMapBase = this.mergeArea(this.moveAreaMapBase,this.attackAreaMapBase,this.areaMapBase);

    this.status = {
      hp: 5,
      power: 4,
      defense: 1
    }
    this.typeTxt;
    /*==============================
    敵だった場合の設定
    ==============================*/       
    if(config.type === "player2"){
      this.typeTxt = this.scene.add.text(
        this.x + this.width/2 - 10,
        this.y + this.height/2 - 10,
        'E',
        { font: '10px Courier', fill: '#FFFFFF' }
      ); 
      this.typeTxt.depth = 11;
      let arr = this.areaMapBase.reverse();
      this.areaMapBase = arr;
      
    }
    this.damageText = this.scene.add.text(
      this.x + this.width/2 - 10,
      this.y + this.height/2 - 10,
      '0',
      { font: '15px Courier', fill: '#FF0000' }
    ); 
    this.damageText.depth = 12;
    this.damageText.setVisible(false);
  }
  getPostion(pos){
    let setPos = {
      x: pos.x,
      y: pos.y
    }
    setPos.x = (pos.x - this.scene.stageLayer.x - this.width/2) / this.scene.map.tileWidth;
    setPos.y = (pos.y - this.scene.stageLayer.y - this.width/2) / this.scene.map.tileWidth;
    return setPos;
  }

  
  attack(attackingTarget){

    console.log('%c'+this.type+'が攻撃しました。', 'color: #000;background-color:yellow;');

    let damagePoint = this.status.power - attackingTarget.status.defense;

    if(damagePoint <= 0){
      damagePoint = this.scene.getRandomInt(0,1);
    }
    attackingTarget.damage(damagePoint);
    attackingTarget.status.hp -= damagePoint;

    if(attackingTarget.status.hp <= 0){
      console.log('%c'+attackingTarget.type+'のHPがマイナスになりました。', 'color: #000;background-color:yellow;');
      this.scene.stageManager.removeChess(attackingTarget);
    } 
  }
  move(x,y,player,mode){
    // let playerStageData;
    
    let setPos = this.scene.stageManager.getPositionNumber(x,y);
    this.x = setPos.x;
    this.y = setPos.y;
    //ステージデータの更新
    this.scene.stageData.tilePropertyArr[this.scene.stageManager.beforeChessPos.y][this.scene.stageManager.beforeChessPos.x].object = "";
    this.scene.stageData.tilePropertyArr[y][x].object = this;
    //移動エリアデータの更新
    player.areaArr = this.scene.stageManager.moveArea.setArrPosition(x,y,player,"move");
  }
  damage(damagePoint){
    this.damageText.x = this.x + 10;
    this.damageText.y = this.y - 10;

    let afterY = this.damageText.y + 10;
    this.damageText.setVisible(true);
    this.damageText.setText(damagePoint);
    let damageTween = this.scene.tweens.add({
        targets: this.damageText,
        y: afterY,
        ease: 'liner',
        duration: 100,
        repeat: 0,
        completeDelay: 1000,
        onComplete: function () {
          this.damageText.setVisible(false);
        },
        callbackScope: this
    });
  }
  mergeArea(area1,area2,merge_area){

    for(var i = 0; i < area1.length; i++){
      for(var k = 0; k < area1[i].length; k++){
        if(area1[i][k] + area2[i][k] > 9){
          //中心点は9にしておく
          merge_area[i][k] = 9;
        }else{
          merge_area[i][k] = area1[i][k] + area2[i][k];
        }
      }

    }
    return merge_area;

  }
}