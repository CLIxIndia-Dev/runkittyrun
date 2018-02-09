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
//        this.game.state.add("Ending", ending);
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
            introTextBoxA : "लगता है कि किटी को आपकी मदद चाहिए।",
            introTextBoxB : "खेल में किटी चूहे के बराबर गति पाने की प्रैक्टिस कर रही है, ताकि एक दिन वह उसे पकड़ सके। \nआपके पास तरह तरह के साधन है किटी की मदद के लिए। शर्त एक ही है कि किटी को रेस की फिनिश लाइन पर उसी समय पहुचना है जब चूहा वहां पहुंचता है। अगर किटी पहले वहां पहुंचती है तो उसे जीत नहीं माना जाएगा। \nध्यान दीजिए - कि किटी और चूहे का दौड़ प्रारंभ करने का समय और स्पीड भिन्न भिन्न हो सकती है।",
            introTextBoxC : "जब जब किटी चूहे के साथ ही फिनिश लाइन पर पहुंचती है तब प्लेयर १ स्टार जीतता है।",
            introTextBoxD : "After Player 1 is ready to race, PLAYER 2 will make a Bet. ",
            introTextBoxE : "रेस में हर टाइ होने पर १ एक स्टार मिलेगा।\n ३ स्टार मिलते ही खेल अगले लेवल पर जाएगा। नए लेवल पर स्कोर फिर से शुरू होगा।\n हर लेवल पर प्लेयर स्थिति बदल लें।",
            introCatSpeech : "हम्ममम",
            introMouseSpeech : "तुम मुझे नहीं पकड़ सकती!",
            
            footerText : "Make Kitty reach the finish line at the same time to catch Mouse. Ready?",
            betBox : "प्लेयर २ शर्त लगाइए: क्या किटी आएगी ?",
            
            velocityInfoA : "प्लेयर १:किटी की स्पीड बदलने के लिए तीरनुमा बटन का उपयोग करें। उसे बस उतनी ही स्पीड दें जिससे कि वह फिनिश लाइन पर चूहे के साथ ही पहुचे।",
            velocityInfoB : "प्लेयर २: शर्त लगाए और अनुमान करें कि क्या होगा।",
            
            graphInfoA : "अब आपके पास स्थिति-समय और स्पीड-समय का ग्राफ है। इसकी मदद लें किटी को चूहे तक पहुंचाने में।",
            
            liveInfoA : "अब दोनो तरह के ग्राफ रेस के प्रारंभ होने के बाद ही नज़र आएंगे। किटी की स्पीड को इस तह नियंत्रित करें कि वह चूहे के साथ ही फिनिश लाइन पर पहुंचे।",
            
            delayInfoA : "किटी कितनी देर से दौड़ना शुरु कर सकती है यह तय करना आपके हाथ में है। बस किटी को चूहे के साथ ही फिनिश लाइन पर पहुंचना है।",
            speedInfoA : "तीरनुमा बटन के सहारे आप किटी की गति को तय कर सकते हैं। शर्त यही है कि किटी चूहे के साथ ही फिनिश लाइन पर पहुंचे।",
            useGraphInfoA : "गति ग्राफ का सहारा लेकर किटी की गति को इस तरह तय करें कि वह चूहे से ताथ ही फिनिश लाइन पर पहुंचे।",
            matchInfoA : "किटी और चूहा साथ में ही दौड़ना शुरु करते हैं। ग्राफ की मदद से किटी की गति को चूहे की गति से मिलाएं।",
            rightontime : "प्लेयर २:\n आपका अनुमान सही था!\n किटी समय पर पहुंची।",
            wrongontime : "प्लेयर २:\n आपका अनुमान गलत था!\n किटी समय पर पहुंची।",
            rightlate : "प्लेयर २:\n आपका अनुमान सही था!\n किटी देर से पहुंची।",
            wronglate : "प्लेयर २:\n आपका अनुमान गलत था!\n किटी देर से पहुंची।",
            rightearly : "प्लेयर २:\n आपका अनुमान सही था!\n किटी जल्दी पहुंच गई।",
            wrongearly : "प्लेयर २:\n आपका अनुमान गलत निकला! किटी जल्दी पहुंच गई।",
            kittyearly : "प्लेयर १:\n माफ कीजिये!\n किटी जल्दी पहुच गई।",
            kittylate : "प्लेयर १:\n माफ कीजिये!\n किटी देरी से पहुंची।",
            kittyontime : "प्लेयर १:\n बहुत बढ़िया!\n किटी और चूहा साथ साथ पहुंचे।",
            
            wrongfooter : "Sorry, Kitty didn’t finish at the same time as Mouse.",
            catch : "प्लेयर १: बहुत बढ़िया! किटी और चूहा साथ साथ पहुंचे।",
            
            nobet : "No bet was made.",
            nope : "नहीं!",
            nextlevel : "अगला लेवल",
            nextrace : "अगली रेस",
            late : "देरी से",
            ontime : "समय पर",
            soon : "जल्दी",
            
            level : "लेवल",
            tutorial : "टूटोरियल",
            
            time : "समय(सें.)",
            great : "शाबाश!",
            unknown : "???",
            continue : "जारी रखें",
            locked : 'बंद',
            ok : "ठीक है!",
            position : "स्थिति (मी.)",
            speed : "स्पीड(मी./सें.)",
            go : "शुरू करें!",
            restart : "फिर से शुरू करें",
        }
    }
    start() {
        this.game.state.start("Loading");
    }
}

var rkr = new BioMechanic();
rkr.start();