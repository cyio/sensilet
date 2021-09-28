//用于给网站提供接口
if (!window.sensilet)
    window.sensilet = {};

window.sensilet.postMessage = (message, callback) => {
    const listener = (event) => {
        if (event.detail.id === message.id) {

            window.removeEventListener('sato_contentscript_message', listener);
            if (callback && typeof callback === "function") {
                callback(event.detail)
            }
        }
        // console.log(event, 'script.js listener')
    };

    window.addEventListener('sato_contentscript_message', listener);

    window.dispatchEvent(
        new CustomEvent('sato_injected_script_message', {detail: message}),
    );
};

function action(actionName, params) {
    return new Promise((resolve, reject) => {
        if (!params)
            params = {};
// console.log(params,'params');
        window.sensilet.postMessage({
            method: actionName,
            params,
            id: actionName + Date.now() + "" + Math.floor(Math.random() * 1000000),
        }, (result) => {
            if (result.result === 'success') {
                resolve(result.data)
            } else {
                reject(new Error(result.msg || result.result))
            }
        })
    })
}

window.sensilet.requestAccount = (params) => {
    return action('connect', params)
};
window.sensilet.exitAccount = (params) => {
    return action('disConnect', params)
};
window.sensilet.getAccount = window.sensilet.requestAccount

window.sensilet.getBsvBalance = (params) => {
    return action('getBsvBalance', params)
};
window.sensilet.getTokenBalance = (params) => {
    return action('getTokenBalance', params)
};
/**
 *
 * @param receivers Array<{address : string,amount : number}>
 * @param broadcast boolean 是否广播
 */
window.sensilet.transferBsv = ({receivers}) => {
    return action('pay', {broadcast: true, receivers})
};


window.sensilet.transferSensibleFt = ({genesis, rabinApis, receivers}) => {
    return action('payToken', {broadcast: true, genesis, rabinApis, receivers})
};
/*
const transferAll = await bsv.transferAll()
*/
window.sensilet.transferAll =async (params) => {
    let result = [];
    for (let i = 0;params && i < params.length; i++) {
            result[i] = await  action( params[i].genesis?'payToken':'pay', params[i])
    }
    return result;
}


window.sensilet.payWithoutBroadcast = ({receivers}, callback) => {
   return  action('pay', {
        receivers,
        broadcast: false,
    }, callback)
};

window.sensilet.issue = (params, callback) => {
    return action('issue', params, callback)

};
window.sensilet.genesis = (params, callback) => {
    return action('genesis', params, callback)
};


/**
 *
 * @param params
 * @param callback
 */
window.sensilet.transferNft = (params, callback) => {
    return action('transferNft', params, callback)
};

window.sensilet.listGenesis = (params, callback) => {
    return action('listGenesis', params, callback)
};
window.sensilet.listNft = (params, callback) => {
    return action('listNft', params, callback)
};


console.log('script loaded #');
