import api from 'common/api'
import * as types from './mutation-types.js'

export const setSkuCarTableList = ({commit}, params) => {
    commit(types.SKUCARLIST_SET_LIST, params)
}
export const setSkuCarParam = ({commit}, params) => {
    commit(types.SKUCARLIST_SET__PARAM, params)
}
export const setSkuCarPages = ({commit}, params) => {
    commit(types.SKUCARLIST_SET__PAGES, params)
}
export const getSkuCarList = ({commit}, params) => {
    api.skuCar.skuCarSearch(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.SKUCARLIST_SET__PARAM, params);          
            commit(types.SKUCARLIST_SET_LIST, res.data.obj.list);
            commit(types.SKUCARLIST_SET__PAGES, pages);
        }
    })
}

export const setCarSkuTableList = ({commit}, params) => {
    commit(types.CARSKULIST_SET_LIST, params)
}
export const setCarSkuParam = ({commit}, params) => {
    commit(types.CARSKULIST_SET__PARAM, params)
}
export const setCarSkuPages = ({commit}, params) => {
    commit(types.CARSKULIST_SET__PAGES, params)
}
export const getCarSkuList = ({commit}, params) => {
    api.skuCar.carSkuSearch(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.CARSKULIST_SET__PARAM, params);          
            commit(types.CARSKULIST_SET_LIST, res.data.obj.list);
            commit(types.CARSKULIST_SET__PAGES, pages);
        }
    })
}

export const setSkuAllCarTableList = ({commit}, params) => {
    commit(types.SKUCARALLLIST_SET_LIST, params)
}
export const setSkuCarAllParam = ({commit}, params) => {
    commit(types.SKUCARALLLIST_SET__PARAM, params)
}
export const setSkuCarAllPages = ({commit}, params) => {
    commit(types.SKUCARALLLIST_SET__PAGES, params)
}
export const getSkuCarAllList = ({commit}, params) => {
    api.skuCar.skuCarSearch(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.SKUCARALLLIST_SET__PARAM, params);          
            commit(types.SKUCARALLLIST_SET_LIST, res.data.obj.list);
            commit(types.SKUCARALLLIST_SET__PAGES, pages);
        }
    })
}