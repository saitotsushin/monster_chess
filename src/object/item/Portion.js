import Base from './Base';
export default class Portion extends Base {

  constructor(config) {

    super(config);

    this.scene = config.scene;

    this.depth = 5;

    this.x = config.x;

    this.y = config.y;

    this.itemTYPE = 'CURE';
    this.fireType = 'STEP_ON';

    this.charaName = "ポーション";

    this.isSet = false;

  }
  firing(cureTarget){
    // alert('アイテム：ポーション発動')

    // if(this.scene.registry.list.gameMode === "NET"){
    //   this.scene.StageManager.Network.fireditem(
    //     cureTarget.groupIndex,
    //     cureTarget.playerType,
    //     cureTarget.pos
    //   );
    // }
    let curePoint = cureTarget.status.maxHp - cureTarget.status.hp;
    cureTarget.status.hp = cureTarget.status.maxHp;
    // let nowHp = cureTarget.status.hp + curePoint;
    // let maxHp = cureTarget.status.maxHp;
    // if(nowHp > maxHp){
    //   cureTarget.status.hp = maxHp;
    // }else{
    //   cureTarget.status.hp += curePoint;
    // }
    cureTarget.damage(curePoint,'CURE');
    this.setVisible(false);
    this.item_frame.setVisible(false);
  }  
}