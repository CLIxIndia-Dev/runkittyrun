class GameReporter {
    constructor() {
        this.uuid = this.getCookie('session_uuid');
    }

    submitData(data) {
        var xhr = new XMLHttpRequest();

        // This part gets unplatform's session uuid if available
        // and creates a json string for the ajax POST. The /appdata/ api
        // is pretty flexible for the params field. Timestamps are generated
        // server-side & don't need to be included.
        var data_string = {}

        // if you want to test with a session id, you can set
        // document.cookie = "session_uuid=test"
        data_string['session_id'] = this.uuid;


        for (var key in data) { data_string[key] = data[key]; };

        var qbank = { data: data_string }
        qbank = JSON.stringify(qbank);

        xhr.open('POST', '/api/v1/logging/genericlog', true); // True means async
        xhr.setRequestHeader("x-api-proxy", this.uuid)
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(qbank);
        if (xhr.response != 200) {
            //            xhr.close()
            var xhr = new XMLHttpRequest();
            var unplatform = JSON.stringify(data_string);
            xhr.open('POST', '/api/appdata/', true); // True means async
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(unplatform);
        }
    };

    // Generic get cookie function 
    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        console.log('no uuid found')
    };

    // The report function is used to report stateless data. This means reports should include
    // as much data and relevant metadata as possible. Timestamps are recorded serverside and
    // are used with reports to reconstruct what students did. Example:
    // var reporter = new GameReporter(); reporter.report('click', {button_name : 'start'});
    report(event, params) {
        var data = {
            // app_name ideally should be get the app's name
            // via an environment variable but for now it's hard coded
            "app_name": "runkittyrun",
            "version": "1.0",
            // usually the event that triggrs the action, e.g. go_button_clicked
            // this field has a max length of 32 chars
            "event_type": event,
            // params is the place to dump data related to the event. no max length and
            // can include sub objects. this data is stringified in the submit data function. 
            // ex: params : {level : 2, player_velocity : 30, computer_velocity : 20 }
            "params": params,
        };
        //            this.submitData('/api/appdata/', data);
        this.submitData(data);

    }
}

class Menu {
    constructor(game) {
        this.game = game;
        //        
        //        this.style = {
        //          'font': '30px OpenSans',
        //          'fill': 'black'
        //        };
        var _this = this;
        var levnum;
        if (game.currentLevel === 0) {
            levnum = game.en.tutorial;
        } else { levnum = game.en.level + " " + game.currentLevel; }
        this.levelButton = new LabelButton(game,
            game.width / 2 + 280, 30,
            "dropdown_button",
            [0x618DCE, 0x427EC6],
            levnum,
            function () {
                _this.toggleMenu(_this.game);
            });
        this.levelButton.button.label.addColorHack('white', 0)

        game.groups.menuGroup = game.add.group();

        this.menubox = game.add.sprite(this.levelButton.button.x, 128, 'menubox')
        this.menubox.anchor.set(0.5)
        this.menubox.alpha = 0.4
        game.groups.menuGroup.add(this.menubox)

        this.menuButtons = {};
        for (var i = 0; i <= game.levels; i++) {
            this.setupButton(game, i);
        }
        game.groups.menuGroup.scale.setTo(0);



    }

    toggleMenu(game) {
        if (game.groups.menuGroup.scale.y === 0) {
            //          var menuTween = game.add.tween(game.menuGroup.scale).to(
            //              { x: 1, y: 0}, 500, Phaser.Easing.Back.Out, true);

            game.world.bringToTop(game.groups.menuGroup)

            game.groups.menuGroup.scale.setTo(1);

        } else {
            //          var menuTween = game.add.tween(game.menuGroup.scale).to(
            //              { x: 1, y: 1}, 500, Phaser.Easing.Back.Out, true);     
            game.world.bringToTop(game.groups.menuGroup)

            game.groups.menuGroup.scale.setTo(0);
        }

    }

    setupButton(game, i) {

        var levnum;
        if (i === 0) {
            levnum = game.en.tutorial;
        } else { levnum = game.en.level + " " + i; }

        var posX = (i % 2 == 0 ? this.levelButton.button.x - 70 : this.levelButton.button.x + 70)
        var posY = (i % 2 == 0 ? 70 + 19 * i : 70 + 19 * (i - 1))

        this.menuButtons[i] = new LabelButton(
            this.game, posX, posY,
            "menu_button",
            [0xFFFFFF, 0xCCCCFF],
            levnum,
            function () {
                clearTimeout(game.fdbk)
                clearTimeout(game.timeoutA)
                clearTimeout(game.timeoutB)
                clearInterval(game.mouserun)
                clearInterval(game.finish)
                game.bet = null
                game.posgraph.resetGraph()
                game.velgraph.resetGraph()
                clearInterval(game.race);
                game.playerone.animations.stop(null, true);
                game.playertwo.animations.stop(null, true);
                game.currentLevel = i;
                game.reporter.report('level_selected', {
                    'level': game.currentLevel
                })
                game.progress = 0
                game.groups.menuGroup.scale.setTo(0);
                game.state.restart();
            });

        var _btn = this.menuButtons[i].button;
        this.game.groups.menuGroup.add(_btn);

    }

}

