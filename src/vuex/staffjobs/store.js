import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'
import config from '../../common/config'
const state = {
    staffList: [],
    page:{
    	pageNo:1,
        pageSize: config.pageNums,
        totalResult: 0,
        totalPages: 1
    },
    jobpage:{
    	pageNo:1,
        pageSize: config.pageNums,
        totalResult: 0,
        totalPages: 1
    },
    workpage:{
    	pageNo:1,
        pageSize: config.pageNums,
        totalResult: 0,
        totalPages: 1
    },
    orgName:'',
    staffInfo: {},
    workType:[],//关系编码
    workTypeList:[],//工种列表
    sysetList:[],//岗位关系编码
    orgCodes:[],
    queryList:{},//查询条件保存
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

