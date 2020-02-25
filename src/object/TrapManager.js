// import * as StageFunc from '../object/StageFunc';
import TrapData from './TrapData';

export default class TrapManager{
  constructor(config) {

    this.scene = config.scene;
    
    this.trapGroup = config.scene.add.group();

    this.TrapData = new TrapData({
      scene: this.scene
    });

    this.trapBtn = this.scene.add.text(
      10,
      280,
      "トラップ",
      { font: '10px Courier', fill: '#FFFFFF' }
    );
    this.trapBtn.setInteractive();

    this.trapBtn.alpha = 0.2;

    this.createTrap("player1");
    // this.createTrap("player2");

  }
  createTrap(mode){
    let playerTrapList = this.TrapData.player1_TrapList;
    let trapList = this.TrapData.trapList;
    let sprite;

    for(var i = 0; i < playerTrapList.length;i++){

      trapList.filter(function(item, index){
        if(item.key === playerTrapList[i]){
          sprite = new item.className({
            scene: this.scene,
            x: i * 40 + 100,
            y: 280,
            key: item.key,
            groupIndex: i
          });
          this.trapGroup.add(sprite);
        }
      },this);

    }
    console.log("this.trapGroup",this.trapGroup)
    console.log("this.scene",this.scene)
  }
  // setTrap(){
  //   let selectedTrap = this.scene.Player.selectedTrap;
  //   let k = selectedTrap.x;
  //   let i = selectedTrap.y;
  //   StageFunc.setProperty(
  //     this.scene,
  //     k,
  //     i,
  //     "trap",
  //     selectedTrap.object
  //   );

  //   let setPos = this.scene.stageManager.stageProp.getPositionNumber(k,i);

  //   selectedTrap.object.x = setPos.x;
  //   selectedTrap.object.y = setPos.y;

  //   selectedTrap.object.removeInteractive();

  // }
}
  