class LabelButton {
    constructor(game, x, y, key, colors, label, callback) {
        this.button = game.add.button(x, y, key, callback);
        this.button.tint = colors[0];
        this.style = {
            'font': '13px',
            'fill': '#4976bf',
            'align': "center"
        };
        this.button.anchor.setTo(0.5);

        // hackey bit to override the add color method. 
        Phaser.Text.prototype.addColorHack = function (str) {
            this.style.fill = str
            this.setText(this.text)
        }


        this.button.label = new Phaser.Text(game, 0, 0, label, this.style);
        //puts the label in the center of the button
        this.button.label.anchor.setTo(0.75, 0.5);
        this.button.addChild(this.button.label);
        this.setLabel(label);
        this.button.events.onInputOver.add(function () {
            this.button.tint = colors[1];
        }, this);

        this.button.events.onInputOut.add(function () {
            this.button.tint = colors[0];
        }, this);
    }
    setLabel(label) {
        this.button.label.setText(label);
    }
};

class Track extends Phaser.Sprite {
    constructor(game) {
        super(game, 0, 70, 'track');
        game.add.existing(this);
        this.width = game.width;
        this.height = 128;
        game.track = this;
        game.tracklength = 0.839 * game.track.width; //730
    }
}



class Player extends Phaser.Sprite {
    constructor(x, y, sprite, game) {
        super(game, x, y, sprite);

        //        if (!game.groups.players) {
        //            game.groups.players = game.add.group();
        //        }
        //       
        this.width = 64
        this.height = 64
        this.delays = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15];
        this.speeds = [3, 4, 5, 6, 7.5, 10, 12, 15, 20, 30, 60];
        this.speed = this.speeds[0]; // initial speed

        this.animations.add('run');
        game.add.existing(this);
        if (game.settings.zeroDelay) {
            this.delay = 0;
        } else {
            this.delay = this.randomValue(this.delays.slice(0, game.computerSpeed + 1));
        }
    }
    randomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    };
}

// This creates a computer controlled player
class Computer extends Player {
    constructor(x, y, sprite, game) {
        super(x, y, sprite, game);
        this.delay = 0
        // this.speeds = [2, 3, 4, 5, 6, 10, 12, 15, 30]
        this.speeds = [30, 15, 12, 10, 6, 5, 4, 3]
        this.speed = this.randomValue(this.speeds)
        //        this.labelSpeed(this.speed)
        game.computerSpeed = this.speeds.indexOf(this.speed)
    }
}




// The controller for a player's speed
class VelocityController extends Phaser.Sprite {
    constructor(player, game) {
        super(game, 0, 200, 'speed-box');
        game.add.existing(this)

        this.player = player;
        this.game = game;

        this.slider = game.add.sprite(this.x + 75, this.y - 35, 'speed-slider')
        //        this.slider.anchor.set(.5)
        this.indicatorY = this.slider.bottom - 40
        this.indicator = game.add.sprite(this.slider.centerX + 65, this.indicatorY - player.speed * 467 / 60, 'speed-indicator')
        this.indicator.alpha = 0.9
        this.increments = this.slider.height / player.speeds.length

        // Controls
        this.increaseButton = game.add.sprite(this.centerX + 120, this.slider.centerY - 150, 'speed-button')
        this.increaseButton.anchor.set(.5)
        this.display = game.add.sprite(this.increaseButton.centerX, this.slider.centerY, 'speed-displaybox')
        this.display.anchor.set(.5)
        this.text = game.add.text(this.display.centerX, this.display.centerY, this.player.speed + "m/s", {
            font: '45px',
            fill: 'black',
            align: "center"
        });
        this.text.anchor.set(0.5)
        if (game.settings.velocityGraphInvisible) {
            //            this.text.visible = false;
            this.text.setText(game.en.unknown)
            this.indicator.visible = false
        }
        this.decreaseButton = game.add.sprite(this.centerX + 120, this.slider.centerY + 150, 'speed-button')
        this.decreaseButton.anchor.set(.5)
        this.decreaseButton.angle = 180;

        this.increaseButton.inputEnabled = true;
        this.decreaseButton.inputEnabled = true;
        this.increaseButton.input.useHandCursor = true;
        this.decreaseButton.input.useHandCursor = true;

        this.increaseButton.flasher = new Flasher(this.increaseButton)
        this.decreaseButton.flasher = new Flasher(this.decreaseButton)

        this.addChild(this.slider)
        this.addChild(this.indicator)
        this.addChild(this.increaseButton)
        this.addChild(this.decreaseButton)
        this.addChild(this.display)
        this.addChild(this.text)

        this.report = function () {
            game.reporter.report('speed_change', {
                'level': game.currentLevel,
                'new_cat_speed': game.playertwo.speed,
                'cat_delay': game.playertwo.delay,
                'mouse_speed': game.playerone.speed,
                'mouse_delay': game.playerone.delay,
                'level_progress': game.progress,
            })
        }
        var _this = this

        this.increaseButton.events.onInputDown.add(function (e) {
            if (_this.player.speed < 60) {
                _this.index = _this.player.speeds.indexOf(_this.player.speed)
                _this.player.speed = _this.player.speeds[(_this.index + 1) % _this.player.speeds.length]

                _this.updateIndicator()
                _this.updateDisplay()
                _this.game.posgraph.fullGraph(_this.game)
                _this.game.velgraph.fullGraph(_this.game)

                _this.player.sideplate.update()
                _this.report()

            }
        })
        this.increaseButton.events.onInputOver.add(function () {
            this.increaseButton.tint = 0x427EC6;
        }, this);
        this.increaseButton.events.onInputOut.add(function () {
            this.increaseButton.tint = 0xFFFFFF;
        }, this);

        this.decreaseButton.events.onInputDown.add(function (e) {
            if (_this.player.speed > 3) {
                _this.index = _this.player.speeds.indexOf(_this.player.speed)
                _this.player.speed = _this.player.speeds[(_this.index - 1) % _this.player.speeds.length]

                _this.updateIndicator()
                _this.updateDisplay()
                _this.game.posgraph.fullGraph(_this.game)
                _this.game.velgraph.fullGraph(_this.game)

                _this.player.sideplate.update()
                _this.report()
            }
        })
        this.decreaseButton.events.onInputOver.add(function () {
            this.decreaseButton.tint = 0x427EC6;
        }, this);
        this.decreaseButton.events.onInputOut.add(function () {
            this.decreaseButton.tint = 0xFFFFFF;
        }, this);
    }

