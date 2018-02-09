/*jslint esnext: true */

class BioMechanic {
    constructor() {
        this.debug = false;
        this.width = 1024;
        this.height = 768;
        this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, '');
        this.game.reporter = new GameReporter()
        this.game.state.add("Loading", loading);
        this.game.state.add("PlayLevel", playLevel);
        this.game.state.add("Ending", ending);
        this.game.levels = 7;
        this.game.currentLevel = 0;
        this.game.progress = 0
        this.game.score = 0
        
        this.game.level = [];
        this.game.level[0] = {
            intro : true
        }
        this.game.level[1] = {
            velocityControl : true,
            graphVisibleBeforeGo : false,
            graphVisibleAfterGo : false,
            velocityInfo : true,
            betInfo : true,
        }
        this.game.level[2] = {
            velocityControl : true,
            graphVisibleBeforeGo : true,
            graphVisibleAfterGo : true,
            responsiveGraph : true,
            graphInfo : true,
        }
        this.game.level[3] = {
            velocityControl : true,
            graphVisibleBeforeGo : false,
            graphVisibleAfterGo : true,
            livePlot : true,
            liveInfo : true
        }
        this.game.level[4] = {
            delayControl : true,
            graphVisibleBeforeGo : false,
            graphVisibleAfterGo : true,
            livePlot : true,
            delayInfo : true
        }
        this.game.level[5] = {
            velocityControl : true,
            graphVisibleBeforeGo : true,
            graphVisibleAfterGo : true,
            speedInfo : true, // ?
        }
        this.game.level[6] = {
            velocityControl : true,
            graphVisibleBeforeGo : true,
            positionGraphInvisible : true,
            speedInvisible : true,
            graphVisibleAfterGo : true,
            useGraphInfo : true,
        }
        this.game.level[7] = {
            velocityControl : true,
            graphVisibleBeforeGo : true,
            velocityGraphInvisible : true,
            mousePlotInvisible : true,
            graphVisibleAfterGo : true,
            zeroDelay : true,
            matchInfo : true
        }
        this.game.en = {
            introTextBoxA : "Looks like Kitty needs your help...",
            introTextBoxB : "In Run Kitty Run, you are training Kitty to be the best mouse catcher! \nPlayer 1: On each level, you have different tools to control Kitty. Kitty needs to catch Mouse at the finish line in every race. Catching the Mouse early does not count as success. \nPay Attention: Kitty and Mouse can have different start times and speeds.",
            introTextBoxC : "Each time Kitty catches Mouse at the finish line, Player 1 earns a star.",
            introTextBoxD : "After Player 1 is ready to race, PLAYER 2 will make a Bet. ",
            introTextBoxE : "Each time race earns a star.\nThree stars advances to the next level.\n Scores reset with each new level. Students are encouraged \nto swap who is Player 1 and Player 2.",
            introCatSpeech : "Hmmmmm",
            introMouseSpeech : "You can't catch me!",
            
            footerText : "Make Kitty reach the finish line at the same time to catch Mouse. Ready?",
            betBox : "Player 2 Make a Bet: Will Kitty arrive",
            
            velocityInfoA : "PLAYER 1: Set Kitty’s SPEED using the up and down arrows. Adjust Kitty’s speed to finish at the same time as Mouse.",
            velocityInfoB : "PLAYER 2: Make a bet and predict what will happen.",
            
            graphInfoA : "Now you have a POSITION graph and a SPEED graph. Use them to help Kitty catch Mouse.",
            
            liveInfoA : "Now, both graphs will appear after the race has started. Adjust Kitty’s speed to finish at the same time as Mouse.",
            
            delayInfoA : "On this level, set Kitty’s DELAY so she finishes at the same time as Mouse. Try it.",
            speedInfoA : "Set Kitty’s SPEED using the up and down arrows. Adjust Kitty’s speed to finish at the same time as Mouse.",
            useGraphInfoA : "Set Kitty’s SPEED using clues from the SPEED graph to finish at the same time as Mouse.",
            matchInfoA : "Now, Kitty does NOT have a delay. Match Kitty to Mouse’s speed. Use the up and down arrows to adjust the graph.",
            rightontime : "Player 2:\nYour BET was CORRECT\nKitty was ON TIME.",
            wrongontime : "Player 2:\nYour BET was WRONG.\nKitty was ON TIME.",
            rightlate : "Player 2:\nYour BET was CORRECT\nKitty was LATE.",
            wronglate : "Player 2:\nYour BET was WRONG.\nKitty was LATE.",
            rightearly : "Player 2:\nYour BET was CORRECT\nKitty was EARLY.",
            wrongearly : "Player 2:\nYour BET was WRONG.\nKitty was EARLY.",
            kittyearly : "Player 1:\nSORRY! KITTY WAS EARLY!",
            kittylate : "Player 1:\nSORRY! KITTY WAS LATE!",
            kittyontime : "Player 1:\nNICE JOB! KITTY TIED!",
            
            wrongfooter : "Sorry, Kitty didn’t finish at the same time as Mouse.",
            catch : "Player 1:\nNICE JOB! KITTY TIED!",
            
            nobet : "No bet was made.",
            nope : "Nope!",
            nextlevel : "Next Level",
            nextrace : "Next Race",
            late : "LATE",
            ontime : "ON TIME",
            soon : "EARLY",
            
            level : "LEVEL",
            tutorial : "TUTORIAL",

            time : "Time (s)",
            great : "Great!",
            unknown : "???",
            continue : "CONTINUE",
            locked : 'LOCKED',
            ok : "OK!",
            position : "Position (m)",
            speed : "Speed (m/s)",
            go : "Go!",
            restart : "RESTART",
        }
    }
    start() {
        this.game.state.start("Loading");
    }
}

var rkr = new BioMechanic();
rkr.start();