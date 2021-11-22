import {createStore} from 'vuex'

export default createStore({
    state: {
        satoshis: 0,
        accountList: [],
        account: null,
        tokenList: null,
        totalTokenValue: 0,  //所有token的价值之和
        version: {},
        versionChecked: 0,
        isSettingChecked: true,
    },
    getters: {
        address(state) {
            return state.account ? state.account.address : ""
        },
        addressShow(state) {
            return state.account ? showLongString(state.account.address) : ""
        },
        alias(state) {
            return state.account ? state.account.alias : ""
        },
        accountMode(state) {
            return state.account ? state.account.accountMode : ""
        },
        hasNewVersion(state) {
            if (state.version && config)
                return state.version.versionCode > config.versionCode && state.version.versionCode > state.versionChecked
            return false;
        }

    },
    mutations: {
        initAccount(state) {
            let account = walletManager.listAccount();
            state.accountList = account.map(item => {
                item.addressShow = showLongString(item.address, 10);
                item.accountMode = walletManager.getAccountMode(item)
                return item
            });
            state.account = walletManager.getCurrentAccount();
        },
        editAlias(state, alias) {
            if (state.account) {
                state.account.alias = ""; //这里需要重置一下数据，才会触发界面改变，原因未知
                state.account.alias = alias
            }
        },
        setVersionInfo(state, version) {
            state.version = version;
        },
        refreshVersionCheck(state) {
            state.versionChecked = localManager.getVersionChecked();
        },
        initSettingChecked(state) {
            state.isSettingChecked = localManager.isSettingChecked();
        },
    },
    actions: {

        async refreshAsset({commit, state}) {

        },
        async refreshAllToken({commit, state}) {
            state.tokenList = null;
            state.totalTokenValue = 0;
            await sleep(200);
            state.tokenList = await tokenManager.listUserTokens().catch(e => {
                console.log(e);
                return []
            })
            state.totalTokenValue =(state.tokenList.reduce((value, item) => {
                if (item.usd)
                    return value + parseFloat( item.usd)
                return value
            }, 0)).toFixed(2)
            console.log(state.totalTokenValue)
        }
    },
    modules: {}
})
