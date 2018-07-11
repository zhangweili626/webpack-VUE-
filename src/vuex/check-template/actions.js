import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.TEMPLATELIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.TEMPLATELIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.TEMPLATELIST_SET__PAGES, params)
}
export const getTemplateTabList = ({commit}, params) => {
    api.checkTemplate.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNum: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.TEMPLATELIST_SET__PARAM, params);          
            commit(types.TEMPLATELIST_SET_LIST, res.data.obj.list);
            commit(types.TEMPLATELIST_SET__PAGES, pages);
        }
    })
}