import Character from './Character';
import MoveArea from './MoveArea';


export default class Monster extends Character {

  constructor(config) {

    super(config);

    this.type = config.type === "enemy" ? config.type : "";

    this.typeTxt;


    this.modelText = {
      move: {
        text: "移動しますか？",
        yes: "はい",
        no: "いいえ"
      },
      attack: {
        text: "攻撃しますか？",
        yes: "はい",
        no: "いいえ"
      },
      search: {
        text: "情報を見ますか？",
        yes: "はい",
        no: "いいえ"
      }
    };    


    this.depth = 10;

    this.setInteractive();

    this.x +=  this.width/2;
    this.y +=  this.height/2;
    
    this.beforePosition = {
      x: this.x,
      y: this.y
    };
    // this.setStage = false;
    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.moveAreaMap = 
    [
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0],
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
    /*==============================
    UI
    ==============================*/        
    this.MoveArea = new MoveArea({
      scene: this.scene,
      type: this.type,
      target: this
    });
    
    /*==============================
    モンスターの移動の操作
    ==============================*/      
    this.isPick = false;

    this.on('pointerdown', function (pointer) {
      console.log("mx="+this.x+"/my="+this.y)

      if(this.type === "enemy"){
        /*
        TODO
        敵をクリックしたら、敵の駒の情報を見る
        */
        // return;
      }
      if(this.scene.mode === "TURN_PLAYER"){
        if(this.type === "enemy"){
          return;
        }
      }


      if(this.scene.mode === "SET_MONSTER"){
        this.pickMonster(this);
      }else{
        this.setMoveArea();
      }
      this.isPick = true;  
    },this);
  }

  seveBeforePostion(x,y){
    this.beforePosition.x = x;
    this.beforePosition.y = y;
  }
  setBeforePostion(){
    this.x = this.beforePosition.x;
    this.y = this.beforePosition.y;    
  }
  setResetAll(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.hideMoveArea();
        monster.isPick = false;
        monster.x = monster.beforePosition.x;
        monster.y = monster.beforePosition.y;   
        // sprite.update(time, delta);
      }
    );  
  }
  setIcon(){
    if(this.type === "enemy"){
      this.typeTxt.x = this.x + 10;    
      this.typeTxt.y = this.y + 10;    
    }
  }
  pickMonster(object){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 0.5;
        monster.isPick = false;
        // monster.hideMoveArea();
        // monster.isPick = false;
        // monster.x = monster.beforePosition.x;
        // monster.y = monster.beforePosition.y;   
        // sprite.update(time, delta);
      }
    ); 
    object.alpha = 1; 
    object.isPick = true;
  }
  resetPickMonster(){
    this.scene.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.alpha = 1;
        monster.isPick = false;
      }
    );    
  }
  setModalTextMoving(){
    this.scene.conformMordal.mordalText.setText(this.modelText.move.text);
    this.scene.conformMordal.btn_yes.setText(this.modelText.move.yes);
    this.scene.conformMordal.btn_no.setText(this.modelText.move.no);    
  }
  setModalTextAttacking(){
    this.scene.conformMordal.mordalText.setText(this.modelText.attack.text);
    this.scene.conformMordal.btn_yes.setText(this.modelText.attack.yes);
    this.scene.conformMordal.btn_no.setText(this.modelText.attack.no);    
  }
}