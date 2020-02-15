import axios from 'axios'

export function request(confing){

    return new Promise((reslove,resobj)=>{

        //创建axios 实例
        const install  = axios.create({
            baseURL:'https://tianqiapi.com/'
            
        })
        install.interceptors.response.use((confing)=>{
            return confing
        })
        install(confing).then((res)=>{
            reslove(res)
        })
    })
}