    updateIndicator() {
        this.indicator.y = this.indicatorY - this.player.speed * 467 / 60
    }
    updateDisplay() {
        if (this.game.settings.velocityGraphInvisible) {
            //            this.text.visible = false;
            this.text.setText(this.game.en.unknown)
        } else {
            this.text.setText(this.player.speed + "m/s")
        }
    }
};


// The graphs
class Graph extends RGraph.Line {
    constructor(ylabel, playerone, playertwo, id, game) {

        var xLabel = game.en.time
        var data = [new Array(30), new Array(30)]
        if (id == "posgraph") {
            var graphdata = [positionData(game.playerone), positionData(game.playertwo)];
            var stepped = false;
        } else if (id == "velgraph") {
            var graphdata = [velocityData(game.playerone), velocityData(game.playertwo)];
            var stepped = true;
            enableArrows()
        } else { };

        var background = new RGraph.Drawing.Background({
            id: id,
            options: {
                gutterLeft: 30,
                gutterBottom: 30,
                backgroundGridAutofitNumvlines: 6,
                backgroundGridAutofitNumhlines: 12,
                // backgroundGridColor: '#eee',
                backgroundGridDotted: true,
                backgroundColor: '#ebeded',
            }
        }).draw();

        var line = super({
            id: id,
            data: data,
            options: {
                colors: ['#144da8', '#ddac12'],
                linewidth: 2,
                // colorsAlternate: true,
                // tickmarks: 'tick',
                shadow: false,
                adjustable: false,
                outofbounds: false,
                ylabelsCount: 6,
                // xlabelsCount: 6,
                // backgroundColor: '#88c',
                labels: ['0', '5', '10', '15', '20', '25', '30'],
                numxticks: 30,
                numyticks: 6,
                ymax: 60,
                ymin: 0,
                titleXaxis: xLabel,
                titleXaxisSize: 11,
                titleYaxis: ylabel,
                titleYaxisSize: 8,
                titleYaxisX: 4,
                ylabelsOffsetx: 2,
                gutterLeft: 30,
                stepped: stepped,
                backgroundGridAutofitNumhlines: 6,
                tickmarks: null,
                // numticks: 2
                // adjustable: true
            }
        })

        this.line = line
        this.id = id
        this.data = data
        this.graphdata = graphdata
        this.background = background

        this.line.draw();


        function positionData(player) {
            var posdata = []
            for (var i = 0; i <= player.delay; i++) {
                posdata.push(0);
            }
            var position = 0
            for (var i = player.delay + 1; i <= 30; i++) {
                position += player.speed
                posdata.push(position);
                if (position >= 60) {
                    var arr = new Array(30 - i);
                    // arr.fill(60)
                    posdata = posdata.concat(arr);
                    player.maxTime = i
                    i = 31;
                    // console.log(player.maxTime)
                }
            }
            console.log((position))
            return posdata;
        }
        this.positionData = positionData
        function velocityData(player) {
            var veldata = []
            for (var i = 0; i < player.delay; i++) {
                veldata.push(0);
            }

            player.maxTime = (player.maxTime || 30)
            for (var i = player.delay; i <= player.maxTime; i++) {
                veldata.push(player.speed);
            }

            while (veldata.length <= 30) {
                veldata.push(null);
            }

            return veldata;
        }
        this.velocityData = velocityData
        this.counter = 0

        function enableArrows() {

        }

    }

    fullGraph(game) {
        if (this.id == "posgraph") {
            if (game.settings.mousePlotInvisible) {
                this.graphdata = [new Array(30),
                this.positionData(game.playertwo)];
            } else {
                this.graphdata = [this.positionData(game.playerone),
                this.positionData(game.playertwo)];
            }
        }
        else if (this.id == "velgraph") {
            this.graphdata = [this.velocityData(game.playerone),
            this.velocityData(game.playertwo)];
        } else { console.log('graph error') };

        if (!game.settings.livePlot) {
            this.line.original_data[0] = this.graphdata[0]
            this.line.original_data[1] = this.graphdata[1]
            this.redraw()
        } else {
            this.line.original_data[0] = new Array(30)
            this.line.original_data[1] = new Array(30)
            this.redraw()
        }
    }

    liveGraph() {

        this.updateLine(); // once for t=0
        this.updateLine(); // once because setinterval doesn't fire until the delay
        this.plotter = setInterval(this.updateLine.bind(this), 1000)
    }


    updateLine() {
        if (this.counter <= 30) {
            this.line.original_data[0][this.counter] = this.graphdata[0][this.counter]
            this.line.original_data[1][this.counter] = this.graphdata[1][this.counter]
            this.redraw()
            this.counter++;
        }
    }


