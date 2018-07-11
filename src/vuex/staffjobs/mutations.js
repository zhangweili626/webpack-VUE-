import * as types from './mutation-types.js'

export default {
    [types.STAFFLIST_SET_LIST](state, data) {
    	state.staffList = data
    },
    [types.STAFFLIST_SET__PAGE](state,data){
    	state.page = data;
    },
    [types.STAFFLIST_GET__ORGNAME](state,data){
    	state.orgName = data
    },
    [types.SET_STAFF_INFO] (state, data) {
    	state.staffInfo = data
    },
    [types.GET_WORKTYPE](state,data){
    	state.workType = data
    },
     [types.GET_WORKTYPE_LIST](state,data){
    	state.workTypeList = data
    },
    [types.GET_JOB_SYSET](state,data){
    	state.sysetList = data
    },
    [types.GET_ORGCODES](state,data){
    	state.orgCodes = data;
    },
    [types.SET_JOBPAGE](state,data){
    	state.jobpage = data;
    },
    [types.SET_WORKPAGE](state,data){
    	state.workpage = data;
    },
    [types.SET_QUERY](state,data){
    	state.queryList = data
    }
}