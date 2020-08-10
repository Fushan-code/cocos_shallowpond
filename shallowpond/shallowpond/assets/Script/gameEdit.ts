const { ccclass, property } = cc._decorator;
@ccclass
export default class gameEdit extends cc.Component {
    @property(cc.Node)
    blockParent: cc.Node = null;
    @property(cc.Prefab)
    pre_block: cc.Prefab = null;
    @property([cc.SpriteFrame])
    block_sp:cc.SpriteFrame[]=[];
 
    onLoad() { 
    }

    start() {
    }
    btnClick(sender, str) {
        if (str == '1_2' || str == '1_3' || str == '2_1' || str == '3_1') {
            this.addBlock(str);
        }else if(str=='log_Arr')
        {
          this.logArr();
        }else if(str=='clearBlock')
        {
            this.clearBlock();
        }
    }
    //清除block
    clearBlock(){
        let children=this.blockParent.children;
        for(let i=children.length-1;i>0;i--)
        {
            let ts_block=children[i].getComponent('block')
            if(ts_block)
            {
              children[i].removeFromParent()
            }
        }
    } 
    //根据str调整block(为空节点)的长宽
    addBlock(str) {
        let block = cc.instantiate(this.pre_block)
        block.parent = this.blockParent
        let ts_block=block.getComponent('block')
        ts_block.initEdit(str);//添加类型
        if (str == '1_2') {
            block.width = 108;
            block.height = 220;
            block.getComponent(cc.Sprite).spriteFrame=this.block_sp[0];
        } else if (str == "1_3") {
            block.width = 108;
            block.height = 332;
            block.getComponent(cc.Sprite).spriteFrame=this.block_sp[1];
        }
        else if (str == "2_1") {
            block.width = 220;
            block.height = 108
            block.getComponent(cc.Sprite).spriteFrame=this.block_sp[2];
        }
        else if (str == "3_1") {
            block.width = 332;
            block.height = 108;
            block.getComponent(cc.Sprite).spriteFrame=this.block_sp[3];
        }

    }
    //打印出相应块的位置(输出块类型以及角标xy)
    logArr(){
     let arr_blockType=[];
     let arr_Mark=[];
     let children=this.blockParent.children;
     for(let i=0;i<children.length;i++)
     {
         let ts_block=children[i].getComponent('block')
         if(ts_block)
         {
            arr_blockType.push('"'+ts_block._blockType+'"')
            arr_Mark.push('cc.v2('+ts_block._markX+','+ts_block._markY+')')
         }
     }
     console.log("类型=>"+arr_blockType+"================"+arr_Mark.toString())
    }
    update(dt) { }
}
