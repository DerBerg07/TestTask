
    window.onload = function(){


    const gameContainer = document.getElementById('game');
    let resources;
    const appHeight  = gameContainer.offsetHeight;
    const appWidth  = appHeight*16/9;


    let application = new PIXI.Application({
        backgroundColor: "white",
        width: appWidth,
        height: appHeight,
        resolution: window.devicePixelRatio,
    });



    gameContainer.appendChild(application.view);
    let loader = application.loader;
    loader.baseUrl = 'img';
    loader.add('background', 'Background.png')
        .add('frame', 'Reel_Frame.png')
        .add('spin_Button', 'SPIN_normal.png')
        .add('symbol_Bell', 'Symbols/Symbol_Bell.png')
        .add('symbol_Bomb', 'Symbols/Symbol_Bomb.png')
        .add('symbol_Cherry', 'Symbols/Symbol_Cherry.png')
        .add('symbol_Grape', 'Symbols/Symbol_Grape.png')
        .add('symbol_Lemon', 'Symbols/Symbol_Lemon.png')
        .add('symbol_Seven', 'Symbols/Symbol_Seven.png')
        .add('symbol_Watermelon', 'Symbols/Symbol_Watermelon.png');
        loader.load();
    loader.onProgress.add(loadProgress);
        console.log(loader);
        loader.onComplete.add(loadEnd);

    console.log(loader);

    function loadProgress(e) {
        console.log(e.progress);
    }

    function loadEnd() {
        resources = loader.resources;
        let slot =  new Slot(application, resources, appWidth, appHeight)
    }



};
