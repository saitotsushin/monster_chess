import Monster from '../sprites/character/Monster';
import ComformMordal from '../ui/ComformMordal';
import LayoutMonsters from '../ui/LayoutMonsters';

class GameScene extends Phaser.Scene {
  constructor(test) {
      super({
          key: 'GameScene'
      });
  }
  create(){

    this.mode = "";

    this.turn = "PLAYER1";

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');
    this.stageLayer = this.map.createDynamicLayer('stage', this.tileset, 0, 0);
    this.stageLayer.setCollisionBetween(0, 100);
    this.stageLayer.setCollisionByProperty({ collides: true });
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    this.stageLayer.x = (this.game.config.width - this.stageLayer.width) /2;
    this.stageLayer.y = (this.game.config.height - this.stageLayer.height) /2;



    this.keys = {
      TOUCH_START:{
        x: 0,
        y: 0
      },
      TOUCH_END:{
        x: 0,
        y: 0
      },
      isTOUCH: false,
      isRELEASE: false
    };

    /*==============================
    モンスター
    ==============================*/        
    this.monsterObj1 = new Monster({
      scene: this,
      x: this.stageLayer.x,
      y: this.stageLayer.y,
      key: 'monster1'
    }); 
    
    this.monsterObj2 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster2'
    });
    this.monsterObj3 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster3'
    });
    this.monsterObj4 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster4'
    });
    this.monsterObj5 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster5'
    });

    this.monsterGroup = this.add.group();

    this.monsterGroup.add(this.monsterObj1);
    this.monsterGroup.add(this.monsterObj2);
    this.monsterGroup.add(this.monsterObj3);
    this.monsterGroup.add(this.monsterObj4);
    this.monsterGroup.add(this.monsterObj5);



    this.touchedTile;
    this.tilePropertyData;
    this.pickChess;
    this.monsterStatus;
    this.attackTarget;

    /*==============================
    ステージ
    ==============================*/    
    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {
      /*----------------
      念の為に初期化
      ----------------*/
      this.touchedTile = null;
      this.tilePropertyData = null;

      this.touchedTile = this.getTilePosition();
      this.tilePropertyData = this.tilePropertyArr[this.touchedTile.localInt.y][this.touchedTile.localInt.x];
      if(this.tilePropertyData === 0){
        if(this.pickChess){
          if(this.pickChess.moveAreaArr[this.touchedTile.localInt.y][this.touchedTile.localInt.x] === 1){
            this.monsterStatus = "move";
            // this.pickChess.x = this.touchedTile.world.x + this.pickChess.width/2;
            // this.pickChess.y = this.touchedTile.world.y + this.pickChess.width/2;
            this.setObjectTilePosition[this.touchedTile.localInt.x,this.touchedTile.localInt.y,this.pickChess]
            this.conformMordal.open();
          }else{
            this.conformMordal.close();
            this.attackTarget = null;
          }
        }
        return;
      }
      if(this.tilePropertyData.object.type !== "enemy"){
        if(this.pickChess){
          this.resetMonsterPosition();
        }
        this.pickChess = this.tilePropertyData.object;
        this.tilePropertyData.object.MoveArea.show(this.tilePropertyData.object);
      }else{
        if(this.pickChess.attackAreaArr[this.touchedTile.localInt.y][this.touchedTile.localInt.x] === 1){
          this.monsterStatus = "attack";
          this.attackTarget = this.tilePropertyData.object;
          this.conformMordal.open();
        }
      }
    },this);

    /*==============================
    UI
    ==============================*/        
    this.conformMordal = new ComformMordal({
      scene: this
    });

    this.tilePropertyArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];

    this.player1_Arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];

    this.player2_Arr = [
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];

    this.stageCanSetArr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];

    this.setMonster();

    this.setEnemy();

    this.setTilePropaties();



    /*==============================
    デバッグ
    ==============================*/
    this.debugText = this.add.text(10, 10, '', { font: '10px Courier', fill: '#FFFFFF' });
    this.debugText.depth = 100;
    this.debugText.setScrollFactor(0,0);

    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0,this. map.tileWidth, this.map.tileHeight);
    this.marker.depth = 5;
  }

  update(time, delta) {
    /*==============================
    デバッグ START
    ------------------------------*/    
    this.debugText.setText(
      [
        'this.turn :'+this.turn,
      ]
    );

    /*------------------------------
    デバッグ END
    ==============================*/
  }
  
  getRandomInt(min, max) {
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  };

  getTilePosition(){

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = this.map.worldToTileX(worldPoint.x);
    var pointerTileY = this.map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    this.marker.x = this.map.tileToWorldX(pointerTileX);
    this.marker.y = this.map.tileToWorldY(pointerTileY);
    var tile = this.map.getTileAt(pointerTileX, pointerTileY);

    let postion = {
      localInt: {
        x: 0,
        y: 0  
      },
      world:{
        x: 0,
        y: 0  
      }
    }

    if (tile)
    {
        postion.world.x = tile.x * this.map.tileWidth + this.stageLayer.x;
        postion.world.y = tile.y * this.map.tileHeight + this.stageLayer.y;
        postion.localInt.x = (postion.world.x - this.stageLayer.x) /this.map.tileWidth;
        postion.localInt.y = (postion.world.y - this.stageLayer.y) /this.map.tileHeight;
        return postion;
    }
  }
  getMonsterPostion(pos){
    let setPos = {
      x: pos.x,
      y: pos.y
    }
    setPos.x = (pos.x - this.stageLayer.x) / this.map.tileWidth;
    setPos.y = (pos.y - this.stageLayer.y) / this.map.tileWidth;
    return setPos;
  }
  setObjectTilePosition(x,y,chess){
    console.log("x:"+x+"/y:"+y+"/chess:"+chess)
    let setPos = {
      x: x,
      y: y
    }
    chess.x = (pos.x - this.stageLayer.x - this.map.tileWidth/2) / this.map.tileWidth;
    chess.y = (pos.y - this.stageLayer.y - this.map.tileWidth/2) / this.map.tileWidth;
    // return setPos;  
  }
  setTilePropaties(){
    this.monsterGroup.children.entries.forEach(
      (enemy,index) => {
      let postion = this.getMonsterPostion(enemy.getBounds());
      this.tilePropertyArr[postion.y][postion.x] = {
        object: enemy
      };
    }
    ,this
    );
    this.enemyGroup.children.entries.forEach(
      (enemy,index) => {
      let postion = this.getMonsterPostion(enemy.getBounds());
      this.tilePropertyArr[postion.y][postion.x] = {
        object: enemy
      };
    }
    ,this
    );
  }

  setMonster(){
    let count = 0;
    for(var i = 0; i < this.player1_Arr.length; i++){
      for(var k = 0; k < this.player1_Arr[i].length; k++){
        if(this.player1_Arr[i][k] === 1){
          this.monsterGroup.children.entries[count].x = this.stageLayer.x + this.map.tileWidth * k + this.map.tileWidth/2;
          this.monsterGroup.children.entries[count].y = this.stageLayer.y + this.map.tileHeight * i + this.map.tileHeight/2;
          this.monsterGroup.children.entries[count].beforePosition.x = this.stageLayer.x + this.map.tileWidth * k + this.map.tileWidth/2;
          this.monsterGroup.children.entries[count].beforePosition.y = this.stageLayer.y + this.map.tileHeight * i + this.map.tileHeight/2;
          this.monsterGroup.children.entries[count].MoveArea.initSetPosition(this.monsterGroup.children.entries[count]);
          count++;
        }
      }
    }
  }


  setEnemy(){
    /*==============================
    敵のモンスター
    ==============================*/    
    this.enemyGroup = this.add.group();
    this.enemyObj1 = new Monster({
      scene: this,
      x: this.stageLayer.x + 60,
      y: this.stageLayer.y + 90,
      key: 'monster1',
      type: "enemy"
    });
    this.enemyGroup.add(this.enemyObj1);

    let arr = [
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ];

    let randomRow = 0;
    let randomCol = 0;

    for(var i = 0; i < this.enemyGroup.children.entries.length; i++){

      randomRow = this.getRandomInt(0,2);
      randomCol = this.getRandomInt(0,arr[randomRow].length - 1);

      if(arr[randomRow][randomCol] === 1){
        arr[randomRow][randomCol] = 0;
      }else{
        for(var k = 0; k < arr[randomRow].length; k++){
          if(arr[randomRow][k] === 1){
            randomCol = k;
            arr[randomRow][k] = 0;
            break;
          }
        }
      }
      this.enemyGroup.children.entries[i].x = randomCol * this.map.tileWidth + this.stageLayer.x + this.map.tileWidth/2;
      this.enemyGroup.children.entries[i].y = randomRow * this.map.tileHeight + this.stageLayer.y + this.map.tileHeight/2;
      this.enemyGroup.children.entries[i].MoveArea.initSetPosition(this.enemyGroup.children.entries[i]);
    }

  }
  resetMonsterPosition(){
    this.monsterGroup.children.entries.forEach(
      (enemy,index) => {
        enemy.x = enemy.beforePosition.x;
        enemy.y = enemy.beforePosition.y;
      },this
    );    
  }
  setMoveAreaResetAll(){
    this.monsterGroup.children.entries.forEach(
      (monster) => {
        monster.MoveArea.hide(monster.MoveArea.moveAreaGroup);
        monster.MoveArea.hide(monster.MoveArea.attackAreaGroup);
        // monster.isPick = false;
      },this
    );
  }
  NPC_turn(){
    /*
    TODO
    敵のターン
    一旦飛ばす
     */
    //敵のグループ全てに評価値を計算する
    this.enemyGroup.children.entries.forEach(
      (enemy) => {
        this.searchAreaToMonster(enemy);    
      },this
    );    
    //攻撃か移動か

    this.scene.turn = this.scene.turn === "PLAYER1" ? "PLAYER2" : "PLAYER1";
  }
  searchAreaToMonster(enemy){
    enemy.MoveArea.show(enemy);
    let evaluationValue = 0;//評価値
    let monster;
    let evaluationArr = [];
    let mode = "";
    let evaluationPoint = 0;
    switch(mode){
      case 'attackToDestroy':
        evaluationPoint = 5;
        break;
      case 'attackToAlive':
        evaluationPoint = 4;
        break;
      case 'moveToAttackToDestroy':
        evaluationPoint = 3;
        break;
      case 'moveToAttackToAlive':
        evaluationPoint = 1;
        break;
      default:
    }
    //攻撃→倒せる 5pt
    //攻撃→倒せない 4pt
    //移動→攻撃→倒せる 3pt
    //移動→攻撃→倒せない 1pt
    // this.searchAttackAreaToMonster(enemy);

    /*=====================
    攻撃相手を優先的に検索
    =====================*/
    // for(var i = 0; i < enemy.attackAreaArr.length; i++){//縦(y)
    //   for(var k = 0; k < enemy.attackAreaArr[i].length;k++){//横(x)
    //     if(this.tilePropertyArr[i][k] !== 0
    //       && enemy.attackAreaArr[i][k] === 1
    //       && this.tilePropertyArr[i][k].object.type !== "enemy")
    //     {
          // monster = this.tilePropertyArr[i][k];
          // if(0 <= monster.status.hp - (monster.status.diffence - enemy.status.power)){
          //   //モンスターを倒せる場合
          //   evaluationValue = 2;
          // }else{
          //   evaluationValue = 1;
          // }
          // evaluationArr.push(
          //   {
          //     monter: monter,
          //     value: evaluationValue,
          //     mode: "attack"
          //   }
          // );
    //     }
    //   }
    // }
    // if(evaluationArr.length > 0){
    //   //攻撃相手がいたら優先する
    //   return;
    // }
    /*=====================
    移動
    =====================*/    
    for(var i = 0; i < enemy.moveAreaArr.length; i++){//縦(y)
      for(var k = 0; k < enemy.moveAreaArr[i].length;k++){//横(x)
        if(this.tilePropertyArr[i][k] === 0
          && enemy.moveAreaArr[i][k] === 1
        )
        {
          //敵の駒を一度配置し、攻撃エリア毎に評価値を計算する
        }
      }
    }
  }
  
}

export default GameScene;
