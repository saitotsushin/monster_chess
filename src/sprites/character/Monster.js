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
      [0,0,0,0,1,1,1,0,0,0,0],
      [0,0,0,0,1,1,1,0,0,0,0],
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
    /*==============================
    UI
    ==============================*/        
    this.MoveArea = new MoveArea({
      scene: this.scene,
      type: this.type,
      target: this
    });
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
}