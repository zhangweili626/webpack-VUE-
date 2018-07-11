<template>
    <!-- Modal Component -->
    <b-modal ref="modal1" :title="title" :size="size" @ok="handleOk" @shown="clearName" close-title="关闭" ok-title="确认">
        <div class="row">
            <div class="col-md-12">
              <b-form-fieldset
                label=""
                :label-cols="3"
                :horizontal="true">
                <!-- <b-form-radio
                  :options="options"
                  :value="selected" 
                  @change="_change">
                </b-form-radio> -->
                <b-form-radio-group v-model="selected" :options="options"></b-form-radio-group>
              </b-form-fieldset>
            </div>
        </div>

    </b-modal>
</template>

<script>
    import Api from '../../common/api.js'
    import common from '../../common/common.js'
    import config from '../../common/config.js'
    import {mapState, mapGetters, mapActions} from 'vuex';
    import { Message } from 'element-ui';
    export default {
        data(){
          return{
            name: '',
            names: [],
            options:[],
            radioValue:'',
            selected: ''
          }

        },
        // props:['title','size'],
        props: {
            userInfo: {
                type: Object,
                default: {}
            },
            title: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            }
        },
        components:{
            Message
        },
        updated(){
            //console.info(33);
        },
        methods: {
            clearName() {              
                this.name = '';
            },
            handleOk(e) {
                var _this = this;
                if(!this.selected)return;
                Api.toLogin.changeLoginInfo({'orgCode':this.selected}).then(function(res){        
                    if(res.data.code == 'success'){                  
                        Message({
                          showClose: true,
                          message: config.messInfo.success,
                          type: 'success'
                        });
                        let currentTexture = _this.options.filter((data) => {
                            return data.value == _this.selected
                        })
                        common.setSession('currentTexture', JSON.stringify(currentTexture));
                        window.location.href = window.location.href
                        _this.hideModal();
                    }
                });

            },
            handleSubmit() {
                this.names.push(this.name);
                this.clearName();
                this.$refs.modal1.hide()
            },
            showModal() {
                this.$refs.modal1.show();
            },
            hideModal() {
                this.$refs.modal1.hide();
            },
            _change(value){                
                this.radioValue = value;    

            }
        },
        mounted(){


        },
        created() {
            const _this = this
            let option = {}
            //获取组织
            Api.toLogin.getOrg(option).then(function(res){
                // console.log(res)
                if(res.data.code === 'success') {
                    let tempArray = res.data.obj;
                    let i = res.data.obj.length;
                    while(i--){
                        _this.options.push({
                            text: res.data.obj[i].orgName, 
                            value: res.data.obj[i].orgCode
                        })
                    }
                    // }
                    // tempArray.forEach(element => {
                    //     _this.options.push({text: element.orgName, value:element.orgCode})
                    // })
                }
            })
        },
        watch:{
            userInfo:{
                handler:function(value){
                    this.selected = value.inCharegOrgVo.orgCode
                    // if (value) {
                    //     if(!(typeof value  == 'string') && (value == 'undefined')){
                    //         this.selected = value.inCharegOrgVo.orgCode
                    //     }
                    // }
                },
                deep: true
            }
        }
    }
</script>