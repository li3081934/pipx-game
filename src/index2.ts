import { Application, Loader, AnimatedSprite } from 'pixi.js'
const app = new Application({ width: 512, height: 512, antialias: true, transparent: false, resolution: 1 })
const loader = new Loader()
loader
    .add('/assets/texture/character.json')
    .load(() => {
        const textureStore = loader.resources['/assets/texture/character.json'].textures
        const frames = []
        frames.push(textureStore['characters-3.png'])
        frames.push(textureStore['characters-5.png'])
        const anim = new AnimatedSprite(frames) as any
        anim.x = 68
        anim.y = 50
        anim.vx = 0
        anim.vy = 0
        anim.animationSpeed = 0.05
        app.stage.addChild(anim)
        const left = keyboard(37),
            up = keyboard(38),
            right = keyboard(39),
            down = keyboard(40);
        down.press = () => {
            anim.vy = 1.5;
            anim.vx = 0;
            anim.play()
        };
        down.release = () => {
            if (!up.isDown && anim.vx === 0) {
                anim.vy = 0;
                anim.stop()
            }
        };
        app.ticker.add(delta => gameLoop(delta));
        function gameLoop(delta) {
            anim.x += anim.vx;
            anim.y += anim.vy
        }
    })

function keyboard(keyCode) {
    let key: any = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
document.body.appendChild(app.view)
