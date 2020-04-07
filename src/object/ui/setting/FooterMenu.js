export default class FooterMenu{
  constructor(config) {

    this.scene = config.scene;

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
      this.scene.start('MenuScene');
    },this);
    this.btnMenu1.setOrigin(0,0);

    /*メニューボタン：チーム＆レイアウト*/
    this.btnTeamLayout = this.scene.add.sprite(
      28,
      172,
      'spritesheet',
      'btn_team_layout'
    );
    this.btnTeamLayout.setInteractive();
    this.btnTeamLayout.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnTeamLayout.setOrigin(0,0);

    /*メニューボタン：チェス情報*/
    this.btnChessInfo = this.scene.add.sprite(
      88,
      172,
      'spritesheet',
      'btn_chess_info'
    );
    this.btnChessInfo.setInteractive();
    this.btnChessInfo.on('pointerdown', () => {
      this.scene.start('MenuScene');
    },this);
    this.btnChessInfo.setOrigin(0,0);    
  }
}