    redraw() {
        RGraph.clear(this.line.canvas)
        this.background.draw()
        this.line.draw()
    }

    resetGraph() {
        clearInterval(this.plotter)
        RGraph.clear(this.line.canvas)

    }
}

class BetBox {
    constructor(game) {
        this.game = game;
        this.box = game.add.sprite(0, 480, 'box');
        this.box.visible = false;
        this.box.width = 1024;
        this.box.height = 100;
        this.style = {
            font: '22px',
            fill: 'white',
            align: "center",
        }
        this.text = game.add.text(this.box.centerX - this.box.width * .5 * .5, this.box.centerY,
            game.en.betBox,
            this.style);
        this.text.anchor.set(.5)

        game.groups.betButtons = game.add.group();

        this.slow = this.setupButton([0xEFC66A, 0xEFB643], this.box.centerX + 300, game.en.late, -1, this.game)
        game.groups.betButtons.add(this.slow)

        this.ontime = this.setupButton([0x7DA8DB, 0x5692CC], this.box.centerX + 160, game.en.ontime, 0, this.game)
        game.groups.betButtons.add(this.ontime)

        this.fast = this.setupButton([0xDD8985, 0xD36262], this.box.centerX + 20, game.en.soon, 1, this.game)
        game.groups.betButtons.add(this.fast)

        //        this.box.addChild(game.groups.betButtons)



        game.startRace = function (game) {

            if (game.settings.betInfo && game.settings.velocityInfo) {
                game.betInfo.visible = false
                game.betInfo.graphics.visible = false
            }

            game.groups.betButtons.forEach(function (button) { button.inputEnabled = false })

            game.countdown = new Countdown(game)
            game.countdown.countdown()
            setTimeout(function () {
                if (game.settings.graphVisibleAfterGo == true) {
                    game.graphDisplay.legend.visible = true;
                    document.getElementById('graphs').style.display = "inline";
                    if (game.settings.positionGraphInvisible) {
                        document.getElementById('posgraph-ctr').style.display = "none";
                    } else {
                        document.getElementById('posgraph-ctr').style.display = "inline";
                    }
                    if (game.settings.velocityGraphInvisible) {
                        document.getElementById('velgraph-ctr').style.display = "none";
                    } else {
                        document.getElementById('velgraph-ctr').style.display = "inline";
                    }
                } else {
                    document.getElementById('graphs').style.display = "none";
                    document.getElementById('posgraph-ctr').style.display = "none";
                    document.getElementById('velgraph-ctr').style.display = "none";
                }


                if (game.playertwo.speed * (60 - game.playerone.speed * game.playertwo.delay) == 60 * game.playerone.speed) {
                    console.log('win')
                    game.result = 0;
                } else if (game.playertwo.speed * (60 - game.playerone.speed * game.playertwo.delay) > 60 * game.playerone.speed) {
                    console.log('fast')
                    game.result = 1;
                } else if (game.playertwo.speed * (60 - game.playerone.speed * game.playertwo.delay) < 60 * game.playerone.speed) {
                    console.log('slow')
                    game.result = -1;
                }

                game.reporter.report('race_data', {
                    'result': ['too_late', 'on_time', 'too_soon'][game.result + 1],
                    'bet': game.bet != null ? ['too_late', 'on_time', 'too_soon'][game.bet + 1] : null,
                    'level': game.currentLevel,
                    'cat_speed': game.playertwo.speed,
                    'cat_delay': game.playertwo.delay,
                    'mouse_speed': game.playerone.speed,
                    'mouse_delay': game.playerone.delay,
                    'level_progress': game.progress,

                })

                var feedback = function (a, b, game) {
                    game.footer.text.setText(b)
                    game.footer.text.setTe
                    game.footer.text.visible = true
                    game.footer.text.addColorHack('#FFFF00', 0)
                    var _a = a
                    game.fdbk = setTimeout(function () {
                        game.footer.text.addColorHack('#FFFFFF', 0)
                        game.footer.texttwo.setText(_a)
                        game.footer.texttwo.set
                        game.footer.texttwo.visible = true
                        game.footer.texttwo.addColorHack('#FFFF00', 0)
                        game.fdbk = setTimeout(function () {
                            game.footer.texttwo.addColorHack('#FFFFFF', 0)
                            if (game.currentLevel > game.levels) {
                                game.add.button(game.footer.progressIndicator.next.x, game.footer.progressIndicator.next.y, 'betButtons', function () {
                                    game.currentLevel = 0
                                    game.state.start("Ending");
                                })
                            } else {
                                game.footer.progressIndicator.next.visible = true;
                            }
                        }, 3000)
                    }, 3000)

                }

                // var delay = game.playertwo.delay * 1000;
                var normalize =  (720 / (60 * 100)); // 7

                if (game.settings.livePlot) {
                    game.posgraph.liveGraph()
                    game.velgraph.liveGraph()
                }

                
                game.racecounter = 0
                game.race = setInterval(function () {

                    if (game.bet == null) {
                        game.groups.betButtons.visible = false;
                        game.betbox.text.setText(game.en.nobet)
                    }
                    var delayCount = Math.floor(game.racecounter/1000)
                    game.playerone.sideplate.countdown(delayCount)
                    game.playertwo.sideplate.countdown(delayCount)


                    // The computer starts running and then after a delay, the player starts running
                    game.playerone.x += game.playerone.speed * normalize;
                    game.playerone.animations.play('run', 8, true);

                    if (game.racecounter >= (1000*game.playertwo.delay)) {
                        game.playertwo.x += game.playertwo.speed * normalize;
                        game.playertwo.animations.play('run', 8, true);
                    }

                    // Helper function for finishing the race
                    var _game = game;
                    var finish = function (loser, winner) {
                        console.log('finish')
                        _game.finish = setInterval(function () {
                            if (loser.x < winner.x) {
                                loser.x += loser.speed * normalize;
                            } else {
                                loser.x = winner.x
                                //                        console.log(loser.x)
                                //                        console.log(winner.x)
                                loser.animations.stop(null, true);
                                clearInterval(_game.finish)
                                _game.catspeech = new Speech(_game.playertwo, _game)
                                _game.catspeech.text.setText(_game.en.nope)
                            }
                        }, 10)
                    };

                    // Check if the finish line has been reached and if the bet was right
                    // if (Math.abs(game.playerone.x - game.tracklength) < 10 && Math.abs(game.playertwo.x - game.tracklength) < 10) {
                    if (game.result == 0 && (Math.abs(game.playerone.x - game.tracklength) < 10 || Math.abs(game.playertwo.x - game.tracklength) < 10)) {

                        game.betbox.text.visible = false
                        game.groups.betButtons.visible = false

                        game.scoreplate.stars.frame += 1
                        clearInterval(game.race);
                        while (game.playerone.x < Math.max(game.playerone.x, game.playertwo.x)) {
                            game.playerone.x += 1;
                        }
                        while (game.playertwo.x < Math.max(game.playerone.x, game.playertwo.x)) {
                            game.playertwo.x += 1;
                        }
                        game.playerone.x = game.playertwo.x
                        game.playerone.animations.stop(null, true);
                        game.playertwo.animations.stop(null, true);

                        if (game.bet == 0) {
                            feedback(game.en.rightontime, game.en.kittyontime, game)
                            game.score++
                            game.scoreplate.update()
                        } else if (game.bet == -1 || game.bet == 1) {
                            feedback(game.en.wrongontime, game.en.kittyontime, game)
                        }
                        if (game.progress < 2) {
                            game.progress++
                            game.scoreplate.update()
                        } else {
                            game.footer.progressIndicator.next.text.setText(game.en.nextlevel)
                            game.scoreplate.stars.frame = 3;
                            game.progress = 0;
                            game.currentLevel++


                            game.scoreplate.stars.flipper = true
                            game.scoreplate.stars.blink = setInterval(function () {
                                if (game.scoreplate.stars.flipper) {
                                    game.scoreplate.stars.frame = 0;
                                } else {
                                    game.scoreplate.stars.frame = 3
                                }
                                game.scoreplate.stars.flipper = !game.scoreplate.stars.flipper

                            }, 350)

                            var _game = game
                            playLevel.input.onDown.add(function () {
                                clearInterval(_game.scoreplate.stars.blink)
                            }, playLevel)


                        }

                        game.catspeech = new Speech(game.playertwo, game)
                        game.catspeech.text.setText(game.en.great)
                    } else if (game.result == -1 && (Math.abs(game.playerone.x - game.tracklength) < 10 || Math.abs(game.playertwo.x - game.tracklength) < 10)) {
                        game.betbox.text.visible = false
                        game.groups.betButtons.visible = false

                        clearInterval(game.race);
                        game.playerone.animations.stop(null, true);
                        finish(game.playertwo, game.playerone)
                        if (game.bet == -1) {
                            feedback(game.en.rightlate, game.en.kittylate, game)

                            game.score++
                            game.scoreplate.update()
                        } else if (game.bet == 0 || game.bet == 1) {
                            feedback(game.en.wronglate, game.en.kittylate, game)
                        }

                    } else if (game.result == 1 && (Math.abs(game.playerone.x - game.tracklength) < 10 || Math.abs(game.playertwo.x - game.tracklength) < 10)) {
                        game.betbox.text.visible = false
                        game.groups.betButtons.visible = false

                        clearInterval(game.race);
                        game.playertwo.animations.stop(null, true);
                        finish(game.playerone, game.playertwo)
                        if (game.bet == 1) {
                            feedback(game.en.rightearly, game.en.kittyearly, game)
                            game.score++
                        } else if (game.bet == 0 || game.bet == -1) {
                            feedback(game.en.wrongearly, game.en.kittyearly, game)
                        }

                    }
                    game.racecounter += 10 // time elapsed since race start

                }, 10)
            }, 3000)
        }

        game.groups.betButtons.visible = false
        this.text.visible = false


    }
    setupButton(colors, x, text, id, game) {
        var btn = this.game.add.button(x, this.box.centerY, 'betButtons', function () {
            game.bet = id
            console.log(id)
            //            btn.tint = 0xffffff
            game.reporter.report("bet_chosen", {
                'level': game.currentLevel,
                'bet': ['too_soon', 'on_time', 'too_late'][id + 1],

            })

            game.groups.betButtons.forEach(function (button) {
                button.frame = 0
                button.txt.y = 2
            })
            btn.txt.y = 4 // moves the text so it looks like the button is pressed
            btn.frame = 1
            game.startRace(game)
        })
        btn.colors = colors;
        //        btn.alpha = 0.9
        btn.id = id;
        btn.anchor.set(.5)
        btn.tint = colors[0]
        btn.events.onInputOver.add(function () {
            btn.tint = colors[1];
        }, this);
        btn.events.onInputOut.add(function () {
            btn.tint = colors[0];
        }, this);
        btn.style = {
            font: '16px',
            fill: 'white',
            align: "center",
            'wordWrap': false,
        }
        btn.txt = this.game.add.text(0, 2, text, btn.style)
        btn.txt.anchor.set(.5)
        btn.addChild(btn.txt);
        return btn;
    }
    toggleHide() {
        if (this.game.settings.intro) {
            this.box.visible = false;
        } else {
            this.box.visible = !this.box.visible
        }
        this.text.visible = !this.text.visible
        this.game.groups.betButtons.visible = !this.game.groups.betButtons.visible

    }
}

