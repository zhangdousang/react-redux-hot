import {
    LIST_CAMERA,
    ADD_CAMERA,
    DEL_CAMERA,
    UPDATE_CAMERA,
    SELECTED_INFO
} from 'actions';

const initialState = {
    listData: [],
    addText: '',
    delText: '',
    updateText: '',
    selectedData: {}
}
let ReducerObject = {};
//获取表单数据
ReducerObject[LIST_CAMERA] = (state, action) => {
    let newState = Object.assign({}, state);
    newState.data = action.data;
    // newState.count = action.data.length;
    return newState;
}
//增加
ReducerObject[ADD_CAMERA] = (state, action) => {
    let newState = Object.assign({}, state);
    newState.addText = action.addText;
    return newState;
}
//删除
ReducerObject[DEL_CAMERA] = (state, action) => {
    let newState = Object.assign({}, state);
    newState.delText = action.delText;
    return newState;
}
//修改
ReducerObject[UPDATE_CAMERA] = (state, action) => {
    let newState = Object.assign({}, state);
    newState.updateText = action.updateText;
    return newState;
}
//选取选中栏信息
ReducerObject[SELECTED_INFO] = (state, action) => {
    let newState = Object.assign({}, state);
    newState.selectedData = action.selectedData;
    return newState;
}


//整合
export default function MainReacuers(state = initialState, action) {
    if (ReducerObject[action.type] != undefined && ReducerObject[action.type] != null) {
        return ReducerObject[action.type](state, action);
    } else {
        return state
    }
}