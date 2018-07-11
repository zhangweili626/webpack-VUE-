<template>
    <div class="row" @click="boxClick"> 
        <div class="col-md-12 card-template-counting" >
           <div @click="orgClick" ref="org" class="sku-clear-parant">             
                    <b-form-input v-model="params.orgName" :readonly="true" :disabled="true"/>
                    <div class="sku-clear" v-if="params.orgName" @click.stop="clear()">x</div>                                                                
                </div>
                <div class="text-left  self_constrol zwlTree" v-show="orgShow">
                    <el-tree :data="orgTreeData" :props="orgOptions" :load="goryLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="orgItemClick">
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
        } 
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
        }
    },
    computed: {
        
    },
    methods: {
        // 服务分类
        goryLoad(node, resolve) {
                 if (node.level === 0) {
                let params = { categoryCode: config.serviceCategory.rootCode };
                api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                id: 0,   // 默认展示一级节点
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
        orgItemClick(data) {
            this.params.orgName = data.categoryName;
            this.$emit('getGCode', data);
            this.orgShow = false;
        },
        orgClick() {
            this.orgShow = !this.orgShow;
        },
        boxClick() {
            try{
                this.$refs.org.firstChild.id = ''                           
            }catch (e) {
                return
            }
        },
        clear(){
            const _this = this
            this.params.orgName = "";
            this.$emit('getGCode', {});
        }
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
<style lang="css" scoped>
.select-tree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
}
.card-template-counting{
    position: relative;
}
/*.self_constrol>.el-tree {
    max-height: 300px;
    overflow-y: scroll;
}*/
.sku-clear{
    position: absolute;
    top: 8px;
    right: 9px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #fff;
    background-color: rgba(102, 175, 233, 0.6);
    text-align: center;
    line-height: 18px;
    cursor: pointer;
}
.sku-clear-parant{
    position: relative;
}
</style>
