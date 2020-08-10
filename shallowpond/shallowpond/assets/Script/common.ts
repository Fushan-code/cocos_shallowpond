const { ccclass, property } = cc._decorator;

@ccclass
export default class game extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property([cc.Node])
    peripheryArr: cc.Node[] = [];
    @property(cc.Node)
    waterripple: cc.Node = null;//水波纹
    @property(cc.Node)
    fish: cc.Node = null;//鱼
    @property({
        type:cc.AudioClip
    })
    audio_water:cc.AudioClip=null
    @property([cc.ParticleSystem])
    particleArr:cc.ParticleSystem[]=[];
    private fishBegin: cc.Vec2 = cc.v2(0, 0);//鱼一开始的位置
    private fishEnd: cc.Vec2;//鱼最后的位置
    onLoad() {
        this.playWaterRipple();
        this.playFish();
        this.initGame(); 
    }
    initGame() {
        this.schedule(this.playWaterRipple, 5);
        this.schedule(this.playFish, 8);       
        this.particleAllHide();
       
    }
    //随机更换背景
    changeBg() {
        let bgNum = Math.floor(Math.random() * 10)
        console.log("背景号码==========>"+bgNum)
        this.node.parent.getComponent('game').changeBlockSkin(bgNum)
        cc.loader.loadRes("bg/bg_" + bgNum, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.bg.getComponent(cc.Sprite).spriteFrame = sp;
        });
        this.particleShow(bgNum);
        for (let i = 0; i < this.peripheryArr.length; i++) {
            cc.loader.loadRes("periphery/bg" + bgNum + "/bg_" + bgNum + "_" + i, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("bgNum" + bgNum)
                if (bgNum > 1&&bgNum!=8) {
                    this.peripheryArr[2].y = -560;
                } else if (bgNum == 0 || bgNum == 1) {
                    this.peripheryArr[2].y = -590;
                }else if(bgNum==8)
                {
                    this.peripheryArr[0].x=-223;
                    this.peripheryArr[0].y=433;
                    this.peripheryArr[1].x=214.35;
                    this.peripheryArr[1].y=439;
                }
                this.peripheryArr[i].getComponent(cc.Sprite).spriteFrame = sp;
            });
        }
    }
    changeBgByNum(num) {
        let bgNum =num; 
        this.node.parent.getComponent('game').changeBlockSkin(bgNum)
        cc.loader.loadRes("bg/bg_" + bgNum, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.bg.getComponent(cc.Sprite).spriteFrame = sp;
        });
        this.particleShow(bgNum);
        for (let i = 0; i < this.peripheryArr.length; i++) {
            cc.loader.loadRes("periphery/bg" + bgNum + "/bg_" + bgNum + "_" + i, cc.SpriteFrame, (err, sp: cc.SpriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("bgNum" + bgNum)
                if (bgNum > 1&&bgNum!=8) {
                    this.peripheryArr[2].y = -560;
                } else if (bgNum == 0 || bgNum == 1) {
                    this.peripheryArr[2].y = -590;
                }else if(bgNum==8)
                {
                    this.peripheryArr[0].x=-223;
                    this.peripheryArr[0].y=433;
                    this.peripheryArr[1].x=214.35;
                    this.peripheryArr[1].y=439;
                }
                this.peripheryArr[i].getComponent(cc.Sprite).spriteFrame = sp;
            });
        }
    }
    //显示粒子
    particleShow(bgNum){
        this.particleAllHide();
       if(bgNum==0)
       {
           return
       }else
       {
        this.particleArr[bgNum].node.active=true;
       }
    }
    //隐藏粒子特效
    particleAllHide(){
        for(let i=0;i<this.particleArr.length;i++)
        {
            this.particleArr[i].node.active=false;
        }
    }
    //鱼游动
    playFish() {
        this.fish.stopAllActions();
        let childern = this.fish.children;
        for (let i = 0; i < childern.length; i++) {
            childern[i].active = false;
        }
        childern[Math.floor(Math.random() * 3)].active = true;//鱼的随机颜色
        //鱼的随机动作
        let act_arr = [];//动作数组
        let act_time: number = 0;//动作时间
        let act_num = Math.floor(Math.random() * 4);
        if (act_num == 0) {
            act_time = 5
            act_arr = [cc.v2(420, 568), cc.v2(-70, 375), cc.v2(-460, 650)];
        } else if (act_num == 1) {
            act_time = 7
            act_arr = [cc.v2(-300, 650), cc.v2(166, 46), cc.v2(-180, -828)];
        } else if (act_num == 2) {
            act_time = 3.5
            act_arr = [cc.v2(450, 40), cc.v2(-450, -200)]
        } else if (act_num == 3) {
            act_time = 8
            act_arr = [cc.v2(-500, -227), cc.v2(100, -760), cc.v2(300, 700)]
        }
        let act_1 = cc.cardinalSplineTo(act_time, act_arr, 0);//参数(时间,点,(1代表直线,>1或者<1都是曲线))
        this.fish.runAction(act_1);

    }
    //设置鱼儿的旋转角度与移动方向相等
    fishPos() {
        this.fishEnd = this.fish.getPosition();
        if(this.fishBegin.x!=this.fishEnd.x&&this.fishBegin.y!=this.fishEnd.y){
        let angleFish = this.getAngle(this.fishBegin, this.fishEnd)
        this.fish.angle = -angleFish;
        }
        this.fishBegin = this.fishEnd;
    }
    //通过俩点 算出角度 
    getAngle(start, end) {
        let x = end.x - start.x
        let y = end.y - start.y
        let hypotenuse = Math.sqrt(x * x + y * y)
        let cos = x / hypotenuse
        let radian = Math.acos(cos)
        //求出弧度
        var angle = 180 / (Math.PI / radian)
        //用弧度算出角度
        if (y < 0) {
            angle = 0 - angle
        } else if (y == 0 && x < 0) {
            angle = 180
        }
        return 90 - angle
    }

    //播放水波纹
    playWaterRipple() {
        let pos_x = Math.random() * 720 - 360;
        let pos_y = Math.random() * 1280 - 640;
        this.waterripple.setPosition(cc.v2(pos_x, pos_y));
        this.waterripple.getComponent(cc.Animation).play('waterripple');
        let game=this.node.parent.getComponent('game');
        if(game.canEffect){
         cc.audioEngine.play(this.audio_water,false,1);   
        }
        
    }
    //点击事件
    clickBtn(sender, str) {
        if (str == "btn_begin") {
            cc.log("点击")

        }
        if (str == "btn_skin") {
            this.changeBg();
        }
    }
    update() {
        this.fishPos();
    }
}
