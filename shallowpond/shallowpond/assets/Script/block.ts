import game from "./common";

const { ccclass, property } = cc._decorator;

@ccclass
export default class block extends cc.Component {
    @property(cc.Node)
    node_click: cc.Node = null;
    @property({ 
        type: cc.AudioClip
        })
    audio_move:cc.AudioClip=null;
    @property({ 
        type: cc.AudioClip
        })
    audio_win:cc.AudioClip=null;
    private _markX: number;//角标x
    private _markY: number;//角标y
    private _blockType: string;//用于标明类型
    private _Edit: boolean;//用于判断是否进入编辑模式
    private _moveMinDis;//移动最小距离
    private _moveMaxDis;//移动最大距离
    private _ishero;
    onLoad() {
        this.setTouch();
        this._Edit = false;
        this.node_click.active = false;
        this.node_click.width = this.node.width;
        this.node_click.height = this.node.height;
    }

    start() {

    }
    //标明块类型
    init(blockType, mark, ishero) {
        this._blockType = blockType;
        this._markX = mark.x;
        this._markY = mark.y;
        this._ishero = ishero
    }
    //编辑使用
    initEdit(blockType) {
        this._blockType = blockType;
        this._Edit = true;
    }
    //刷新角标
    replayMark() {
        this.getMarkArr();
    }
    setTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.getBlockMoveDistance();
            this.node_click.active = true;
        }, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (this._ishero == 0) {
                this.pdGameOver();
                return
            }
            let game=cc.find('Canvas').getComponent('game');
            if(game.canEffect){
                cc.audioEngine.play(this.audio_move,false,1);   
               }
            this.getMarkArr();
            this.setBlockPos();
            cc.find('Canvas').getComponent('game').getArrTestBlock();
            this.node_click.active = false;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            if (this._ishero == 0) {
                this.pdGameOver();
                return
            }
            this.getMarkArr();
            this.setBlockPos();
            cc.find('Canvas').getComponent('game').getArrTestBlock();
            this.node_click.active = false;
        }, this);

    }
    pdGameOver() {
        let posHero = this.node.getPosition()
        let posMax = this.getBlockPos(cc.v2(4, 4))
        if (posHero.x >= posMax.x) {
            cc.log('闯关成功')
            cc.audioEngine.play(this.audio_win,false,1)
            let act_1 = cc.moveBy(0.5, cc.v2(300, 0))
            let act_2 = cc.callFunc(() => {
                cc.find('Canvas').getComponent('game').playGameOver();
            })
            let end = cc.sequence(act_1, act_2)
            this.node.runAction(end);
        }
    }
    //计算block二维角标
    getMarkArr() {
        let pos_block = this.node.getPosition();
        let pos_zxj = this.posLowerLeftQuarter(pos_block)
        let x = Math.floor(pos_zxj.x / 112);//算出木块所在.x
        let y = Math.floor(pos_zxj.y / 112);//算出木块所在.y
        //用于让当块更靠近那个红块时设置到那块并且限制范围
        let pos_1 = cc.v2(x, y)
        let pos_2 = cc.v2(x, y)
        if (this._blockType == "1_2" || this._blockType == "1_3") {
            pos_2.y = pos_1.y + 1;
            if (this._blockType == '1_2') {
                if (pos_1.y > 4) {
                    pos_1.y = 4
                }
                if (pos_2.y > 4) {
                    pos_2.y = 4
                }
            }
            if (this._blockType == '1_3') {
                if (pos_1.y > 3) {
                    pos_1.y = 3
                }
                if (pos_2.y > 3) {
                    pos_2.y = 3
                }
            }
            if (pos_1.y < 0) {
                pos_1.y = 0
            }
            if (pos_2.y < 0) {
                pos_2.y = 0
            }
            let pos_d = this.getBlockPos(pos_1)
            let pos_u = this.getBlockPos(pos_2)
            let cha_1 = Math.abs(pos_d.y - pos_block.y)
            let cha_2 = Math.abs(pos_u.y - pos_block.y)
            if (cha_1 > cha_2) {
                this._markX = pos_2.x
                this._markY = pos_2.y
            } else {
                this._markX = pos_1.x
                this._markY = pos_1.y
            }
        } else if (this._blockType == "2_1" || this._blockType == "3_1") {
            pos_2.x = pos_1.x + 1;
            if (this._blockType == '2_1') {
                if (pos_1.x > 4) {
                    pos_1.x = 4
                }
                if (pos_2.x > 4) {
                    pos_2.x = 4
                }
            }
            if (this._blockType == '3_1') {
                if (pos_1.x > 3) {
                    pos_1.x = 3
                }
                if (pos_2.x > 3) {
                    pos_2.x = 3

                }
            }
            if (pos_1.x < 0) {
                pos_1.x = 0
            }
            if (pos_2.x < 0) {
                pos_2.x = 0
            }
            let pos_l = this.getBlockPos(pos_1)
            let pos_r = this.getBlockPos(pos_2)
            let cha_1 = Math.abs(pos_l.x - pos_block.x)
            let cha_2 = Math.abs(pos_r.x - pos_block.x)
            if (cha_1 > cha_2) {
                this._markX = pos_2.x
                this._markY = pos_2.y
            } else {
                this._markX = pos_1.x
                this._markY = pos_1.y
            }
        }
        console.log("markX=" + this._markX + "=========" + "markY=" + this._markY);
    }
    //获得所选块能移动的最小以及最大距离
    getBlockMoveDistance() {
        let game = cc.find('Canvas').getComponent('game');
        let posMin = cc.v2(this._markX, this._markY);
        let posMax = cc.v2(this._markX, this._markY);
        /*
        判断逻辑====>首先在调用game的getArrTestBlock()方法形成一个6*6的数组 将木块覆盖部分填充为1 其余都为0
        其次通过循环-判断条件为该木块下一个位置存在角标>=0即不能越界并且在6*6数组中为0
        */
        if (this._blockType == "1_2" || this._blockType == "1_3") {
            for (let i = 1; i < 6; i++) {
                if (this._markY - i >= 0 && game.testArrBlock[this._markY - i][this._markX] == 0) {
                    posMin = cc.v2(this._markX, this._markY - i)
                } else {
                    break
                }
            }
            let num: number = 1;
            if (this._blockType == "1_2") {
                num = 1;
            } else {
                num = 2
            }
            for (let i = 1; i < 6; i++) {
                if (this._markY + num + i < 6 && game.testArrBlock[this._markY + num + i][this._markX] == 0) {
                    posMax = cc.v2(this._markX, this._markY + i)
                } else {
                    break
                }
            }
            this._moveMinDis = this.getBlockPos(posMin);
            this._moveMaxDis = this.getBlockPos(posMax);
        } else if (this._blockType == '2_1' || this._blockType == "3_1") {
            for (let i = 1; i < 6; i++) {
                if (this._markX - i >= 0 && game.testArrBlock[this._markY][this._markX - i] == 0) {
                    posMin = cc.v2(this._markX - i, this._markY)
                } else {
                    break
                }
            }
            let num: number = 1;
            if (this._blockType == "2_1") {
                num = 1;
            } else {
                num = 2
            }
            for (let i = 1; i < 6; i++) {
                if (this._markX + num + i < 6 && game.testArrBlock[this._markY][this._markX + num + i] == 0) {
                    posMax = cc.v2(this._markX + i, this._markY)
                } else {
                    break
                }
            }
            this._moveMinDis = this.getBlockPos(posMin);
            this._moveMaxDis = this.getBlockPos(posMax);
        }
    }
    //根据角标设置位置
    setBlockPos() {
        let posinit = cc.v2(this.node.parent.width / 2, this.node.parent.height / 2)
        let pos = cc.v2(this._markX * 112 - posinit.x + 2, this._markY * 112 - posinit.y + 2);
        this.node.setPosition(pos);
        console.log("pos.x" + pos.x, "pos.y" + pos.y)
    }
    //根据角标返回在父节点坐标
    getBlockPos(mark) {
        let posinit = cc.v2(this.node.parent.width / 2, this.node.parent.height / 2)
        let pos = cc.v2(mark.x * 112 - posinit.x + 2, mark.y * 112 - posinit.y + 2);
        return pos
    }
    //触摸移动
    onTouchMove(touchEvent) {
        let delta = touchEvent.getDelta();
        let node = this.node;
        let pos: cc.Vec2
        if (this._Edit) {
            pos = cc.v2(node.x + delta.x, node.y + delta.y)
        } else {
            if (this._blockType == '1_2' || this._blockType == '1_3') {
                if (node.y + delta.y < this._moveMinDis.y - 6) return
                if (node.y + delta.y > this._moveMaxDis.y + 6) return
                pos = cc.v2(node.x, node.y + delta.y)
            } else if (this._blockType == '2_1' || this._blockType == '3_1') {
                if (node.x + delta.x < this._moveMinDis.x) return
                if (this._ishero == 0)//表明为hero块
                {
                    if (this._moveMaxDis.x == this.getBlockPos(cc.v2(4, 4)).x) {
                        pos = cc.v2(node.x + delta.x, node.y)
                        node.setPosition(pos)
                        return
                    }
                }
                if (node.x + delta.x > this._moveMaxDis.x) return
                pos = cc.v2(node.x + delta.x, node.y)

            }
        }
        node.setPosition(pos)
    }
    //以testBlock(0,0)为基准
    posLowerLeftQuarter(posParent) {
        let posBegin = cc.v2(this.node.parent.width / 2 + 2, this.node.parent.height / 2 + 2)
        let posZXJ = cc.v2(posBegin.x + posParent.x, posBegin.y + posParent.y);
        return posZXJ;
    }
    update(dt) { }
}
