<template>
    <div class="row" @click="boxClick"> 
        <div class="col-md-12" >
           <div @click="orgClick" ref="org">             
                    <b-form-input v-model="params.orgName" :readonly="isreadonly" :disabled="true"/>
                </div>
                <div class="text-left  self_constrol zwlTree" v-show="orgShow">
                    <el-tree :data="orgTreeData" :props="orgOptions" :load="orgLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="orgItemClick">
                    </el-tree>
                </div>
        </div>
    </div>
</template>
<script>

import config from 'common/config'
import api from 'common/api'
import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

export default {
	props:{
        params: {
            type: Object,
            default: function() {
                return { orgName: ''};
            }
        },  
        disabled:{
            type: Boolean,
            default: function() {
                return false;
            }
        },
        isreadonly:{
            type: Boolean,
            default: function() {
                return false;
            }
        },
    },
    data() {
        return {
//          params: {
//              orgName: '',              
//          },          
            // org
            orgTreeData: [],
            orgOptions: {
                children: 'children',
                label: 'catlogName'
            },
            orgShow: false,           
        }
    },
    computed: {
        
    },
    methods: {
        // 组织
        orgLoad(node, resolve) {
              if (node.level === 0) {
                let params = { catlogCode: config.catalog.rootCode };
                api.skuComb.getSkuCatLogInfoByCatlogCode(params,(res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                id: 0,   // 默认展示一级节点
                                catlogName: obj.catlogName,
                                catlogCode: obj.catlogCode
                            }];
                            return resolve(arr);
                        }
                    }
                })
            } else {
                let params = { catlogCode: node.data.catlogCode };
                api.skuComb.getSkuCatLogInfoByCatlogCode(params,(res)=> {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.skuCatLogSubInfo;
                        let arr = [];
                        if (items !== null) {
                            items.forEach((item, index) => {
                                let data = {
                                    catlogName: item.catlogName,
                                    catlogCode: item.catlogCode
                                }
                                arr.push(data)
                            })
                        } else {
                            return resolve([])
                        }
                        return resolve(arr)
                    }
                })
            }
        },
        orgItemClick(data) {
            this.params.orgName = data.catlogName;
            this.$emit('getSaleLog', data);
            this.orgShow = false;
        },
        orgClick() {
           if(this.isreadonly == true){
        		 this.orgShow = false
        	}else{
        		this.orgShow = !this.orgShow;
        	}
        },
        boxClick() {
            try{
                this.$refs.org.firstChild.id = ''                           
            }catch (e) {
                return
            }
        },
    },
    watch: {       
        orgShow(val) {
            document.addEventListener('click', (e) => {
                let _oTree = this.$refs.org;
                if(_oTree && !_oTree.contains(e.target))  this.orgShow = false
            })
        },      
    }
}
</script>
<style lang="css" >
.select-tree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
}
.zwlTree{
	position: absolute;
    width: 280px;
    z-index: 99999;
}
/*.self_constrol>.el-tree {
    max-height: 300px;
    overflow-y: scroll;
}*/
</style>
