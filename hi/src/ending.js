
ending = {
    create: function () {
        document.getElementById('graphs').style.display = "none"
        this.endingImage = this.game.add.image(0, 0, 'ending');
        this.endingImage.alpha = .1

        this.logo = this.game.add.sprite(this.game.width / 2, 170, 'logo-full');
        this.logo.anchor.setTo(0.5);

        this.text = this.game.add.text(500, 380, this.game.en.gamefinish, {
            font: '44px',
            fill: '#b6cae8',
            align: 'center',
        })
        this.text.font = '44px ' + this.game.fontStyle
        this.text.anchor.set(.5)
        this.text.stroke = "#000";
        this.text.strokeThickness = 8;

        var _this = this
        //		this.input.onDown.add(function () {
        //                _this.game.state.start("PlayLevel");
        //            }, this)

        this.btn = this.game.add.button(500, 500, 'betButtons', function () {
            _this.game.state.start("PlayLevel");
        })
        this.btn.tint = 0x78818e

        this.btn.anchor.set(.5)
        this.btn.style = {
            font: '16px',
            fill: 'white',
            align: "center",
            'wordWrap': false,
        }
        this.btn.txt = this.game.add.text(0, 2, this.game.en.restart, this.btn.style)
        this.btn.txt.anchor.set(.5)
        this.btn.addChild(this.btn.txt);

    }

}