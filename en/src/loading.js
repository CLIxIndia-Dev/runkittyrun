loading = {
    preload: function () {
        this.game.load.spritesheet('cat', 'assets/cat.png', 80, 80);
        this.game.load.spritesheet('mouse', 'assets/mouse.png', 80, 80);
        this.game.load.image('box', 'assets/box.png');
        this.game.load.image('title-plate', 'assets/title-plate.png');
        this.game.load.image('track', 'assets/track.png');
        this.game.load.image('minimouse', 'assets/minimouse.png');
        this.game.load.image('minicat', 'assets/minicat.png');
        this.game.load.image('logo', 'assets/logo.png');
        this.game.load.image('logo-full', 'assets/logo-full.png');
        this.game.load.image('clixlogo', 'assets/clixlogo.png');
        this.game.load.image('logo-load', 'assets/logo-load.png');
        this.game.load.image('loadscreen', 'assets/loadscreen.png');

        this.game.load.image('dropdown_button', 'assets/dropdown_button_bnw.png');
        this.game.load.image('menu_button', 'assets/menu_button_bnw.png');

        this.game.load.image('speed-box', 'assets/speed-box.png');
        this.game.load.image('speed-button', 'assets/speed-button.png');
        this.game.load.image('speed-displaybox', 'assets/speed-displaybox.png');
        this.game.load.image('speed-indicator', 'assets/speed-indicator.png');
        this.game.load.image('speed-slider', 'assets/speed-slider.png');

        this.game.load.spritesheet('betButtons', 'assets/betButtons.png', 97, 36);

        this.game.load.image('footer', 'assets/footer.png');

        this.game.load.image('delay-box', 'assets/delay-box.png');
        this.game.load.image('delay-minus', 'assets/delay-minus.png');
        this.game.load.image('delay-plus', 'assets/delay-plus.png');
        this.game.load.image('delay-display', 'assets/delay-display.png');

        this.game.load.image('sideplate-p1', 'assets/sideplate-p1.png');
        this.game.load.image('sideplate-p2', 'assets/sideplate-p2.png');

        this.game.load.image('legend', 'assets/legend.png');

        this.game.load.image('background', 'assets/background.png');


        this.game.load.spritesheet('stars', 'assets/stars.png', 96, 32);
        this.game.load.image('intro-box', 'assets/intro-box.png');
        this.game.load.image('speech', 'assets/speech.png');
        this.game.load.image('infobox', 'assets/infobox.png');
        this.game.load.image('menubox', 'assets/menubox.png');

        this.game.load.image('score-plate', 'assets/score-plate.png');
        this.game.load.image('star', 'assets/star.png')

        this.game.load.image('ending', 'assets/ending.png')

        // http://phaser.io/docs/2.4.4/Phaser.ScaleManager.html#scaleMode  
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

        // this.game.scale.setUserScale(.85, .85, 0, 0)
        // this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    },
    create: function () {
        this.game.state.onStateChange.add(function (state) {
            console.log(state);
        });

        this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

        this.logo = this.game.add.sprite(this.game.width / 2, 300, 'logo-full');
        this.logo.anchor.setTo(0.5);
        this.clix = this.game.add.sprite(this.game.width / 2, 425, 'clixlogo');
        this.clix.anchor.setTo(0.5);
        this.clix.scale.setTo(0.5);
        this.copyright = this.game.add.text(this.game.width / 2, this.clix.bottom + 40, '©2017 MIT unless otherwise specified.\nEmail contact@clix.tiss.edu for more information', {
            font: '15px Arial',
            fill: 'black',
            fontWeight: 'bold',
            align: "center",
        });
        this.copyright.anchor.set(0.5);

        var _this = this;
        setTimeout(function () {
            _this.game.state.start("PlayLevel");
        }, 4000);

    }
};