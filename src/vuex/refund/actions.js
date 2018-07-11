import axios from 'axios'
import api from 'common/api'
import config from 'common/config'
import * as types from './mutation-types'

export const getRefundList = ({commit},parms) => {
	commit(types.SET_REFUND_LIST,parms)
}
export const getpage = ({commit},parms)=>{
	commit(types.SET_PAGE,parms)
}
