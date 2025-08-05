import { _decorator, Component, EventMouse, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {

    _startJump: boolean = false;
    _jumpStep: number = 0;
    _curJumpTime: number = 0;
    _curJumpSpeed: number = 0;
    _jumpTime: number = 0.1;
    _curPos: Vec3 = new Vec3();
    _deltaPos: Vec3 = new Vec3(0, 0, 0);
    _targetPos: Vec3 = new Vec3();

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

    onMouseUp(event: EventMouse) {
        console.log("onMouseUp");
        if (event.getButton() == EventMouse.BUTTON_LEFT) {
            this.jumpByStep(1);
        } else if (event.getButton() == EventMouse.BUTTON_RIGHT) {
            this.jumpByStep(-1);
        }
        
    }

    jumpByStep(step: number) {
        console.log("jumpByStep", step);
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0))
    }
}

