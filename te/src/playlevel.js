playLevel = {
    create: function () {
        // Set up the html elements
        document.getElementById('graphs').style.display = "inline";
        document.getElementById('posgraph-ctr').style.display = "inline";
        document.getElementById('velgraph-ctr').style.display = "inline";

        this.game.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

        this.game.groups = {};



        this.game.logo = this.game.add.sprite(this.game.width / 2, 35, 'logo');
        this.game.logo.anchor.setTo(0.5);

        this.game.menu = new Menu(this.game);
        this.game.scoreplate = new ScorePlate(this.game)



        this.game.settings = this.game.level[this.game.currentLevel]

        if (this.game.settings.intro) {

        } else {
            this.game.goButton = new ContinueButton(this.game)
            this.game.goButton.top = this.game.velocityController.bottom
            this.game.goButton.centerX = this.game.velocityController.centerX
        }

        this.track = new Track(this.game);
        this.game.groups.playerGroup = this.game.add.group();

        this.game.playerone = new Computer(this.track.left + 125, this.track.top - 12, 'mouse', this.game)
        this.game.groups.playerGroup.add(this.game.playerone)
        this.game.playertwo = new Player(this.track.left + 125, this.track.top - 12 + 64, 'cat', this.game)
        this.game.groups.playerGroup.add(this.game.playertwo)

        this.game.groups.playerGroup.forEach(function (player) {
            player.x = 125;
        })

        var _this = this;
        this.game.solvable = false;
        while (!this.game.settings.delayControl && !this.game.solvable) {
            this.game.playertwo.speeds.forEach(function (playerSpeed) {

                if (playerSpeed * (60 / _this.game.playerone.speed - _this.game.playertwo.delay) == 60) {
                    _this.game.solvable = true;
                }
            })
            if (!_this.game.solvable) {
                _this.game.playertwo.delay = _this.game.playertwo.randomValue(_this.game.playertwo.delays);
                console.log('new delay: ' + _this.game.playertwo.delay)
            }
        }

        this.game.playerone.sideplate = new SidePlate(this.game.playerone, 'sideplate-p1', "#53667c", this.game)
        this.game.playertwo.sideplate = new SidePlate(this.game.playertwo, 'sideplate-p2', "#665655", this.game)

        if (this.game.settings.velocityGraphInvisible) {
            this.game.playertwo.sideplate.speed.setText("???");
        }


        this.game.velocityController = new VelocityController(this.game.playertwo, this.game)
        this.game.velocityController.scale.set(.3)

        this.game.delayController = new DelayController(this.game.playertwo, this.game)
        this.game.delayController.scale.set(.3)
        this.game.delayController.centerX = this.game.velocityController.centerX

        this.game.graphDisplay = this.game.add.sprite(this.game.velocityController.right, this.game.velocityController.top, 'box')
        this.game.graphDisplay.width = 830;
        this.game.graphDisplay.height = this.game.velocityController.height + 45;
        this.game.graphDisplay.legend = this.game.add.sprite(this.game.graphDisplay.centerX, this.game.graphDisplay.top + 20, 'legend')
        this.game.graphDisplay.legend.anchor.set(0.5)
        this.game.graphDisplay.legend.scale.set(0.6)
        this.game.graphDisplay.legend.visible = false
        //        this.game.graphDisplay.addChild(this.game.graphDisplay.legend)
        if (this.game.settings.graphVisibleBeforeGo) {
            //            this.game.graphDisplay.flasher = new Flasher(this.game.graphDisplay)
        }


        this.game.posgraph = new Graph(this.game.en.position, this.game.playerone, this.game.playertwo, 'posgraph', this.game)
        this.game.velgraph = new Graph(this.game.en.speed, this.game.playerone, this.game.playertwo, 'velgraph', this.game)

        this.game.velgraph.fullGraph(this.game);
        this.game.posgraph.fullGraph(this.game);

        this.game.betbox = new BetBox(this.game);
        //        this.game.groups.betButtons.forEach(function(button){
        //            button.frame = 0;
        //        })

        this.game.footer = new Footer(this.game);
        this.game.footer.progressIndicator = new ProgressIndicator(this.game)

        if (this.game.settings.velocityControl) {
            this.game.velocityController.visible = true;
        } else {
            this.game.velocityController.visible = false;
        }

        if (this.game.settings.delayControl) {
            this.game.delayController.visible = true;
        } else {
            this.game.delayController.visible = false;
        }


        if (this.game.settings.graphVisibleBeforeGo == true) {
            this.game.graphDisplay.legend.visible = true;
            document.getElementById('graphs').style.display = "inline";
            if (this.game.settings.positionGraphInvisible) {
                document.getElementById('posgraph-ctr').style.display = "none";
            } else {
                document.getElementById('posgraph-ctr').style.display = "inline";
            }
            if (this.game.settings.velocityGraphInvisible) {
                document.getElementById('velgraph-ctr').style.display = "none";
            } else {
                document.getElementById('velgraph-ctr').style.display = "inline";
            }
        } else {
            document.getElementById('graphs').style.display = "none";
            document.getElementById('posgraph-ctr').style.display = "none";
            document.getElementById('velgraph-ctr').style.display = "none";
        }

        if (this.game.settings.intro) {
            this.game.score = 0
            this.game.scoreplate.update()
            this.game.footer.box.visible = false

            this.game.introText = new TextBox(this.game.world.centerX, this.game.world.centerY, this.game)
            this.game.introText.top = this.game.track.bottom;
            this.game.graphDisplay.visible = false;

            this.game.playerone.animations.play('run', 8, true);
            var _this = this;
            _this.game.timeoutA = setTimeout(function () {
                _this.game.mousespeech = new Speech(_this.game.playerone, _this.game)
                _this.game.mousespeech.text.setText(_this.game.en.introMouseSpeech)

                _this.game.timeoutB = setTimeout(function () {
                    _this.game.mousespeech.visible = false

                    _this.game.mouserun = setInterval(function () {
                        _this.game.playerone.x += 3
                        if (_this.game.playerone.x > _this.game.tracklength) {
                            clearInterval(_this.game.mouserun)
                            _this.game.introText.text.setText(_this.game.en.introTextBoxA)
                            _this.game.playerone.animations.stop(null, true);
                            _this.game.catspeech = new Speech(_this.game.playertwo, _this.game)
                            _this.game.catspeech.text.setText(_this.game.en.introCatSpeech)
                            _this.game.next = _this.game.add.button(
                                _this.game.introText.centerX, _this.game.introText.centerY + 20, 'betButtons',
                                function () {
                                    _this.game.introText.text.setText(_this.game.en.introTextBoxB)
                                    _this.game.next.destroy()
                                    _this.game.next = _this.game.add.button(
                                        _this.game.introText.centerX, _this.game.introText.bottom - 58, 'betButtons',
                                        function () {
                                            partC(_this.game);

                                        })
                                    _this.game.next.anchor.set(.5)
                                    _this.game.next.tint = 0x72A5A5;
                                    _this.game.next.flasher = new Flasher(_this.game.next)
                                    _this.game.next.events.onInputOver.add(function () {
                                        _this.game.next.tint = 0x619391;
                                    }, this);
                                    _this.game.next.events.onInputOut.add(function () {
                                        _this.game.next.tint = 0x72A5A5;
                                    }, this);
                                    _this.game.next.text = _this.game.add.text(0, 0,
                                        _this.game.en.continue,
                                        { font: '16px', fill: 'white' }
                                    );
                                    _this.game.next.text.anchor.set(.5)
                                    _this.game.next.addChild(_this.game.next.text);


                                })
                            _this.game.next.anchor.set(.5)
                            _this.game.next.tint = 0x72A5A5;
                            _this.game.next.flasher = new Flasher(_this.game.next)
                            _this.game.next.events.onInputOver.add(function () {
                                _this.game.next.tint = 0x619391;
                            }, this);
                            _this.game.next.events.onInputOut.add(function () {
                                _this.game.next.tint = 0x72A5A5;
                            }, this);
                            _this.game.next.text = _this.game.add.text(0, 2,
                                _this.game.en.ok,
                                { font: '24px', fill: 'white' }
                            );
                            _this.game.next.text.anchor.set(.5)
                            _this.game.next.addChild(_this.game.next.text);
                        }
                    }, 2)
                }, 3000);
            }, 2000);
        }

        var endTutorial = function (game) {
            game.currentLevel++;

            game.state.restart();
        }

        var partC = function (game) {
            game.playerone.x = game.playertwo.x
            game.catspeech.visible = false
            game.introText.text.setText('')
            game.next.destroy()
            var _game = game;
            var counter = 0
            game.mouserun = setInterval(function () {
                _game.playerone.animations.play('run', 8, true);
                _game.playerone.x += 1
                if (counter > 500) {
                    _game.playertwo.animations.play('run', 8, true);
                    _game.playertwo.x += 3.1
                } else { counter++ }

                if (_game.playerone.x > _this.game.tracklength) {
                    _game.playertwo.x = game.playerone.x
                    clearInterval(_game.mouserun)
                    game.introText.text.setText(game.en.introTextBoxC)
                    _game.playerone.animations.stop(null, true);
                    _game.playertwo.animations.stop(null, true);
                    _game.catspeech.text.setText(_game.en.great)
                    _game.catspeech.x = 1004
                    _game.catspeech.visible = true

                    game.scoreplate.stars.frame = 1
                    game.scoreplate.stars.flasher = new Flasher(game.scoreplate.box)

                    _game.next = _game.add.button(
                        _game.introText.centerX, _game.introText.centerY + 20, 'betButtons',
                        function () {
                            _game.catspeech.visible = false
                            partD(_this.game)
                        })
                    _this.game.next.anchor.set(.5)
                    _this.game.next.tint = 0x72A5A5;
                    _this.game.next.flasher = new Flasher(_this.game.next)
                    _this.game.next.events.onInputOver.add(function () {
                        _this.game.next.tint = 0x619391;
                    }, this);
                    _this.game.next.events.onInputOut.add(function () {
                        _this.game.next.tint = 0x72A5A5;
                    }, this);
                    _this.game.next.text = _this.game.add.text(0, 0,
                        _this.game.en.continue,
                        { font: '16px', fill: 'white' }
                    );
                    _this.game.next.text.anchor.set(.5)
                    _this.game.next.addChild(_this.game.next.text);



                    _game.star = _game.add.sprite(_game.next.centerX + 150, _game.next.centerY, 'star')
                    _game.star.anchor.set(.5)
                    _game.world.bringToTop(_game.star)
                    _game.star.scaleValue = 1
                    _game.star.scaleIncrement = 0.01
                    _game.star.grow = setInterval(function () {
                        _game.star.scaleValue += _game.star.scaleIncrement
                        _game.star.scale.set(_game.star.scaleValue)
                        if (_game.star.scale.x > 1.09) {
                            _game.star.scaleIncrement *= -1
                        } else if (_game.star.scale.x < 0.91) {
                            _game.star.scaleIncrement *= -1
                        }
                    }, 50)

                }
            }, 2)



        }

        var partD = function (game) {
            game.introText.text.setText(game.en.introTextBoxD)
            game.playerone.x = game.track.left + 125
            game.playertwo.x = game.track.left + 125
            game.groups.betButtons.forEach(function (button) { button.inputEnabled = false })
            game.world.bringToTop(game.groups.betButtons)
            game.groups.betButtons.visible = true
            game.footer.box.visible = true
            game.betbox.text.visible = true
            game.world.bringToTop(game.betbox.text)
            game.star.visible = false
            game.next.destroy();

            game.next = game.add.button(
                game.introText.centerX, game.introText.centerY + 20, 'betButtons',
                function () {
                    partE(game);
                })
            game.next.anchor.set(.5)
            game.next.tint = 0x72A5A5;
            game.next.flasher = new Flasher(game.next)
            game.next.events.onInputOver.add(function () {
                _this.game.next.tint = 0x619391;
            }, this);
            game.next.events.onInputOut.add(function () {
                game.next.tint = 0x72A5A5;
            }, this);
            game.next.text = game.add.text(0, 0,
                game.en.continue,
                { font: '16px', fill: 'white' }
            );
            game.next.text.anchor.set(.5)
            game.next.addChild(game.next.text);

        }

        var partE = function (game) {
            game.introText.text.setText(game.en.introTextBoxE)
            game.star.visible = true
            game.star.x += 70
            game.star.y -= 90
            game.next.destroy();
            game.next = game.add.button(
                game.introText.centerX, game.introText.centerY + 80, 'betButtons',
                function () {
                    endTutorial(game);
                })
            game.next.anchor.set(.5)
            game.next.tint = 0x72A5A5;
            game.next.flasher = new Flasher(game.next)
            game.next.events.onInputOver.add(function () {
                _this.game.next.tint = 0x619391;
            }, this);
            game.next.events.onInputOut.add(function () {
                game.next.tint = 0x72A5A5;
            }, this);
            game.next.text = game.add.text(0, 0,
                game.en.continue,
                { font: '16px', fill: 'white' }
            );
            game.next.text.anchor.set(.5)
            game.next.addChild(game.next.text);
        }


        if (this.game.settings.betInfo && this.game.settings.velocityInfo) {
            this.game.velocityInfo = new InfoBox(this.game.graphDisplay.left + 150, this.game.graphDisplay.centerY, this.game, '')
            this.game.velocityInfo.drawLine('left', 150, 300)
            this.game.velocityInfo.text.setText(this.game.en.velocityInfoA)
            this.game.velocityInfo.preserve = true
            this.game.betInfo = new InfoBox(this.game.velocityInfo.right + 150, this.game.velocityInfo.centerY, this.game, '')
            this.game.betInfo.drawLine('bottom', this.game.betbox.box.centerX, this.game.betbox.box.top + 20)
            this.game.betInfo.text.setText(this.game.en.velocityInfoB)
            this.game.betInfo.preserve = true
            this.game.betInfo.visible = false
            this.game.betInfo.graphics.visible = false


        }

        if (this.game.settings.graphInfo) {
            this.game.graphInfo = new InfoBox(700, this.game.track.centerY, this.game, '')
            this.game.graphInfo.drawLine('bottom', 850, this.game.graphDisplay.top + 20)
            this.game.graphInfo.text.setText(this.game.en.graphInfoA)
        }

        if (this.game.settings.liveInfo) {
            this.game.liveInfo = new InfoBox(this.game.graphDisplay.left + 230, this.game.graphDisplay.centerY, this.game, '')
            this.game.liveInfo.drawLine('left', 150, 300)
            this.game.liveInfo.text.setText(this.game.en.liveInfoA)
        }

        if (this.game.settings.delayInfo) {
            this.game.delayInfo = new InfoBox(this.game.graphDisplay.left + 230, this.game.graphDisplay.centerY, this.game, '')
            this.game.delayInfo.drawLine('left', 150, 300)
            this.game.delayInfo.text.setText(this.game.en.delayInfoA)
        }

        if (this.game.settings.speedInfo) {
            this.game.delayInfo = new InfoBox(300, 150, this.game, '')

            this.game.delayInfo.text.setText(this.game.en.speedInfoA)
        }

        if (this.game.settings.useGraphInfo) {
            this.game.delayInfo = new InfoBox(this.game.graphDisplay.left + 150, this.game.graphDisplay.centerY, this.game, '')

            this.game.delayInfo.text.setText(this.game.en.useGraphInfoA)
        }

        if (this.game.settings.matchInfo) {
            this.game.delayInfo = new InfoBox(this.game.graphDisplay.left + 550, this.game.graphDisplay.centerY, this.game, '')

            this.game.delayInfo.text.setText(this.game.en.matchInfoA)
        }

    }
};