class ContinueButton extends Phaser.Button {
    constructor(game) {
        super(game, 200, -50, 'betButtons')
        game.add.existing(this)
        var _this = this;
        this.game = game;
        this.onInputDown.add(function () { _this.makeBet(_this.game) })
        this.anchor.set(0.5)
        this.tint = 0x72A5A5;
        this.flasher = new Flasher(this)
        this.style = {
            font: '14px',
            fill: 'white',
            align: "center",

        }

        this.text = game.add.text(0, 0,
            game.en.continue,
            this.style);
        this.text.anchor.set(.5)
        this.addChild(this.text);

        this.scale.set(1.2)


        this.events.onInputOver.add(function () {
            _this.tint = 0x619391;
        }, this);
        this.events.onInputOut.add(function () {
            _this.tint = 0x72A5A5;
        }, this);
    }
    // they are running from pixel 125 to 800 (= 0.78125 * track width)
    // 675 pixels = 60m so if speed = 60 then in 1sec dx = 675
    // and in 10ms dx = 6.75
    makeBet(game) {

        if (game.settings.betInfo && game.settings.velocityInfo) {
            game.betInfo.visible = true
            game.betInfo.graphics.visible = true
            game.velocityInfo.visible = false
            game.velocityInfo.graphics.visible = false
        }
        game.world.bringToTop(game.groups.betButtons);
        game.groups.betButtons.visibile = true;
        game.world.bringToTop(game.betbox.text);
        game.betbox.text.visible = true

        game.groups.betButtons.forEach(function (button) { button.flasher = new Flasher(button) })

        game.delayController.plus.inputEnabled = false
        game.delayController.minus.inputEnabled = false

        game.velocityController.increaseButton.inputEnabled = false;
        game.velocityController.decreaseButton.inputEnabled = false;

        game.goButton.frame = 1
        game.goButton.text.y = 2
        game.goButton.inputEnabled = false;

        game.goButton.text.setText(game.en.locked)

        game.groups.betButtons.visible = true;
        game.betbox.text.visible = true;


    }
}

