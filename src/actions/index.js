import fetch from 'isomorphic-fetch';
export const LIST_CAMERA = 'LIST_CAMERA';
export const ADD_CAMERA = 'ADD_CAMERA';
export const DEL_CAMERA = 'DEL_CAMERA';
export const UPDATE_CAMERA = 'UPDATE_CAMERA';
export const SELECTED_INFO = 'SELECTED_INFO';
//获取Data
export function CameraListAction(value) {
    if (value) {
        return dispatch => {
            return fetch('/find', {
                method: 'GET'
            }).then(res => {
                res.json()
            }).then(data => {
                var arr = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    if (data[i].num.indexOf(value) >= 0) {
                        arr.push(data[i])
                    }
                }
                dispatch({
                    type: LIST_CAMERA,
                    data: arr
                })
            })
        }
    } else {
        return dispatch => {
            return fetch('/find', {
                method: 'GET'
            }).then(res => {
                res.json()
            }).then(data => {
                dispatch({
                    type: LIST_CAMERA,
                    data: data
                })
            })
        }
    }
};
//增加
export function addCamera(values) {
    return dispatch => {
        return fetch('/add', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(value)
        }).then(res => {
            res.json()
        }).then(data => {
            dispatch({
                type: ADD_CAMERA,
                addText: "增加一个"
            })
        })
    }
}
//删除
export function delCamera(id) {
    return dispatch => {
        return fetch('/del', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(id)
        }).then(res => {
            res.json()
        }).then(data => {
            dispatch({
                type: DEL_CAMERA,
                delText: "删除一个"
            })
        })
    }
}
//修改
export function updateCamera(value) {
    return dispatch => {
        return fetch('/update'), {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(value)
        }.then(res => {
            res.json()
        }).then(data => {
            dispatch({
                type: UPDATE_CAMERA,
                updateText: '修改一个'
            })
        })
    }
}
//获取选中栏信息
export function selectedInfo(data, e) {
    var selectedOne;
    var len = data.length;
    for (var i = 0; i < len; i++) {
        if (data[i].num == e) {
            selectedOne = data[i]
        }
    }
    return {
        type: SELECTED_INFO,
        selectedData: selectedOne
    }
}