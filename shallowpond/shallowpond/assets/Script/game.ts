

const { ccclass, property } = cc._decorator;

@ccclass
export default class game extends cc.Component {
    @property(cc.Node)
    gameBegin: cc.Node = null
    @property(cc.Node)
    gamePlay: cc.Node = null
    @property(cc.Node)
    gameOver: cc.Node = null
    @property(cc.Node)
    NodeBtn: cc.Node = null;
    @property(cc.Prefab)
    pre_block_test: cc.Prefab = null;
    @property(cc.Prefab)
    pre_level: cc.Prefab = null;
    @property(cc.Node)
    blockParent: (cc.Node) = null;
    @property(cc.Prefab)
    pre_block: cc.Prefab = null;
    @property(cc.Label)
    levelsNum: cc.Label = null//关卡数显示
    @property(cc.Label)
    levelsNum_over: cc.Label = null//结束关卡数显示
    @property(cc.Label)
    currentscore: cc.Label = null//当前分数显示
    @property(cc.Node)
    themeSkin: cc.Node = null//皮肤
    @property(cc.Node)
    content: cc.Node = null;//显示内容
    @property(cc.Node)
    levelct: cc.Node = null;//关卡显示内容
    @property(cc.Node)
    edit: cc.Node = null;//编辑
    @property(cc.Node)
    level: cc.Node = null;//关卡
    @property(cc.Node)
    setting: cc.Node = null;//设置
    @property([cc.SpriteAtlas])
    block_At: cc.SpriteAtlas[] = [];
    @property({
        type: cc.AudioClip
    })
    audio_Btn: cc.AudioClip = null
    @property({
        type: [cc.AudioClip]
    })
    audio_bgArr: cc.AudioClip[] = [];
    private levels: number = 1;//关卡数
    private testArrBlock;
    private skinNum: number = 0;//用于设置图集
    private blockPool: cc.NodePool;
    private time: number = 0;//用于记录时间
    private canEffect: boolean = true;//是否播放短音效
    private canMusic: boolean = true//是否播放背景音乐
    private audioBg;
    onLoad() {
        this.initBlockPool();
        this.initGame();
        this.initNodebtnPos();
        // this.addTestBlock(); //用于前期演示作用
        this.readGameData();
        this.getArrTestBlock();
        this.setBlockParent();
        this.replayLevelsNum();
        this.addBtnlevel();

    }
    //根据Num选择关卡
    levelByNum(num) {
        if (num > 10) {
            num = 10;
        }
        this.levels = num;
        this.nextplay();
        this.gameOver.active = false;
        this.gamePlay.active = true;
        this.gameBegin.active = false;
        this.level.active = false;
        this.readGameData();
        this.replayLevelsNum()
    }
    //添加关卡点
    addBtnlevel() {
        let i_level = 1
        let children = this.levelct.children;
        for (let i = 0; i < children.length; i++) {
            for (let j = 0; j < 7; j++) {
                for (let f = 0; f < 4; f++) {
                    let btnLevel = cc.instantiate(this.pre_level)
                    btnLevel.parent = children[i]
                    let pos_begin = cc.v2(-270, children[i].height / 2 - btnLevel.height / 2 - 20)
                    let pos_1 = cc.v2(pos_begin.x + f * 180, pos_begin.y + j * (-140))
                    btnLevel.setPosition(pos_1)
                    let ts_level = btnLevel.getComponent('level')
                    if (ts_level) {
                        ts_level.init(i_level);
                        i_level++;
                    }
                }
            }
        }
    }
    initGame() {
        this.gameBegin.active = true;
        this.gamePlay.active = false;
        this.gameOver.active = false;
        this.themeSkin.active = false;
        this.level.active = false;
        this.setting.active = false;
        if (this.canMusic) {
            this.audioBg = cc.audioEngine.play(this.audio_bgArr[0], true, 1)
        }
    }
    //初始化block对象池
    initBlockPool() {
        this.blockPool = new cc.NodePool();
    }
    //回收对象
    onBlockKill(block) {
        this.blockPool.put(block);
    }
    clickBtn(sender, str) {
        if (this.canEffect) {
            cc.audioEngine.play(this.audio_Btn, false, 1);
        }
        if (str == 'btn_begin') {
            this.gameBegin.active = false;
            this.gamePlay.active = true;
            this.edit.active = false;
            this.time = 0;
            this.schedule(this.gameTiming, 1)
            this.nextplay();
            this.gameOver.active = false;
            this.gamePlay.active = true;
            this.gameBegin.active = false;
            this.readGameData();
        } else if (str == 'btn_setting') {
            this.setting.active = true
        }
        else if (str == 'btnMenu') {
            this.actMenu();
        } else if (str == 'btnMenu_close') {
            this.actClose();
        }
        else if (str == 'btnMenu_begin') {
            this.gameBegin.active = true;
            this.gamePlay.active = false;
        }
        else if (str == 'btnMenu_skin') {
            // this.node.getChildByName('common').getComponent('common').changeBg()
            this.themeSkin.active = true;
            this.gamePlay.active = false;
        } else if (str == 'btnMenu_level') {//关卡按钮
            this.level.active = true;
            this.gameBegin.active = false;
            this.gamePlay.active = false;
            this.gameOver.active = false;
            this.themeSkin.active = false;

        } else if (str == 'btnMenu_level_over') {//结束界面关卡按钮
            this.level.active = true;
            this.gameBegin.active = false;
            this.gamePlay.active = false;
            this.gameOver.active = false;
            this.themeSkin.active = false;
        } else if (str == 'btnMenu_setting') {
            this.setting.active = true;
        }
        else if (str == 'btn_replay')//刷新
        {
            this.replayLevels(false);
        } else if (str == 'btn_replay_over')//结束界面的刷新
        {
            this.replayLevels(true);
            this.gameOver.active = false;
            this.gamePlay.active = true;
            this.gameBegin.active = false
        } else if (str == 'btn_nextplay') {
            this.nextplay();
            this.gameOver.active = false;
            this.gamePlay.active = true;
            this.gameBegin.active = false;
            this.readGameData();

        } else if (str == 'btn_hint')//提示
        {
            let gameData = this.node.getComponent('gameData')
            let i_num = 0
            let posinit = cc.v2(this.blockParent.width / 2, this.blockParent.height / 2)
            let children = this.blockParent.children
            for (let i = 0; i < children.length; i++) {
                let ts_block = children[i].getComponent('block')
                if (ts_block) {
                    let posBlock_arr = gameData.arr_blockPos_TiShi[this.levels - 1][i_num]
                    i_num++
                    let posParent = cc.v2(posBlock_arr.x * 112 - posinit.x + 2, posBlock_arr.y * 112 - posinit.y + 2)
                    children[i].setPosition(posParent)
                    ts_block.replayMark()
                }
            }
            this.getArrTestBlock();
        } else if (str == 'toggle1')//背景皮肤
        {
            this.content.getChildByName('skinBtn').active = true;
            this.content.getChildByName('skinFish').active = false;
        } else if (str == 'toggle2')//鱼皮肤
        {
            this.content.getChildByName('skinFish').active = true;
            this.content.getChildByName('skinBtn').active = false;
        } else if (str == 'btnlevel_begin') {
            this.level.active = false
            this.gameBegin.active = true;
            this.gamePlay.active = false;
            this.gameOver.active = false;
            this.themeSkin.active = false;
        } else if (str == 'btnlevel_setting') {
            this.setting.active = true
        } else if (str == 'btnClose_setting') {
            this.setting.active = false;
        } else if (str == 'btnMusicOff_setting') {
            this.canMusic = false;
            cc.audioEngine.pause(this.audioBg)
            this.setting.getChildByName('bg').getChildByName('btnMusicOff_setting').active = false
            this.setting.getChildByName('bg').getChildByName('btnMusicOn_setting').active = true
        }
        else if (str == 'btnMusicOn_setting') {
            this.canMusic = true;
            cc.audioEngine.resume(this.audioBg)
            this.setting.getChildByName('bg').getChildByName('btnMusicOff_setting').active = true
            this.setting.getChildByName('bg').getChildByName('btnMusicOn_setting').active = false
        }
        else if (str == 'btnEffectOff_setting') {
            this.canEffect = false;
            this.setting.getChildByName('bg').getChildByName('btnEffectOff_setting').active = false
            this.setting.getChildByName('bg').getChildByName('btnEffectOn_setting').active = true
        }
        else if (str == 'btnEffectOn_setting') {
            this.canEffect = true;
            this.setting.getChildByName('bg').getChildByName('btnEffectOff_setting').active = true
            this.setting.getChildByName('bg').getChildByName('btnEffectOn_setting').active = false

        }
    }
    //下一关
    nextplay() {
        let children = this.blockParent.children
        for (let i = children.length - 1; i >= 0; i--) {
            let ts_block = children[i].getComponent('block')
            if (ts_block) {
                this.onBlockKill(children[i])
            }
        }
    }
    //刷新关卡数显示
    replayLevelsNum() {
        this.levelsNum.string = this.levels.toString()
        this.levelsNum_over.string = (this.levels - 1).toString()
    }
    //刷新关卡
    replayLevels(isover) {
        let children = this.blockParent.children
        let posinit = cc.v2(this.blockParent.width / 2, this.blockParent.height / 2)
        let gameData = this.node.getComponent('gameData')
        let i_num = 0
        if (isover) {
            this.levels--;
            this.replayLevelsNum();
        }
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent('block')
            if (ts_block) {
                let posBlock_arr = gameData.arr_Mark[this.levels - 1][i_num]
                i_num++
                let posParent = cc.v2(posBlock_arr.x * 112 - posinit.x + 2, posBlock_arr.y * 112 - posinit.y + 2)
                children[i].setPosition(posParent)
                ts_block.replayMark()
            }
        }
        this.getArrTestBlock();
    }
    //初始化数组存放测试block均为0
    initArrTestBlock() {
        this.testArrBlock = []
        for (let i = 0; i < 6; i++) {
            this.testArrBlock[i] = [];
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                this.testArrBlock[i][j] = 0;
            }
        }
    }
    //给红块设置0 用于判断上方是否有木块<========用于判断木块是否可以滑动的依据
    getArrTestBlock() {
        this.initArrTestBlock();
        let children = this.blockParent.children
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent('block')
            if (ts_block) {
                this.testArrBlock[ts_block._markY][ts_block._markX] = 1;
                if (ts_block._blockType == "1_2") {
                    this.testArrBlock[ts_block._markY + 1][ts_block._markX] = 1;
                } else if (ts_block._blockType == "1_3") {
                    this.testArrBlock[ts_block._markY + 1][ts_block._markX] = 1;
                    this.testArrBlock[ts_block._markY + 2][ts_block._markX] = 1;
                } else if (ts_block._blockType == "2_1") {
                    this.testArrBlock[ts_block._markY][ts_block._markX + 1] = 1;
                } else if (ts_block._blockType == "3_1") {
                    this.testArrBlock[ts_block._markY][ts_block._markX + 1] = 1;
                    this.testArrBlock[ts_block._markY][ts_block._markX + 2] = 1;
                }
            }
        }
        console.log(this.testArrBlock);
    }

    //增加测试block用于后续判断
    addTestBlock() {
        let space: number = 2;//间隔
        let initPos = cc.v2(-this.blockParent.width / 2 + 55, -this.blockParent.height / 2 + 55)
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                let testBlock = cc.instantiate(this.pre_block_test);
                testBlock.parent = this.blockParent;
                testBlock.getChildByName('num').getComponent(cc.Label).string = '(' + j + ',' + i + ')'
                testBlock.setPosition(cc.v2(initPos.x + 110 * j + space * j + space, initPos.y + 110 * i + space * i + space))
            }
        }
    }
    //根据gameData配置的数据设置块
    readGameData() {
        let gameData = this.node.getComponent('gameData')
        for (let i = 0; i < gameData.arr_blockType[this.levels - 1].length; i++) {
            this.addBlock(gameData.arr_blockType[this.levels - 1][i], gameData.arr_Mark[this.levels - 1][i], i)
        }
    }
    //添加block
    addBlock(str: string, mark: cc.Vec2, ishero: number) {
        let space: number = 2;
        let block;
        if (this.blockPool.size() > 0) {
            block = this.blockPool.get();
        } else {
            block = cc.instantiate(this.pre_block)
        }
        let posinit = cc.v2(this.blockParent.width / 2, this.blockParent.height / 2)//以红块(0,0)为基准，因此需减去相应位置
        block.parent = this.blockParent
        block.setPosition(mark.x * 112 - posinit.x + space, mark.y * 112 - posinit.y + space)
        let ts_block = block.getComponent('block')
        ts_block.init(str, mark, ishero);//添加类型
        if (str == '1_2') {
            block.width = 108;
            block.height = 220;
            block.getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('1x2_nor')
            block.getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('1x2_click')
        } else if (str == "1_3") {
            block.width = 108;
            block.height = 332;
            block.getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('1x3_nor')
            block.getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('1x3_click')
        }
        else if (str == "2_1") {
            block.width = 220;
            block.height = 108
            if (ishero == 0)//第一位为hero
            {
                this.changeHeroSkin(block, 1)
                return
            }
            block.getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('2x1_nor')
            block.getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('2x1_click')
        }
        else if (str == "3_1") {
            block.width = 332;
            block.height = 108;
            block.getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('3x1_nor')
            block.getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[this.skinNum].getSpriteFrame('3x1_click')
        }
    }
    //修改木块皮肤
    changeBlockSkin(skinNum) {
        let children = this.blockParent.children;
        for (let i = 0; i < children.length; i++) {
            let ts_block = children[i].getComponent('block')
            if (ts_block) {
                if (ts_block._blockType == '1_2') {
                    children[i].getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('1x2_nor')
                    children[i].getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('1x2_click')
                } if (ts_block._blockType == '1_3') {
                    children[i].getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('1x3_nor')
                    children[i].getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('1x3_click')
                } if (ts_block._blockType == '2_1') {
                    if (ts_block._ishero == 0) {
                        this.changeHeroSkin(children[i], 1)
                    }
                    children[i].getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('2x1_nor')
                    children[i].getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('2x1_click')
                }
                if (ts_block._blockType == '3_1') {
                    children[i].getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('3x1_nor')
                    children[i].getChildByName('click').getComponent(cc.Sprite).spriteFrame = this.block_At[skinNum].getSpriteFrame('3x1_click')
                }
            }
        }
    }
    clickSkin(sender, str) {
        if (str == '101' || str == '102' || str == '103' || str == '104' || str == '105' || str == '106' || str == '107' || str == '108' || str == '109' || str == '110') {
            let i_skin = parseInt(str) - 101;
            this.node.getChildByName('common').getComponent('common').changeBgByNum(i_skin);
            this.themeSkin.active = false;
            this.gamePlay.active = true;
        } else if (str == '201' || str == '202' || str == '203' || str == '204' || str == '205' || str == '206' || str == '207' || str == '208' || str == '209' || str == '210') {
            let i_skin = parseInt(str) - 200;
            let children = this.blockParent.children;
            for (let i = 0; i < children.length; i++) {
                let ts_block = children[i].getComponent('block')
                if (ts_block) {
                    if (ts_block._blockType == '2_1' && ts_block._ishero == 0) {
                        this.changeHeroSkin(children[i], i_skin)   
                    }
                }
            }
            this.themeSkin.active = false;
            this.gamePlay.active = true;
        }
    }
    //修改hero木块皮肤
    changeHeroSkin(block: cc.Node, num) {
        let skinNum = num
        cc.loader.loadRes("hero/T" + skinNum, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            block.getComponent(cc.Sprite).spriteFrame = sp;
        });
        console.log(skinNum + "皮肤")
    }
    //游戏结束
    playGameOver() {
        this.levels += 1;
        this.gameBegin.active = false;
        this.gamePlay.active = false;
        this.gameOver.active = true;
        this.replayLevelsNum();
        this.unschedule(this.gameTiming)
        this.currentscore.string = "当前分数" + this.formatMilliseconds(this.time)
    }
    //游戏用时记录
    gameTiming() {
        this.time += 1;
    }
    //时间转换HH-mm-ss
    formatMilliseconds(value) {
        let second = value      // second
        let minute = 0;        // minute
        if (second > 60) {
            minute = second / 60
            second = second % 60
        }
        let result;
        if (second > 60) {
            result = minute + ":" + second
        } else if (second < 10) {
            result = 0 + ":" + "0" + second
        } else if (second > 10 && second < 60) {
            result = 0 + ":" + second
        }
        return result;
    }
    //设置父节点的宽高以及边框
    setBlockParent() {
        this.blockParent.width = 674;//6block+7space
        this.blockParent.height = 674;
        this.blockParent.scale = 0.97
        let num: number = 8
        let frame_up = this.blockParent.getChildByName('frame_up');//上边框
        frame_up.y = this.blockParent.height / 2 + 4
        frame_up.width = this.blockParent.width + num;
        let frame_down = this.blockParent.getChildByName('frame_down');//下边框
        frame_down.y = -this.blockParent.height / 2 - num / 2
        frame_down.width = this.blockParent.width + num;
        let frame_left = this.blockParent.getChildByName('frame_left');//左边框
        frame_left.x = -this.blockParent.width / 2 - num / 2
        frame_left.height = this.blockParent.height + num;
        let frame_right_up = this.blockParent.getChildByName('frame_right_up');//右边框上
        frame_right_up.x = this.blockParent.width / 2 + num / 2
        frame_right_up.y = this.blockParent.height / 2 + num / 2
        frame_right_up.height = 224//2block2space
        let frame_right_down = this.blockParent.getChildByName('frame_right_down');//右边框下
        frame_right_down.x = this.blockParent.width / 2 + num / 2
        frame_right_down.y = -this.blockParent.height / 2 - num / 2
        frame_right_down.height = 336//3block3space
        let frame_right_up_up = this.blockParent.getChildByName('frame_right_up_up');//右边框上-上
        frame_right_up_up.x = frame_right_up.x
        frame_right_up_up.y = frame_right_up.y - frame_right_up.height
        frame_right_up_up.width = 224//2block2space
        let frame_right_down_down = this.blockParent.getChildByName('frame_right_down_down');//右边框下-下
        frame_right_down_down.x = frame_right_down.x
        frame_right_down_down.y = frame_right_down.y + frame_right_down.height
        frame_right_down_down.width = 224//3block3space
        /*-----------------------------------------------------------------------------------------------------以下为外框*/
        let num2: number = 20
        let frame_up1 = this.blockParent.getChildByName('frame_up1');//上边框
        frame_up1.y = this.blockParent.height / 2 + num2
        frame_up1.width = this.blockParent.width + num2 * 2;
        let frame_down1 = this.blockParent.getChildByName('frame_down1');//下边框
        frame_down1.y = -this.blockParent.height / 2 - num2
        frame_down1.width = this.blockParent.width + num2 * 2;
        let frame_left1 = this.blockParent.getChildByName('frame_left1');//左边框
        frame_left1.x = -this.blockParent.width / 2 - num2
        frame_left1.height = this.blockParent.height + num2 * 2;
        let frame_right_up1 = this.blockParent.getChildByName('frame_right_up1');//右边框上
        frame_right_up1.x = this.blockParent.width / 2 + num2
        frame_right_up1.y = this.blockParent.height / 2 + num2
        frame_right_up1.height = 226//2block2space
        let frame_right_down1 = this.blockParent.getChildByName('frame_right_down1');//右边框下
        frame_right_down1.x = this.blockParent.width / 2 + num2
        frame_right_down1.y = -this.blockParent.height / 2 - num2
        frame_right_down1.height = 338//3block3space
        let frame_right_up_up1 = this.blockParent.getChildByName('frame_right_up_up1');//右边框上-上
        frame_right_up_up1.x = frame_right_up1.x
        frame_right_up_up1.y = frame_right_up1.y - frame_right_up1.height
        frame_right_up_up1.width = 224//2block2space
        let frame_right_down_down1 = this.blockParent.getChildByName('frame_right_down_down1');//右边框下-下
        frame_right_down_down1.x = frame_right_down1.x
        frame_right_down_down1.y = frame_right_down1.y + frame_right_down1.height
        frame_right_down_down1.width = 224//3block3space
    }
    //设置菜单按钮相关动作
    actMenu() {
        let pos_Menu = this.NodeBtn.getChildByName('btnMenu').getPosition();
        let btn_interval = Math.abs(pos_Menu.x / 2);//相邻按钮的间隔
        this.NodeBtn.getChildByName('btnMenu').active = false;
        this.NodeBtn.getChildByName('btn_hint').active = false;
        this.NodeBtn.getChildByName('btn_replay').active = false;
        this.NodeBtn.getChildByName('btnMenu_begin').active = true;
        this.NodeBtn.getChildByName('btnMenu_level').active = true;
        this.NodeBtn.getChildByName('btnMenu_setting').active = true
        this.NodeBtn.getChildByName('btnMenu_skin').active = true;
        this.NodeBtn.getChildByName('btnMenu_close').active = true
        this.NodeBtn.getChildByName('btnMenu_begin').runAction(cc.moveTo(0.1, cc.v2(pos_Menu.x + btn_interval, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_level').runAction(cc.moveTo(0.2, cc.v2(pos_Menu.x + btn_interval * 2, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_skin').runAction(cc.moveTo(0.3, cc.v2(pos_Menu.x + btn_interval * 3, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_setting').runAction(cc.moveTo(0.4, cc.v2(pos_Menu.x + btn_interval * 4, pos_Menu.y)))
    }
    //菜单关闭
    actClose() {
        this.initNodebtnPos();
        let pos_Menu = this.NodeBtn.getChildByName('btnMenu').getPosition();
        let btn_interval = Math.abs(pos_Menu.x / 2);//相邻按钮的间隔
        this.NodeBtn.getChildByName('btnMenu_begin').runAction(cc.moveBy(0.1, cc.v2(-btn_interval, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_level').runAction(cc.moveBy(0.2, cc.v2(- btn_interval * 2, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_skin').runAction(cc.moveBy(0.3, cc.v2(-btn_interval * 3, pos_Menu.y)))
        this.NodeBtn.getChildByName('btnMenu_setting').runAction(cc.moveBy(0.4, cc.v2(- btn_interval * 4, pos_Menu.y)))

    }
    //设置Nodebtn下所有的位置
    initNodebtnPos() {
        let pos_Menu = this.NodeBtn.getChildByName('btnMenu').getPosition();
        this.NodeBtn.getChildByName('btnMenu').active = true;
        this.NodeBtn.getChildByName('btn_hint').active = true;
        this.NodeBtn.getChildByName('btn_replay').active = true;
        this.NodeBtn.getChildByName('btnMenu_begin').setPosition(pos_Menu);
        this.NodeBtn.getChildByName('btnMenu_begin').active = false;
        this.NodeBtn.getChildByName('btnMenu_level').setPosition(pos_Menu);
        this.NodeBtn.getChildByName('btnMenu_level').active = false;
        this.NodeBtn.getChildByName('btnMenu_skin').setPosition(pos_Menu);
        this.NodeBtn.getChildByName('btnMenu_skin').active = false;
        this.NodeBtn.getChildByName('btnMenu_setting').setPosition(pos_Menu);
        this.NodeBtn.getChildByName('btnMenu_setting').active = false
        this.NodeBtn.getChildByName('btnMenu_close').setPosition(pos_Menu);
        this.NodeBtn.getChildByName('btnMenu_close').active = false
    }
}
