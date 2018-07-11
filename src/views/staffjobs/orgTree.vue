<template>
    <div class="row  self_constrol-1" @click="boxClick"> 
        <div class="col-md-12" >
           <div @click="orgClick" ref="org">             
                    <b-form-input v-model="params.orgName" readonly/>
                    
                </div>
                <div class="text-left select-tree self_constrol" v-if="orgShow">
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
        orgCode: {
            type: String,
            default: ''
        }, 
    },
    data() {
        return {                 
            // org
            orgTreeData: [],
            orgOptions: {
                children: 'children',
                label: 'name'
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
                let params = { orgCode: this.orgCode || config.areaRoot.org};
                api.area.getOrg(params).then(res => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        let arr = [{
                            id: 0,
                            name: obj.orgName,
                            code: obj.orgCode
                        }];
                        return resolve(arr);
                    }
                })
            } else {
                let params = { orgCode: node.data.code};
                api.area.getOrg(params).then(res => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.childOrganizations;
                        let arr = [];
                        if (items !== null) {
                            items.forEach((item, index) => {
                                let data = {
                                    name: item.orgName,
                                    code: item.orgCode
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
            this.params.orgName = data.name;
            this.$emit('getOrgCode', data);
            this.orgShow = false;
        },
        orgClick() {
            if(!this.disabled) {
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
<style lang="css" scoped>
.select-tree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
}
.self_constrol{
    max-height: 300px;
    overflow: hidden;
}
.self_constrol>.el-tree {
    max-height: 300px;
    overflow-y: scroll;
}
</style>
