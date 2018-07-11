import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from 'common/config'

const state = {
    serviceHoursObj: {},
    subServiceHoursList: [],
    mainInfo: {},
    carInfo: {},
    queryParams: {}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}