import Base from './Base';
export default class Reflect extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'ATTACK';

    this.fireType = 'ATTACKED';

    this.charaName = "リフレクト";

    this.isSet = false;
 
  }
  firing(attackingTarget){
    // alert('トラップ：リフレクト発動')
    let damagePoint = this.status.power;

    
    this.setVisible(false);
    this.item_frame.setVisible(false);
    attackingTarget.status.hp -= damagePoint;

    let _scene = attackingTarget.scene;


    if(attackingTarget.status.hp <= 0){
      if(attackingTarget.isKing){
        this.scene.STATUS.STAGE = "GAMEOVER";
        if(attackingTarget.playerType === "player1"){
          this.scene.STATUS.WIN_PLAYER = "player2";
        }
        if(attackingTarget.playerType === "player2"){
          this.scene.STATUS.WIN_PLAYER = "player1";      
        }
      }      
      attackingTarget.damage(damagePoint,'ATTACK','explode');
      let queRemove = setTimeout(function(){
        _scene.GameManager.removeChess(attackingTarget);
        clearTimeout(queRemove);
      }, 2500);
      attackingTarget.status.hp = 0;
    }else{
      attackingTarget.damage(damagePoint,'ATTACK','');
    }
  }  
}