class Footer {
    constructor(game) {
        this.game = game;
        this.box = game.add.sprite(game.world.centerX, 530, 'footer');
        this.box.width = game.width - 10;
        //        this.box.height = 300;
        this.box.anchor.set(.5)
        this.box.top = game.graphDisplay.bottom + 10;

        this.style = {
            font: '15px',
            fill: 'white',
            align: "center",
            wordWrap: true,
            wordWrapWidth: this.box.width - 500
        }
        this.text = game.add.text(-320, -50,
            game.en.footerText,
            this.style);
        this.text.anchor.set(.5)
        this.box.addChild(this.text);
        this.text.visible = false

        this.texttwo = game.add.text(45, -30,
            '',
            this.style);
        this.texttwo.anchor.set(.5)
        this.box.addChild(this.texttwo);
        this.texttwo.visible = false

    }

}

class DelayController extends Phaser.Sprite {
    constructor(player, game) {
        super(game, 5, 250, 'delay-box');
        game.add.existing(this)
        console.log(player.speed)
        this.player = player;
        this.game = game;

        if (game.settings.delayControl) {
            game.solvable = false;
            var _this = this
            //            console.log('delay enabled, checking solvability')
            while (game.playertwo.speed <= game.playerone.speed && !game.solvable) {
                game.playertwo.speed = game.playertwo.randomValue(game.playertwo.speeds)

                game.playertwo.delays.forEach(function (playerDelay) {
                    if (_this.game.playertwo.speed * (60 / _this.game.playerone.speed - playerDelay) == 60) {
                        _this.game.solvable = true;
                    }
                })
                if (!_this.game.solvable) {
                    _this.game.playertwo.speed = _this.game.playertwo.randomValue(_this.game.playertwo.speeds);
                    console.log('new delay: ' + _this.game.playertwo.speed)
                }
                player.sideplate.update()
            }
        }

        this.report = function () {
            game.reporter.report('speed_change', {
                'level': game.currentLevel,
                'new_cat_delay': game.playertwo.delay,
                'cat_speed': game.playertwo.speed,
                'mouse_speed': game.playerone.speed,
                'mouse_delay': game.playerone.delay,
                'level_progress': game.progress,
            })
        }

        var _this = this
        this.plus = game.add.button(this.centerX + 180, this.centerY - 190, 'delay-plus', function () {
            player.index = player.delays.indexOf(player.delay)
            if (player.delay == player.delays[player.delays.length - 1]) {

            } else {
                player.delay = player.delays[(player.index + 1) % player.delays.length]
            }
            _this.text.setText(player.delay + 's')
            player.sideplate.update()

            game.posgraph.fullGraph(game)
            game.velgraph.fullGraph(game)
            _this.report()
        })
        this.plus.events.onInputOver.add(function () {
            this.plus.tint = 0x427EC6;
        }, this);
        this.plus.events.onInputOut.add(function () {
            this.plus.tint = 0xFFFFFF;
        }, this);
        this.plus.anchor.set(.5)

        this.minus = game.add.button(this.centerX - 180, this.centerY - 190, 'delay-minus', function () {
            player.index = player.delays.indexOf(player.delay)
            if (player.delay == player.delays[0]) {

            } else {
                player.delay = player.delays[(player.index - 1)]

            }
            _this.text.setText(player.delay + 's')
            player.sideplate.update()
            game.posgraph.fullGraph(game)
            game.velgraph.fullGraph(game)
            _this.report()
        })
        this.minus.events.onInputOver.add(function () {
            this.minus.tint = 0x427EC6;
        }, this);
        this.minus.events.onInputOut.add(function () {
            this.minus.tint = 0xFFFFFF;
        }, this);
        this.minus.anchor.set(.5)

        this.display = game.add.sprite(this.centerX, this.centerY - 190, 'delay-display')
        this.display.anchor.set(.5)

        this.text = game.add.text(this.display.centerX, this.display.centerY, this.player.delay + "s", {
            font: '45px',
            fill: 'black',
            align: "center"
        });
        this.text.anchor.set(0.5)


        this.addChild(this.plus)
        this.addChild(this.minus)
        this.addChild(this.display)
        this.addChild(this.text)

        this.plus.flasher = new Flasher(this.plus)
        this.minus.flasher = new Flasher(this.minus)
    }
}


