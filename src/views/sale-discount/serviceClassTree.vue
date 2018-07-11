<template>
    <div class="row" @click="boxClick"> 
        <div class="col-md-12" @click="orgClick" >
                <div ref="org">             
                    <b-form-input v-model="dataName" :readonly="isreadonly" :disabled="true" :state="checkgroy"  />
                </div>
                <div class="text-left salce-discount-skutree" v-show="orgShow">
                    <el-tree  show-checkbox :data="orgTreeData" :props="orgOptions" :load="goryLoad" node-key="categoryCode" lazy accordion check-strictly :default-expanded-keys="['000001']" :expand-on-click-node="false" ref="serivceClassTree">
                    </el-tree>
                </div>
                <div class="salce-dis-tree-footer" v-show="orgShow">
                    <b-button size="sm" variant="primary" class="mr-3 mt-1" @click="sureData">确定</b-button>
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
        checkgroy:{
        	type:String,
        	default:function(){
        		return null
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
                label: 'categoryName'
            },
            orgShow: false,  
            dataName: '',         
        }
    },
    computed: {
        
    },
    methods: {
        // 服务分类
        goryLoad(node, resolve) {
                 if (node.level === 0) {
                let params = { categoryCode: config.classification.rootCode };
                api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                // id: 0,   // 默认展示一级节点
                                categoryName: obj.categoryName,
                                categoryCode: obj.categoryCode,
                            }];
                            return resolve(arr);
                        }
                    }
                })
            } else {
                let params = { categoryCode: node.data.categoryCode };
                 api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.serviceCategorySubInfo;
                        let arr = [];
                        if (items !== null && items!='undefined') {
                            items.forEach((item, index) => {
                                let data = {
                                    categoryName: item.categoryName,
                                    categoryCode: item.categoryCode
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
        sureData() {
            let data = this.$refs.serivceClassTree.getCheckedNodes();
            if(data.length != 0) {
                let nameStr = '';
                data.forEach((item, index) => {
                    nameStr += item.categoryName +',';
                })
                this.dataName =nameStr.substring(0, nameStr.length-1);
            }else{
                this.dataName = '';
            }
            this.$emit('getSureData', data);
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
        clear() {
            this.dataName = '';
            this.$refs.serivceClassTree.setCheckedKeys([]);
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
<style lang="css">
.salce-discount-skutree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
    height: 200px;
    overflow: auto;
}
.salce-dis-tree-footer{
    position: absolute;
    z-index: 1000;
    top: 238px;
    width: 100%;
    height: 40px;
    text-align: right;
    background: #fff;
    border:  1px solid #c2cfd6;
    border-top: none;
}
</style>
