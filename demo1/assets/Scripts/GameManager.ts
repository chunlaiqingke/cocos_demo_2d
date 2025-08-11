import { _decorator, CCInteger, Component, Game, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { BLOCK_SIZE,  PlayerController} from './PlayerController';

const { ccclass, property } = _decorator;

enum BlockType{
    BT_NONE,
    BT_STONE
}

enum GameState{
    GS_INIT,
    GS_PLAYING,
    GS_END
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type: Prefab})
    private boxPrefab: Prefab|null = null;
    @property(CCInteger)
    private roadLenth: number = 50;
    private _road: BlockType[] = [];

    @property(Node)
    public startMenu: Node|null = null;
    @property(PlayerController)
    public playCtrl: PlayerController|null = null;
    @property(Label)
    public stepLabel: Label|null = null;

    start() {
        this.setCurState(GameState.GS_INIT);
        this.playCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this);
    }

    update(deltaTime: number) {
        
    }

    init() {
        if (this.startMenu) {
            this.startMenu.active = true;
        }
        this.generateRoad();

        if (this.playCtrl) {
            this.playCtrl.setInputActive(false);
            this.playCtrl.node.setPosition(Vec3.ZERO);
            this.playCtrl.reset();
        }
    }

    playing() {
        if (this.startMenu) {
            this.startMenu.active = false;
        }
        if (this.stepLabel) {
            this.stepLabel.string = "0";
        }
        setTimeout(() => {
            if (this.playCtrl) {
                this.playCtrl.setInputActive(true);
            }
        }, 0.1);
    }

    generateRoad(){ 
        console.log("generateRoad");
        this.node.removeAllChildren();

        this._road = [];

        this._road.push(BlockType.BT_STONE);

        for (let i = 1; i < this.roadLenth; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE)
            } else {
                this._road.push(Math.floor(Math.random() * 2))
            }
        }

        for (let i = 0; i < this.roadLenth; i++) {
            let block: Node | null = this.spawnBlockByType(this._road[i]);
            if (block) {
                this.node.addChild(block)
                block.setPosition(i * BLOCK_SIZE, 0, 0)
            }
        }
    }

    spawnBlockByType(type: BlockType) { 
        
        if (!this.boxPrefab) {
            return null;
        }
        console.log("spawnBlockByType")
        let block: Node | null;

        switch (type) {
            case BlockType.BT_STONE: 
                block = instantiate(this.boxPrefab);
                break;
        }
        return block;
    }

    setCurState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                this.playing();
                break;
            case GameState.GS_END:
                
                break;
        }
    }

    onStartButtonClicked(){
        this.setCurState(GameState.GS_PLAYING);
    }

    onPlayerJumpEnd(moveIndex: number){
        console.log("玩家跳跃结束！");
    }
}

