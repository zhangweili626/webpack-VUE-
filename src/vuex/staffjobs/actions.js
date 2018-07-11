import api from '../../common/api'
import config from "common/config"
import common from "common/common"
import * as types from './mutation-types.js'
import {getType} from 'common/api-common'

export const setTableList = ({commit}, params) => {
    commit(types.STAFFLIST_SET_LIST, params)
}
export const setPage = ({commit}, params) => {
    commit(types.STAFFLIST_SET__PAGE, params)
}

export const setjobPage = ({commit}, params) => {
    commit(types.SET_JOBPAGE, params)
}

export const setworkPage = ({commit}, params) => {
    commit(types.SET_WORKPAGE, params)
}


export const getOrg = ({commit}, params) => {
    commit(types.STAFFLIST_GET__ORGNAME, params)
}

export const getStaffInfo = ({ commit }, params) => {
	api.staffJob.queryInfo(params, (res)=> {
		if(res.data.code === 'success'){
			let obj = res.data.obj
            commit(types.SET_STAFF_INFO, obj)  
		}
	})
}

export const getWorkType =({commit},params)=>{
	api.ordinalInfo.getSequenceList(params, (res) => {
		if(res.data.code === 'success'){
			commit(types.GET_WORKTYPE,res.data.obj)
		}
    })
}

export const getWorkList =({commit},params)=>{
   	getType(config.storeStation.workTypeRef, (res) => {
		commit(types.GET_WORKTYPE_LIST,res)
    })
	
}

export const getSyset =({commit},params)=>{
	api.ordinalInfo.getSequenceList(params, (res) => {
		if(res.data.code === 'success'){
			commit(types.GET_JOB_SYSET,res.data.obj)
		}
    })
}

export const getOrgCode = ({commit},params)=>{
	let orgarr = JSON.parse(common.getSession('userInfo')).orgCodes;
	let orgCodeArr =[];
	for(let i =0; i< orgarr.length ; i++){
	 	const option = {
       		orgCode:orgarr[i]
    	}
		api.area.getOrg(option).then((res)=> {
		if(res.data.code == 'success'){
			orgCodeArr = orgCodeArr.concat(res.data.obj.subOrgCodes)
			orgCodeArr.push(res.data.obj.orgCode)
			commit(types.GET_ORGCODES,orgCodeArr)
		}
		});
		
	}
 	
}

export const getQuery = ({commit},params) =>{
	commit(types.SET_QUERY,params)
}
