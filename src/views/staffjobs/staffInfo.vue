<template>
	    <div class="row">
        <div class="col-md-12">
            <b-card header="员工信息">
                <!--<div slot="header">
                    <strong>员工信息</strong>
                </div>-->
                <div class="row">
                    <div class="col-md-3 mt-3 ml-4">
                        <div class=""><span class="">员工编码：</span>{{staffInfo.empCode}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">员工姓名：{{staffInfo.empCnName}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">员工性别：{{staffInfo.empSex =='0'?'男':'女'}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">所属组织：{{staffInfo.orgName}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">员工类型：{{staffInfo.empTypeName}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">员工状态：{{staffInfo.empStatus}}</div>
                    </div>
                    <div class="col-md-3 mt-3 ml-4">
                    	<div class="">在职情况：{{staffInfo.onJob =='0'?'离职':'在职'}}</div>
                    </div>
                    
                </div>
            </b-card>
        </div>
    </div>
</template>

<script>
import api from 'common/api'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
    components: {
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
            staff: {
                empCode: '344555557777',
                empCnName: '张三',
                empSex: '',
                orgName: '集团',
                empTypeName:'',
                empStatus:'试用',
                onJob:'在职',
            },
        }
    },
    created() {
//  	console.log(this.$route)
    	let params = {
    		'empCode': this.$route.params.staffNo
    	}
        this.getStaffInfo(params);
    },
    computed: {
    	...mapGetters('staffjobs',[
    	   'staffInfo'
    	])
    },
    methods: {
    	...mapActions('staffjobs',[
    	   'getOrg',
    	   'getStaffInfo'
    	]),
    },
}
</script>

<style>
</style>