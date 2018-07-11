import api from "../../common/api";
class TreeApi{
    getchinaarea(obj = {}, callback){
        let returnData = [];
        api.chinaarea.querychinaarea(obj, (msg) => {
            if (msg.data.message == 'success') {
                let data = msg.data.obj
                for (let i = 0; i < data.length; i++) {
                    returnData[i] = {
                        text: data[i].areaName,
                        value: data[i].areaCode,
                        open: false,
                        levels: data[i].levels,
                        children:[],
                        nodata:false
                    }
                }
                callback && callback(returnData)
            }
        })
    }
}
export default new TreeApi