class SidePlate {
    constructor(player, key, textcolor, game) {
        this.player = player
        this.game = game
        this.box = game.add.sprite(player.centerX - 90, player.centerY + 12, key)
        //        biomechanic.game.add.sprite(123,123,'sideplate-p1')
        this.box.anchor.set(0.5)
        //        this.box.tint = color;
        this.delay = game.add.text(this.box.centerX + 2, this.box.centerY - 22, player.delay + 's', {
            font: '16px ',
            fill: textcolor,
            align: "left"
        });
        this.speed = game.add.text(this.box.centerX + 2, this.box.centerY + 2, player.speed + 'm/s', {
            font: '16px',
            fill: textcolor,
            align: "left"
        });
    }
    update() {
        this.delay.setText(this.player.delay + 's')
        if (this.game.settings.velocityGraphInvisible) {
            this.speed.setText(this.game.en.unknown)
        } else {
            this.speed.setText(this.player.speed + 'm/s')
        }
    }
    countdown(counter) {
        this.counter = counter
        if (this.player.delay > 0) {
            this.delay.addColorHack('#FF0000', 0)
        }
        var delayDisplay = (this.player.delay-this.counter)
        if (delayDisplay >= 0) {
            this.delay.setText(delayDisplay + "s")
            // this.timer = setInterval(function () {
            //     //                _this.delay.destroy()
            //     _this.counter -= 1
            //     _this.
            //     if (_this.counter == 0) { clearInterval(_this.timer) }
            // }, 1000)
        }
    }
}

class ProgressIndicator {
    constructor(game) {
        //        console.log(game.footer.text.worldPosition.y)
        //        this.stars = game.add.sprite(game.footer.box.right - 170, game.footer.box.top + 46, 'stars')
        //        this.stars.anchor.set(0.5)
        //        this.stars.frame = game.progress || 0

        this.next = game.add.button(game.footer.box.centerX + 300, 535, 'betButtons', function () {
            game.bet = null
            game.posgraph.resetGraph()
            game.velgraph.resetGraph()
            clearInterval(game.race);
            clearInterval(game.finish)
            game.playerone.animations.stop(null, true);
            game.playertwo.animations.stop(null, true);
            game.groups.menuGroup.scale.setTo(0);
            game.state.restart();
        });

        this.style = {
            font: '14px',
            fill: 'white',
            align: "center",
        }
        this.next.scale.set(1.2)
        this.next.anchor.set(0.5)
        this.next.tint = 0x72A5A5;
        this.next.text = game.add.text(0, 0,
            game.en.nextrace,
            this.style);
        this.next.addChild(this.next.text)
        this.next.text.anchor.set(.5)
        //        game.world.bringToTop(this.next.text)
        this.next.visible = false;

        var _this = this;
        this.next.events.onInputOver.add(function () {
            _this.next.tint = 0x619391;
        }, this);
        this.next.events.onInputOut.add(function () {
            _this.next.tint = 0x72A5A5;
        }, this);

    }
}

//class Title extends Phaser.Sprite {
//    constructor(x, y, game) {
//        super(game, x, y, 'title-plate');
//        game.add.existing(this);
//    }
//}

class Speech extends Phaser.Sprite {
    constructor(player, game) {
        super(game, player.right + 80, player.y + 28, 'speech');
        game.add.existing(this);

        this.style = {
            font: '16px',
            fill: 0x597c9e,
            align: "center",
            wordWrap: true,
            wordWrapWidth: this.width - 16
        };
        this.anchor.setTo(0.5);
        this.text = new Phaser.Text(game, 0, 0, '', this.style);
        //puts the label in the center of the button
        this.text.anchor.setTo(0.5);
        this.addChild(this.text);
    }
}

class TextBox extends Phaser.Sprite {
    constructor(x, y, game) {
        super(game, x, y, 'intro-box');
        game.add.existing(this);
        this.style = {
            font: '21px',
            fill: 'black',
            align: "center",
            wordWrap: true,
            wordWrapWidth: this.width - 25
        };
        this.anchor.setTo(0.5);
        this.text = new Phaser.Text(game, 0, -this.height * .05, '', this.style);
        this.text.anchor.setTo(0.5, 0.5);
        this.addChild(this.text);
    }

}



