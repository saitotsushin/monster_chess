import Character from './Character';
import MoveArea from './MoveArea';


export default class Monster extends Character {

  constructor(config) {

    super(config);

    this.type = config.type === "enemy" ? config.type : "";

    this.depth = 10;

    this.x +=  this.width/2;
    this.y +=  this.height/2;
    
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
      [0,0,0,0,0,1,0,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,2,1,0,0,0,0],
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
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,2,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0]
    ];
    this.moveAreaArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    this.attackAreaArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],      
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    /*==============================
    UI
    ==============================*/        
    this.MoveArea = new MoveArea({
      scene: this.scene,
      type: this.type,
      target: this
    });
    this.status = {
      hp: 5,
      power: 2,
      difence: 1
    }
    this.typeTxt;
    /*==============================
    敵だった場合の設定
    ==============================*/       
    if(config.type === "enemy"){
      this.typeTxt = this.scene.add.text(
        this.x + this.width/2 - 10,
        this.y + this.height/2 - 10,
        'E',
        { font: '10px Courier', fill: '#FFFFFF' }
      ); 
      this.typeTxt.depth = 11;
      this.moveAreaMapBase.reverse();
      this.attackAreaMapBase.reverse();
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
  updateChild(){
    this.typeTxt.x = this.x + 10;
    this.typeTxt.y = this.y + 10;
    this.damageText.x = this.x + 10;
    this.damageText.y = this.y + 10;
  }
  damage(attackingTarget){


    this.damageText.x = this.x + 10;
    this.damageText.y = this.y - 10;

    let damagePoint = this.status.difence - attackingTarget.status.power;
    if(damagePoint <= 0){
      damagePoint = Math.floor( Math.random() * (1 + 1 - 0) ) + 0 ;
    }
    this.status.hp -= damagePoint;
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
    console.log(this.status.hp)
    if(this.status.hp <= 0){
      console.log("HPがマイナスになりました。")

    } 
  }
}