

const { ccclass, property } = cc._decorator;

@ccclass
export default class level extends cc.Component {

    @property(cc.Label)
    levelNum: cc.Label = null;
    private i_Num:number=null
    onLoad() {

    }
    init(num) {
    this.levelNum.string=num;
    this.i_Num=num;
    }
    clickBtn(){
       cc.log("选中的是第"+this.i_Num+"关") 
       cc.find('Canvas').getComponent('game'). levelByNum(this.i_Num);
    }
}
