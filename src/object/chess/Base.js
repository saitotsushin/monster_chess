export default class Base extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key,config.frame,config.playerType);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.playerType = config.playerType;

    this.isKing = false;

    /*==============================
    モンスターの移動エリアの表示
    ==============================*/    
    this.moveAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];
    this.attackAreaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];
    this.areaMapBase = 
    [
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,9,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ];

    this.areaMap = [
      [0,0,0,0,0],
      [0,0,0,0,0],      
      [0,0,0,0,0],      
      [0,0,0,0,0],      
      [0,0,0,0,0,]      
    ];

    this.name = config.frame;
    this.status = {
      hp: 5,
      maxHp: 5,
      power: 4,
      difence: 1,
      condition: ""
    }
    this.attribute = "";
    this.tilePos = {
      X: 0,
      Y: 0
    }
    this.depth = 10;
    this.damageText = this.scene.add.bitmapText(
      this.x,
      this.y + this.height/2,
      'bitmapFont',
      '0',
      10
    );
    this.damageText.depth = 300;
    this.damageText.setVisible(false);

    /*敵のアイコン*/
    this.icon_enemy = this.scene.add.sprite(this.x,this.y,'spritesheet','icon_enemy');
    this.icon_enemy.setVisible(false);
    this.icon_enemy.depth = 20;
    /*王のアイコン*/
    this.icon_king = this.scene.add.sprite(this.x,this.y,'spritesheet','icon_king');
    this.icon_king.setVisible(false);
    this.icon_king.depth = 20;

    /*レベルアップのアイコン（地形）*/
    this.icon_levelup = this.scene.add.sprite(this.x,this.y,'spritesheet','icon_level_up');
    this.icon_levelup.setVisible(false);
    this.icon_levelup.depth = 20;

    this.attackingTarget;

    this.chessStatus = this.scene.add.sprite(
      0,
      0,
      'spritesheet',
      'chess_status'
    );
    this.chessStatus.depth = 11;
    this.chessStatus.setVisible(false);

    this.AT_text = this.scene.add.bitmapText(
      0,
      0,
      'bitmapFontWhite',
      0,
      10
    );
    this.AT_text.setLetterSpacing(-6);
    this.AT_text.depth = 12;
    this.AT_text.setVisible(false);

    this.HP_text = this.scene.add.bitmapText(
      0,
      0,
      'bitmapFontWhite',
      0,
      10
    ); 
    this.HP_text.setLetterSpacing(-6);
    this.HP_text.depth = 13;
    this.HP_text.setVisible(false);

    this.setVisible(false);
    // /*アニメコンプリート->爆発を消す*/
    this.on('animationcomplete', function(){this.explodeComplete(this)}, this);
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
  move(position,int){
    this.x = position.x;
    this.y = position.y;
    this.tilePos.X = int.X;
    this.tilePos.Y = int.Y;

    this.chessStatus.x = position.x;
    this.chessStatus.y = position.y;

    this.AT_text.x = position.x - 11;
    this.AT_text.y = position.y + 6;
    this.HP_text.x = position.x + 2;
    this.HP_text.y = position.y + 6;

    this.icon_king.x = position.x - 9;
    this.icon_king.y = position.y - 10;        
    
    this.icon_levelup.x = position.x - 9;
    this.icon_levelup.y = position.y;   

    if(this.playerType === 'player2'){
      this.icon_enemy.x = position.x;
      this.icon_enemy.y = position.y;
    }
    //地形の力
    let myAttribute = Number(this.attribute);
    let groundType = this.scene.registry.list.mapData[this.tilePos.Y][this.tilePos.X];
    if(myAttribute === groundType){
      this.icon_levelup.setVisible(true);
    }else{
      this.icon_levelup.setVisible(false);
    }
  }
  attack(attackingTarget){
    if(this.status.hp <= 0){
      return false;
    }
    let groundType = this.scene.registry.list.mapData[attackingTarget.tilePos.Y][attackingTarget.tilePos.X];
    let power = 0;
    let myAttribute = Number(this.attribute);
    let enemyAttribute = Number(attackingTarget.attribute);
    /*ターゲットの保存。爆発の後のremoveで使用する*/
    //地形の力
    if(myAttribute === groundType){

      power = this.status.power * 2;

    }else{
      power = this.status.power;
    }
    //属性の優劣
    // if(myAttribute !== enemyAttribute){
    //   if(myAttribute === 1 && enemyAttribute === 2){
    //     power = this.status.power * 100;
    //   }
    //   if(myAttribute === 2 && enemyAttribute === 3){
    //     power = this.status.power * 100;
    //   }
    //   if(myAttribute === 3 && enemyAttribute === 1){
    //     power = this.status.power * 100;
    //   }
    // }
    attackingTarget.status.hp -= Number(power);


    if(attackingTarget.status.hp <= 0){
      attackingTarget.status.hp = 0;
      this.attackingTarget = attackingTarget;
      this.attackingTarget.status.condition = "explode";
      if(this.attackingTarget.isKing){
        this.scene.STATUS.STAGE = "GAMEOVER";
        if(this.attackingTarget.playerType === "player1"){
          this.scene.STATUS.WIN_PLAYER = "player2";
        }
        if(this.attackingTarget.playerType === "player2"){
          this.scene.STATUS.WIN_PLAYER = "player1";      
        }
      }
      attackingTarget.damage(Number(power),'ATTACK','explode');
    }else{
      // if(this.scene.registry.list.gameMode === "NET"){
      //   this.scene.StageManager.Network.condition = '';
      // }      
      attackingTarget.damage(Number(power),'ATTACK','');
      this.attackingTarget = "";//撃破しなかったらリセット。
    }

  }
  setStatus(setting){
    let _power = setting.power;
    let _hp = setting.hp;
    this.AT_text.setText(_power);
    this.HP_text.setText(_hp);
  }  
  damage(damagePoint,mode,status){
    console.log("mode",mode)
    if(mode === "ATTACK"){
      this.damageText.setTexture('bitmapFontRed');
      this.scene.GameManager.UIManager.AnimeAttack.anims.play('anime_attack');
    }else{
      this.damageText.setTexture('bitmapFontBlue');
      this.scene.GameManager.UIManager.AnimeAttack.anims.play('anime_portion');
    }
    this.damageText.x = this.x + 5;
    this.damageText.y = this.y - 5;

    /*攻撃アニメーションの追加*/
    this.scene.GameManager.UIManager.AnimeAttack.x = this.x;
    this.scene.GameManager.UIManager.AnimeAttack.y = this.y;
    this.scene.GameManager.UIManager.AnimeAttack.setVisible(true)

    let afterY = this.damageText.y + 5;

    this.damageText.setVisible(true);
    this.damageText.setText(damagePoint);

    this.damageText.alpha = 0;

    let damageTween = this.scene.tweens.add({
      targets: this.damageText,
      alpha: 1,
      y: afterY,
      ease: 'liner',
      duration: 100,
      delay: 400,
      repeat: 0,
      completeDelay: 600,
      onComplete: function () {
        this.damageText.setVisible(false);
        this.HP_text.setText(this.status.hp);
        if(status === "explode"){
          this.anims.play('anime_explode');
          this.icon_enemy.setVisible(false); 
          this.icon_king.setVisible(false);  
        }
      },
      callbackScope: this
    });
    
  }
  explodeComplete(_this){
    console.log("explodeComplete")
    this.scene.clearGame();
    this.scene.removeChess(_this);
  }

}
