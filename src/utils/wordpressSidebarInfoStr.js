import * as localforage from "localforage";

// 尝试获取本地存储的信息
const wordPressSidbarInfoStr = async function () {
    return await new Promise((resolve) => {
        localforage.getItem("wordPressSidbarInfo").then((data) => {
            console.log("===data===>>",data);
            let result = {};
            if (data){
                try{
                    result = JSON.parse(data)
                }catch(e){
                    console.log('getItem parse erro==>', e);
                }
            }
            resolve(result);
        });
    });
};

export default wordPressSidbarInfoStr;