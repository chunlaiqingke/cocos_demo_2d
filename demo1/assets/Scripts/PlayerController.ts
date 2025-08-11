import { _decorator, Component, EventMouse, input, Input, Node, Vec3, Animation } from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE: number = 40;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Animation)
    BodyAnim: Animation = null;

    _startJump: boolean = false;
    _jumpStep: number = 0;
    _curJumpTime: number = 0;
    _curJumpSpeed: number = 0;
    _jumpTime: number = 0.1;
    _curPos: Vec3 = new Vec3();
    _deltaPos: Vec3 = new Vec3(0, 0, 0);
    _targetPos: Vec3 = new Vec3();
    private _curMoveIndex: number = 0;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) { 
                this.node.setPosition(this._targetPos);
                this._startJump = false;
            } else {
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onMouseUp(event: EventMouse) {
        console.log("onMouseUp");
        if (event.getButton() == EventMouse.BUTTON_LEFT) {
            this.jumpByStep(1);
        } else if (event.getButton() == EventMouse.BUTTON_RIGHT) {
            this.jumpByStep(-1);
        }
        
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;

        const clipName = step == 1 ? 'oneStep' : 'twoStep'
        const state = this.BodyAnim.getState(clipName);
        this._jumpStep = state.duration

        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0))

        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play("oneStep");
            } else if (step === -1) {
                this.BodyAnim.play("twoStep");
            }
        }
        this._curMoveIndex += step;
    }

    reset(){
        this._curMoveIndex = 0;
        this.node.getPosition(this._curPos);
        this._targetPos.set(0, 0, 0);
    }

    onOnceJumpEnd() {
        this.node.emit('JumpEnd', this._curMoveIndex);
    }
}

