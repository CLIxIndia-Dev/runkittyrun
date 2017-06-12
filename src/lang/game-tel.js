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
            introTextBoxA : "కిట్టికి సహాయం అవసరం అయినట్టుంది",
            introTextBoxB : "రన్ కిట్టి రన్ లో మీరు ఒక పిల్లిని, ఎలుకను పట్టుకునే విధంగా తయ్యారు చేస్తున్నారు. \nప్లేయర్ 1: ప్రతీ స్తాయిలో కిట్టిని నియంత్రించటానికి వేరు వేరు టూల్స్ ఉంటాయి. ప్రతీ రేసులో, కిట్టి మౌస్ను ముగింపు లైను దగ్గర పట్టుకోవలసి ఉంటుంది. మౌస్ను ముగింపు కన్నా ముందు పట్టుకుంటే అది గెలుపు కింద పరిగణించబడదు. \nహెచ్చరిక: కిట్టి మరియు మౌస్కు వేరు వేరు ప్రారంభ సమయాలు మరియు వేగాలు ఉండవచ్చు.",
            introTextBoxC : "కిట్టి మౌస్ను  ముగింపు లైను దగ్గర పట్టుకున్న ప్రతిసారి ప్లేయర్ 1 ఒక స్టార్ను పొందుతారు.",
            introTextBoxD : "ప్లేయర్ 1 రేసుకి సిద్దమైన తర్వాత, ప్లేయర్ 2 పందెం వేస్తాడు.",
            introTextBoxE : "రేసు టై అయిన ప్రతిసారి ఒక స్టార్ను పొందుతారు.\nమూడు స్టార్లు వస్తే తదుపరి స్థాయికి వెళ్తారు.\n ప్రతీ కొత్త స్థాయిలో స్కోరు మళ్ళీ మొదలవుతుంది. విద్యార్దులు, ప్లేయర్ 1 మరియు ప్లేయర్ 2 కింద వారి వారి స్థానాలను మార్చుకోవచ్చు.",
            introCatSpeech : "హమ్ మ్ మ్ మ్",
            introMouseSpeech : "నువ్వు నన్ను పట్టుకోలేవు!",
            
            footerText : "మౌస్ను పట్టుకునేందుకు, కిట్టిని అదే సమయంలో ముగింపు లైను దగ్గరకు చేర్చవలసి ఉంటుంది. సిద్దమా?",
            betBox : "ప్లేయర్ 2 పందెం వెయ్యండి: కిట్టి చేరుతుందా",
            
            velocityInfoA : "ప్లేయర్ 1: పైకి, క్రిందికి ఎరోస్\nఉపయోగించి కిట్టి యొక్క వేగాన్ని నిర్ణయించండి. మౌస్ ముగింపుకు చేరుకొనే సమయానికే కిట్టి కూడా చేరుకొనేలా కిట్టి యొక్క వేగాన్ని సర్దుబాటు చేయండి.",
            velocityInfoB : "ప్లేయర్ 2: ఏం జరుగుతుందో అంచనా వేసి ఒక పందెం వెయ్యండి.",
            
            graphInfoA : "ఇప్పుడు మీ దగ్గర ఒక స్థానం గ్రాఫ్ మరియు వేగం గ్రాఫ్ ఉన్నాయి. అవ్వి ఉపయోగించి మౌస్ను కిట్టి పట్టుకునేటట్లు చెయ్యండి.",
            
            liveInfoA : "ఇప్పుడు, రేసు ప్రారంభం అయ్యిన తర్వాత రెండు గ్రాఫ్లు కనిపిస్తాయి. మౌస్ ముగింపుకు చేరుకొనే సమయానికే కిట్టి కూడా చేరుకొనేలా కిట్టి యొక్క వేగాన్ని సర్దుబాటు చేయండి.",
            
            delayInfoA : "ఈ స్థాయిలో కిట్టి, మౌస్ అదే సమయంలోముగింపుకు చేరుకోవడానికి కిట్టి యొక్క ఆలస్యపు సమయాన్ని సెట్ చెయ్యవచ్చు. ప్రయత్నించండి.",
            speedInfoA : "పైకి, క్రిందికి ఎరోస్ ఉపయోగించి\nకిట్టి యొక్క వేగాన్ని నిర్ణయించండి. మౌస్ ముగింపుకు చేరుకొనే సమయానికే కిట్టి కూడా చేరుకొనేలా కిట్టి యొక్క వేగాన్ని సర్దుబాటు చేయండి.",
            useGraphInfoA : "వేగం గ్రాఫ్ సూచనలు ఉపయోగించి కిట్టి మరియు మౌస్ అదే సమయంలో ముగింపుకు చేరుకొనేలా కిట్టి యొక్క వేగాన్ని సెట్ చేయండి.",
            matchInfoA : "ఇప్పుడు కిట్టి యొక్క ఆలస్యపు సమయం లేదు.కిట్టి యొక్క వేగాన్ని మౌస్ యోక్క వేగంతో సమానంగా పైకి, క్రిందికి ఎరోస్ ఉపయోగించి గ్రాఫ్ను సర్దుబాటు చేయండి.",
            rightontime : "ప్లేయర్ 2:\nమీ పందెం సరైనది.\nకిట్టి సమయానికే చేరుకుంది.",
            wrongontime : "ప్లేయర్ 2:\nమీ పందెం సరైనది కాదు.\nకిట్టి సమయానికే చేరుకుంది.",
            rightlate : "ప్లేయర్ 2:\nమీ పందెం సరైనది.\nకిట్టి ఆలస్యంగా చేరుకుంది.",
            wronglate : "ప్లేయర్ 2:\nమీ పందెం సరైనది కాదు.\nకిట్టి ఆలస్యంగా చేరుకుంది.",
            rightearly : "ప్లేయర్ 2:\nమీ పందెం సరైనది.\nకిట్టి త్వరగా చేరుకుంది.",
            wrongearly : "ప్లేయర్ 2:\nమీ పందెం సరైనది కాదు.\nకిట్టి త్వరగా చేరుకుంది.",
            kittyearly : "ప్లేయర్ 1:\nక్షమించండి!\nకిట్టి ముందుగా చేరుకుంది!",
            kittylate : "ప్లేయర్ 1:\nక్షమించండి!\nకిట్టి ఆలస్యంగా చేరుకుంది!",
            kittyontime : "ప్లేయర్ 1:\nసబాష్!\nకిట్టి సమయానికి చేరుకుంది.",
            
            wrongfooter : "మన్నించండి, మౌస్ ముగింపుకు చేరుకునే సమయానికి కిట్టి చేరుకోలేదు.",
            catch : "ప్లేయర్ 1:\nసబాష్! కిట్టి సమయానికి చేరుకుంది.",
            
            nobet : "పందెం వెయ్యలేదు.",
            nope : "కాదు!",
            nextlevel : "తదుపరిస్థాయి",
            nextrace : "తదుపరిరేసు",
            late : "ఆలస్యం",
            ontime : "సమయానికి",
            soon : "త్వరగా",
            
            level : "స్థాయి",
            tutorial : "బోధన",

            time : "సమయం(s)",
            great : "గ్రేట్!",
            unknown : "???",
            continue : "కొనసాగించండి",
            locked : 'బందీ',
            ok : "సరి!",
            position : "స్థానం(m)",
            speed : "వేగం(m/s)",
            go : "వెళ్ళు!",
            restart : "మళ్ళీ మొదలు పెడదాం",
        }
    }
    start() {
        this.game.state.start("Loading");
    }
}

var rkr = new BioMechanic();
rkr.start();