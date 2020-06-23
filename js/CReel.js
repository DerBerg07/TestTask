class Reel{
    constructor(num, textures, reelContainer, mask, reelWidth, symbolSize) {
        this.elemTextures = textures;
        this.container = new PIXI.Container();
        this.symbols = [];
        this.position = 0;
        this.prevPosition = 0;
        this.blur  = new PIXI.filters.BlurFilter();
        this.reelContainer = reelContainer;
        this.reelWidth = reelWidth;
        this.symbolSize = symbolSize;

        this.mask = mask;

        this._init();
    }

    _init(){
        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.container.filters = [this.blur];
        this.container.mask = this.mask;
        this.createSymbols();
    }

    createSymbols(){
        for(let i = 0; i < 4; i++){
            let symbol =  new PIXI.Sprite(this.elemTextures[Math.floor(Math.random() * this.elemTextures.length)]);
            symbol.y  = i *  (this.symbolSize + 10);
            symbol.scale.x = symbol.scale.y = Math.min( this.symbolSize / symbol.width,  this.symbolSize / symbol.height)
            symbol.x = Math.round(( this.symbolSize - symbol.width) / 2);
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }


        this.addReel();
    }

    addReel(){
        this.reelContainer.addChild(this.container);
    }
}