class Flasher {
    constructor(sprite) {
        this.sprite = sprite
        sprite.initialTint = sprite.tint;
        this.getAttention()
        //        this.state = game.state.getCurrentState()
        //        if (this.state.key == "PlayLevel") {
        var _this = this;
        playLevel.input.onDown.add(function () {
            //            console.log(_this.sprite.visible)
            if (_this.sprite.visible) {
                clearInterval(_this.sprite.blink)
                //                clearInterval(_this.grow)
                _this.sprite.tint = _this.sprite.initialTint || 0xFFFFFF;
                //                _this.destroy()
            }
        }, playLevel)
        //        }

    }
    getAttention() {
        var _this = this.sprite
        //        _this.scaleIncrement = .01
        //        _this.scaleValue = 1
        //        _this.grow = setInterval(function(){
        //                _this.scaleValue += _this.scaleIncrement
        //                _this.scale.set(_this.scaleValue)
        //                if (_this.scale.x > 1.09) {
        //                   _this.scaleIncrement *= -1
        //                } else if (_this.scale.x < 0.91) {
        //                    _this.scaleIncrement *= -1
        //                }
        //            }, 50)
        _this.flipper = true
        _this.blink = setInterval(function () {
            if (_this.flipper) {
                _this.tint = _this.initialTint || 0xFFFFFF
            } else {
                if (_this.initialTint == 0xFFFFFF) {
                    _this.tint = 0xFFFFBB
                } else {
                    _this.tint = _this.initialTint - 40;
                }
            }
            _this.flipper = !_this.flipper

        }, 350 + Math.random() * 100)
    }
}

class InfoBox extends Phaser.Sprite {
    constructor(x, y, game, txt) {
        super(game, x, y, 'infobox');
        game.add.existing(this);
        this.game = game
        this.anchor.set(0.5)
        this.style = {
            font: '13px',
            fill: 'black',
            align: "center",
            wordWrap: true,
            wordWrapWidth: this.width - 20
        };
        this.text = new Phaser.Text(game, 0, -this.height * .03, '', this.style);
        this.text.anchor.setTo(0.5, 0.5);
        this.addChild(this.text);
        this.preserve = false
        var _this = this;
        playLevel.input.onDown.add(function () {
            if (_this.visible && !_this.preserve) {
                if (_this.graphics != null) {
                    _this.graphics.destroy()
                }
                _this.destroy()
            }
        }, playLevel)
    }
    drawLine(side, locx, locy) {
        var x, y;
        if (side == 'top') {
            x = this.centerX;
            y = this.top + 5;
        } else if (side == 'left') {
            x = this.left + 5
            y = this.centerY
        } else if (side == 'bottom') {
            x = this.centerX;
            y = this.bottom - 5;
        } else if (side == 'right') {
            x = this.right - 5
            y = this.centerY
        }
        console.log(locx)
        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.beginFill(0xFF3300);
        this.graphics.lineStyle(3, 0x8d99b9, 1);
        this.graphics.moveTo(x, y);

        this.graphics.lineTo(locx, locy);
        this.graphics.endFill();



    }
}

class Countdown {
    constructor(game) {
        this.game = game;
        this.style = {
            font: '50px',
            fill: 'red',
            align: "center",
            'wordWrap': false,
            stroke: 'black',
            strokeThickness: 2,
        }


    }
    countdown() {
        var _this = this;
        console.log('begin countdown')
        this.counter = 0
        this.scaler = true
        this.txt = this.game.add.text(this.game.track.centerX, this.game.track.centerY, '3', this.style)
        this.txt.anchor.set(.5)
        this.game.world.bringToTop(this.txt)
        this.timer = setInterval(function () {
            if (_this.scaler) {
                _this.txt.scale.set(1 - ((_this.counter % 10) * .1))
            }
            if (_this.counter == 10) {
                _this.txt.scale.set(1)
                _this.txt.setText('2')
            }
            if (_this.counter == 20) {
                _this.txt.scale.set(1)
                _this.txt.setText('1')
            }
            if (_this.counter == 30) {
                _this.scaler = false
                _this.txt.scale.set(1)
                _this.txt.addColorHack('#000080', 0)
                _this.txt.setText(_this.game.en.go)
            }
            if (_this.counter == 40) {
                _this.counter = 0;
                _this.txt.visible = false;
                clearInterval(_this.timer)
            }
            _this.counter++

        }, 100)


    }

}

class ScorePlate {
    constructor(game) {
        this.game = game;
        this.box = game.add.sprite(170, 35, 'score-plate')
        this.box.anchor.set(.5)
        this.stars = game.add.sprite(this.box.centerX + 30, this.box.centerY - 11, 'stars')
        this.stars.anchor.set(.5)
        this.stars.scale.set(.6)
        this.stars.frame = game.progress || 0
        this.style = {
            font: '16px',
            fill: 'black',
            align: "center",
            'wordWrap': false,
        }

        this.playertwoScore = game.add.text(this.box.centerX + 30, this.box.centerY + 12, game.score, this.style)
        this.playertwoScore.anchor.set(.5)
    }

    update() {
        this.stars.frame = this.game.progress
        this.playertwoScore.setText(this.game.score)
        this.flasher = new Flasher(this.box)
    }
}