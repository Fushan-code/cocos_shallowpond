const { ccclass, property } = cc._decorator;

@ccclass
export default class gameData extends cc.Component { //该类用于配置关卡的木块位置
    private arr_blockType = [];
    private arr_Mark = [];
    private arr_blockPos_TiShi = [];
    onLoad(){
        this.initlevels();
    
    }
    //初始化关卡
    initlevels() {
        //类型
        this.arr_blockType = [
            ["2_1", "1_2", "1_3", "1_3", "2_1", "3_1", "3_1"],
            ["2_1", "1_2", "1_2", "1_2", "1_3", "2_1", "3_1"],
            ["2_1", "1_2", "1_2", "1_3", "1_3", "2_1"],
            ["2_1", "1_2", "1_2", "1_3", "2_1", "3_1"],
            ["2_1", "1_2", "1_2", "1_3", "2_1", "2_1", "3_1"],
            ["2_1", "1_2", "1_3", "2_1", "3_1"],
            ["2_1", "1_2", "1_2", "2_1", "2_1", "2_1", "2_1", "3_1"],
            ["2_1", "1_2", "1_3", "1_3", "2_1", "2_1"],
            ["2_1", "1_2", "1_2", "1_3", "1_3", "2_1", "2_1", "3_1"],
            ["2_1", "1_2", "1_3", "1_3", "1_3", "2_1", "2_1", "2_1", "2_1", "3_1", "3_1", "3_1"]
        ]
        //角标
        this.arr_Mark = [
            [cc.v2(0,3),cc.v2(1,1),cc.v2(3,1),cc.v2(5,2),cc.v2(3,4),cc.v2(2,0),cc.v2(1,5)],
            [cc.v2(1,3),cc.v2(4,1),cc.v2(1,1),cc.v2(0,2),cc.v2(3,2),cc.v2(4,4),cc.v2(2,5)],
            [cc.v2(0,3),cc.v2(3,3),cc.v2(5,4),cc.v2(5,1),cc.v2(2,2),cc.v2(2,1)],
            [cc.v2(0,3),cc.v2(4,0),cc.v2(5,3),cc.v2(3,1),cc.v2(1,1),cc.v2(0,5)],
            [cc.v2(0,3),cc.v2(3,4),cc.v2(1,1),cc.v2(5,1),cc.v2(3,1),cc.v2(0,5),cc.v2(3,0)],
            [cc.v2(0,3),cc.v2(2,2),cc.v2(4,2),cc.v2(4,1),cc.v2(0,4)],
            [cc.v2(0,3),cc.v2(3,3),cc.v2(5,3),cc.v2(0,0),cc.v2(0,1),cc.v2(3,5),cc.v2(0,5),cc.v2(3,2)],
            [cc.v2(1,3),cc.v2(0,3),cc.v2(2,0),cc.v2(4,3),cc.v2(4,2),cc.v2(0,0)],
            [cc.v2(0,3),cc.v2(1,0),cc.v2(2,4),cc.v2(5,0),cc.v2(4,2),cc.v2(2,2),cc.v2(0,4),cc.v2(2,0)],
            [cc.v2(2,3),cc.v2(4,3),cc.v2(2,0),cc.v2(1,1),cc.v2(0,3),cc.v2(3,0),cc.v2(0,0),cc.v2(3,5),cc.v2(1,5),cc.v2(3,1),cc.v2(3,2),cc.v2(1,4)]
        ]
        //提示
        this.arr_blockPos_TiShi = [
            [cc.v2(0,3),cc.v2(1,1),cc.v2(3,0),cc.v2(5,0),cc.v2(3,4),cc.v2(0,0),cc.v2(1,5)],
            [cc.v2(1,3),cc.v2(4,1),cc.v2(1,1),cc.v2(0,2),cc.v2(3,0),cc.v2(4,4),cc.v2(2,5)],
            [cc.v2(0,3),cc.v2(3,0),cc.v2(5,4),cc.v2(5,0),cc.v2(2,0),cc.v2(0,1)],
            [cc.v2(0,3),cc.v2(4,0),cc.v2(5,4),cc.v2(3,0),cc.v2(1,1),cc.v2(0,5)],
            [cc.v2(0,3),cc.v2(3,4),cc.v2(1,1),cc.v2(5,0),cc.v2(3,1),cc.v2(0,5),cc.v2(1,0)],
            [cc.v2(0,3),cc.v2(2,0),cc.v2(4,0),cc.v2(0,1),cc.v2(0,4)],
            [cc.v2(0,3),cc.v2(3,0),cc.v2(5,0),cc.v2(0,0),cc.v2(0,1),cc.v2(3,5),cc.v2(0,5),cc.v2(0,2)],
            [cc.v2(0,3),cc.v2(0,4),cc.v2(2,0),cc.v2(4,0),cc.v2(0,2),cc.v2(0,0)],
            [cc.v2(2,3),cc.v2(1,2),cc.v2(2,4),cc.v2(5,0),cc.v2(4,0),cc.v2(2,2),cc.v2(0,4),cc.v2(0,0)],
            [cc.v2(2,3),cc.v2(4,4),cc.v2(2,0),cc.v2(1,1),cc.v2(0,1),cc.v2(3,0),cc.v2(0,0),cc.v2(2,5),cc.v2(0,5),cc.v2(3,1),cc.v2(3,2),cc.v2(1,4)]
        ]
    }
}
