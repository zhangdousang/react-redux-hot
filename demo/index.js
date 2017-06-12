import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Match, Link, Miss, Route, Router, IndexRoute, hashHistory } from 'react-router';
import "./less/index.less";
import Content from 'Content';
import Manage from 'Manage';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import LoadReducers from 'LoadReducers';
import MainReacuers from 'reducers';
import CameraList from 'CameraList';
import CameraAdd from 'CameraAdd';

const AllReducers = combineReducers({
    MainReacuers: MainReacuers
})
const store = LoadReducers(AllReducers);


ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Content}>
                <Route path="/manage" component={Manage}>
                    <Route path="/cameraList" component={CameraList}></Route>
                    <Route path="/cameraAdd" component={CameraAdd}></Route>
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.getElementById('root'));