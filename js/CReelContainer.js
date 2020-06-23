class ReelContainer {
    constructor(application, resources, slot) {
        this.application = application;
        this._resources = resources;
        this.slot = slot;
        this.reels = [];
        this.slotTextures = [
           resources.symbol_Bell.texture,
           resources.symbol_Bomb.texture,
           resources.symbol_Cherry.texture,
           resources.symbol_Grape.texture,
           resources.symbol_Lemon.texture,
           resources.symbol_Seven.texture,
           resources.symbol_Watermelon.texture,
        ];

        this.tweening  = [];
        this.symbolSize;
        this.reelWidth;
        this.spining = false;
        this._init();
    }

    _init(){
        this.container = new PIXI.Container();
        this.slot._slot.addChild(this.container);
        this.createFrame();

        this.addAnimateUpdate();
    }

    createFrame(){
        this._frame = new PIXI.Sprite.from(this._resources.frame.texture);
        this._frame.anchor.set(0.5);
        this._frame.position.set(this.slot._width/2, this.slot._height/2);
        this._frame.scale.set(0.8);

        this.symbolSize = this._frame.height/3 - 40;
        this.reelWidth = this._frame.width/3 - 20;

        this.container.addChild(this._frame);

        this.createSpinButton();
    }

    createSpinButton(){
        this._spinButton = new PIXI.Sprite.from(this._resources.spin_Button.texture);
        this._spinButton.anchor.set(0.5);
        this._spinButton.position.set(this.slot._width/2 + this._frame.width/2, this.slot._height/2);
        this._spinButton.scale.set(0.8);
        this._spinButton.interactive = true;

        this._spinButton.addListener('click', () => {
            this.startSpin();
        });
        this.container.addChild(this._spinButton);

        this.createMask();
    }

    createReels(){
        for(let i = 0; i < 3; i++){
            this.reels.push(new Reel(i, this.slotTextures, this.container, this._mask, this.reelWidth, this.symbolSize));
            this.reels[i].container.x = this.reelWidth *  i + 10 + this.slot._width/2 - this._frame.width/2+25;
            this.reels[i].container.y = this.slot._height/2 - this._frame.height/2 + 30  ;
        }
    }

    createMask(){
        this._mask = new PIXI.Graphics();
        this._mask.beginFill(0xDE3249);
        this._mask.drawRect(this.slot._width/2 - this._frame.width/2, this.slot._height/2 - this._frame.height/2 + 40,this.slot._width/2 + this._frame.width/2 - 40, this.slot._height/2 + this._frame.height/2 - 85);
        this._mask.endFill();

        this.createReels();
    }

    startSpin(){

        if(this.spining){
            return;
        }
        this.spining = true;

        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            console.log(i === this.reels.length - 1);
            this.tweenTo(r, 'position', target, time, this.backout(0.5), null, i === this.reels.length - 1 ? this.reelsComplete : null);
        }

    }


    reelsComplete = ()=>{
        this.spining = false;
        for(let i = 0; i < this.reels.length; i++){
            let combination  = [];
            let shift  = this.reels[i].position%4;
            console.log(shift);
            for (let j = 0; j<this.reels[i].symbols.length; j++){
                combination.push(this.reels[i].symbols[j].texture.textureCacheIds[0]);
            }
            console.log(combination.splice(-shift).concat(combination).splice(1,3));
        }
    };

    tweenTo(object, property, target, time, easing, onchange, oncomplete){
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        this.tweening.push(tween);
        return tween;
    }


    addAnimateUpdate(){


        this.application.ticker.add((delta) => {
            // Update the slots.
            for (let i = 0; i < this.reels.length; i++) {
                const r = this.reels[i];

                r.blur.blurY = (r.position - r.previousPosition) * 8;
                r.previousPosition = r.position;

                for (let j = 0; j < r.symbols.length; j++) {
                    const s = r.symbols[j];
                    const prevy = s.y;
                    s.y = ((r.position + j) % r.symbols.length) * (this.symbolSize + 20)  - this.symbolSize;
                    if (s.y < 0 && prevy > this.symbolSize) {


                        s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
                        s.scale.x = s.scale.y = Math.min(this.symbolSize / s.texture.width, this.symbolSize / s.texture.height);
                        s.x = Math.round((this.symbolSize - s.width) / 2);
                    }
                }
            }
        });





        this.application.ticker.add((delta) => {
            const now = Date.now();
            const remove = [];
            for (let i = 0; i < this.tweening.length; i++) {
                const t = this.tweening[i];
                const phase = Math.min(1, (now - t.start) / t.time);

                t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
                if (t.change) t.change(t);
                if (phase === 1) {
                    t.object[t.property] = t.target;
                    if (t.complete) t.complete(t);
                    remove.push(t);
                }
            }
            for (let i = 0; i < remove.length; i++) {
                this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
            }
        });

    }


    lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }
    backout(amount) {
        return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
    }
}