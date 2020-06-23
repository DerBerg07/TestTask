class Slot {
    constructor(application, resources, width, height) {
        this.application = application;
        this._resources = resources;
        this._width = width;
        this._height = height;

        this.init();
    }

    init(){
        this._slot = new PIXI.Container();
        this.application.stage.addChild(this._slot);
        this._backgroundPicture = new PIXI.Sprite.from(this._resources.background.texture);
        this._backgroundPicture.height = this._height;
        this._backgroundPicture.width = this._width;
        this._slot.addChild(this._backgroundPicture);
        this.reelContainer = new ReelContainer(this.application, this._resources, this);
    }


}