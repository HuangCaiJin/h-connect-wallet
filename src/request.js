let axios = require("axios")
let qs = require("qs")
class Request {

    get(url,params = {},cancelToken ){
        return this.http({
            url,
            params,
            method:'GET'
        },cancelToken)
    }

    post(url,params = {}){
        return this.http({
            url,
            params,
            method:'POST'
        })
    }

    put(url,params = {}){
        return this.http({
            url,
            params,
            method:'PUT'
        })
    }

    delete(url,params = {}){
        return this.http({
            url,
            params,
            method:'DELETE'
        })
    }

    postJson(url,params = {}){
        return this.http({
            url,
            params,
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            isJson:true
        })
    }

    http({ url, headers, params, method, isJson }) {
      const qsParams = method.toUpperCase() === "POST" ? isJson ? JSON.stringify(params) : qs.stringify(params) : params;
      return new Promise((resolve, reject) => {
        axios(method.toUpperCase() === "POST" ? {
                url,
                headers,
                data: qsParams,
                method: method || "post"
            } : {
                url,
                headers,
                params: qsParams,
                method: method || "post"
            }
        ).then(({ data }) => { resolve(data); }).catch(err => {
            reject(err);
        });
      });
    };
}

module.exports = Request