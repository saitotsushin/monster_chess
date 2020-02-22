import * as StageFunc from '../plugin/StageFunc';

export default class Trap{
  constructor(config) {

    this.scene = config.scene;
    
    this.trapGroup = config.scene.add.group();
    
    this.trapBtn = this.scene.add.text(
      10,
      280,
      "トラップ",
      { font: '10px Courier', fill: '#FFFFFF' }
    );
    this.trapBtn.setInteractive();

    this.trapBtn.alpha = 0.2;

    this.canDrop = false;

    this.trapBtn.on('pointerdown', function (pointer) {   
      if(this.scene.stageManager.CHESS_STATUS === "NEXT_TURN"){
        return;
      }
      this.scene.modalManager.trap.open();
      this.scene.stageManager.CHESS_STATUS == "trap";
     
    },this);

    this.createTrapItem();

  }
  createTrapItem(){
    let trapItem;
    let trapPlayerList = this.scene.stageData.player1_TrapList;
    let trapList = this.scene.stageData.trapList;
    let className;

    for(var i = 0; i < trapPlayerList.length;i++){

      className = trapPlayerList[i].class;

      trapItem = new className({
        scene: this.scene,
        x: i * 34 + 60,
        y: 300,
        key: trapPlayerList[i].key,
        groupIndex: i
      });
      this.trapGroup.add(trapItem);
  
    }
  }
  setTrap(){
    let selectedTrap = this.scene.Player.selectedTrap;
    let k = selectedTrap.x;
    let i = selectedTrap.y;
    StageFunc.setProperty(
      this.scene,
      k,
      i,
      "trap",
      selectedTrap.object
    );

    let setPos = this.scene.stageManager.stageProp.getPositionNumber(k,i);

    selectedTrap.object.x = setPos.x;
    selectedTrap.object.y = setPos.y;

    selectedTrap.object.removeInteractive();

  }
}
  