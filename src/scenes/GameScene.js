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

    this.setEnemy();

    
    /*==============================
    ステージ
    ==============================*/    
    this.stageLayer.setInteractive();
    this.stageLayer.on('pointerdown', function (pointer) {
      // if(this.monsterObj.isPick){

      // }
    },this);

    /*==============================
    UI
    ==============================*/        
    this.conformMordal = new ComformMordal({
      scene: this
    });

    this.setMonsterAuto();

    // this.layoutMonsters = new LayoutMonsters({
    //   scene: this
    // }); 
    // this.layoutMonsters.start(this.stageLayer);


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
        // 'monsterObj.before.y :'+this.monsterObj1.beforePosition.y,
      ]
    );


    // if (this.input.manager.activePointer.isDown)
    // {
    //   this.getTileProperties();

    // }
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
      x: 0,
      y: 0
    }

    if (tile)
    {
        postion.x = tile.x * this.map.tileWidth + this.stageLayer.x;
        postion.y = tile.y * this.map.tileHeight + this.stageLayer.y;
        return postion;
    }
  }
  setMonsterAuto(){
    this.mode = "TURN_PLAYER";
    this.enemyGroup.children.entries.forEach(
      (monster) => {
        monster.setVisible(true);
        monster.typeTxt.setVisible(true);
      }
    );
    this.conformMordal.target = this.conformMordal;
    let arr = [
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0],
      [1,1,1,1,1,0],
      [0,0,0,0,0,0],
      [0,0,0,0,0,0]
    ];
    let count = 0;
    for(var i = 0; i < arr.length; i++){
      for(var k = 0; k < arr[i].length; k++){
        if(arr[i][k] === 1){
          this.monsterGroup.children.entries[count].x = this.stageLayer.x + this.map.tileWidth * k + this.map.tileWidth/2;
          this.monsterGroup.children.entries[count].y = this.stageLayer.y + this.map.tileHeight * i + this.map.tileHeight/2;
          this.monsterGroup.children.entries[count].beforePosition.x = this.stageLayer.x + this.map.tileWidth * k + this.map.tileWidth/2;
          this.monsterGroup.children.entries[count].beforePosition.y = this.stageLayer.y + this.map.tileHeight * i + this.map.tileHeight/2;
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
    // this.enemyObj2 = new Monster({
    //   scene: this,
    //   x: this.stageLayer.x + 60,
    //   y: this.stageLayer.y + 90,
    //   key: 'monster2',
    //   type: "enemy"
    // });
    // this.enemyObj3 = new Monster({
    //   scene: this,
    //   x: this.stageLayer.x + 60,
    //   y: this.stageLayer.y + 90,
    //   key: 'monster3',
    //   type: "enemy"
    // });
    // this.enemyObj4 = new Monster({
    //   scene: this,
    //   x: this.stageLayer.x + 60,
    //   y: this.stageLayer.y + 90,
    //   key: 'monster4',
    //   type: "enemy"
    // });
    // this.enemyObj5 = new Monster({
    //   scene: this,
    //   x: this.stageLayer.x + 60,
    //   y: this.stageLayer.y + 90,
    //   key: 'monster5',
    //   type: "enemy"
    // });
    this.enemyGroup.add(this.enemyObj1);

    // this.enemyGroup.add(this.enemyObj2);
    // this.enemyGroup.add(this.enemyObj3);
    // this.enemyGroup.add(this.enemyObj4);
    // this.enemyGroup.add(this.enemyObj5);

    // this.monsterGroup.children.entries.forEach(
    //   (monster,index) => {
    //     monster.setVisible(false);
    //   }
    // );

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
      
      // arr[randomRow].splice(randomCol, 1);
      this.enemyGroup.children.entries[i].x = randomCol * this.map.tileWidth + this.stageLayer.x + this.map.tileWidth/2;
      this.enemyGroup.children.entries[i].y = randomRow * this.map.tileHeight + this.stageLayer.y + this.map.tileHeight/2;
      this.enemyGroup.children.entries[i].setMoveArea();
      this.enemyGroup.children.entries[i].hideMoveArea(false);
      // this.enemyGroup.children.entries[i].moveAreaGroup.y = this.enemyGroup.children.entries[i].y;
      this.enemyGroup.children.entries[i].setIcon();    
    }
    // this.enemyGroup.setVisible(false);
    this.enemyGroup.children.entries.forEach(
      (monster,index) => {
        monster.setVisible(false);
        monster.depth = 1;
        monster.typeTxt.setVisible(false);
      }
    );
  }
  NPC_turn(){

    /*========================
    駒を選ぶ
    ========================*/
    /*全ての相手の駒の移動エリアに自分の駒が入っているかチェック*/
    let near_monster_arr = [];
    let monsterGroup = this.monsterGroup;
    this.enemyGroup.children.entries.forEach(
      (enemy,index) => {
        enemy.alpha = 0.5;
        // for(var i = 0; i < enemy.moveAreaGroup.list.length; i++){
        //   monsterGroup.children.entries.forEach(
        //     (monster,index) => {
        //       if(
        //         monster.x === enemy.moveAreaGroup.list[i].x
        //         && monster.y === enemy.moveAreaGroup.list[i].y
        //       )
        //       {
        //         near_monster_arr.push[monster];
        //       }
        //     }
        //   );
        // }
      }
    );
    let choiceEnemyNumb;
    let enemy;
    if(near_monster_arr.length === 0){
      /*全ての相手の駒の移動エリアに自分の駒がない場合*/
      /*ランダムで駒を選んで移動する*/
      console.log("自分の駒がない場合")
      choiceEnemyNumb = this.getRandomInt(0,this.enemyGroup.children.entries.length - 1);
      enemy = this.enemyGroup.children.entries[choiceEnemyNumb];
    }else{
      /*全ての相手の駒の移動エリアに自分の駒がある場合*/
      console.log("自分の駒がある場合")
      choiceEnemyNumb = this.getRandomInt(0,near_monster_arr.length - 1);
      enemy = near_monster_arr[choiceEnemyNumb];
    }
    enemy.alpha = 1;
    // enemy.setMoveArea();
    // enemy.showMoveArea();
    
    this.scene.turn = this.scene.turn === "PLAYER1" ? "PLAYER2" : "PLAYER1";
  }

}

export default GameScene;
