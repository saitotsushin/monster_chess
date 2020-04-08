export default class FooterMenu{
  constructor(config) {

    this.scene = config.scene;
 
  }
  create(){

    /*==============================
    フッター
    メニューボタン：メニュー
    ------------------------------*/ 
    this.btnMenu1 = this.scene.add.sprite(
      3,
      172,
      'spritesheet',
      'btn_menu'
    );
    this.btnMenu1.setInteractive();
    this.btnMenu1.on('pointerdown', () => {
      this.scene.scene.start('MenuScene');
    },this);
    this.btnMenu1.setOrigin(0,0);

    /*メニューボタン：チーム＆レイアウト*/
    this.btnTeamChess = this.scene.add.sprite(
      40,
      172,
      'spritesheet',
      'btn_team_chess'
    );
    this.btnTeamChess.setInteractive();
    this.btnTeamChess.on('pointerdown', () => {
      this.scene.scene.start('SettingScene');
    },this);
    this.btnTeamChess.setOrigin(0,0);

    /*メニューボタン：チェス情報*/
    this.btnLayout = this.scene.add.sprite(
      102,
      172,
      'spritesheet',
      'btn_layout'
    );
    this.btnLayout.setInteractive();
    this.btnLayout.on('pointerdown', () => {
      this.scene.scene.start('SettingLayoutScene');
    },this);
    this.btnLayout.setOrigin(0,0);       
  }
}
