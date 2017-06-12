import React, { component, defaultProps, propTypes } from 'react';
import { hashHistory } from 'react-router';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import *as actions from "actions";
import MainReacuers from 'reducers';
import { bindActionCreators } from 'redux';
import { message, Modal,Button, Layout, Row, Col, Form } from 'antd';


class CameraAdd_ extends React.Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {
        this.props.actions.CameraListAction();
    }
    show() {
        console.log(this.props.actions)
    }
    render() {
        return <Button onClick={this.show.bind(this)}>增加列表点击查看action</Button>
    }
}
let CameraAdd = connect(
    state => { return Object.assign({}, state.MainReacuers) },
    dispatch => { let bindAction = bindActionCreators(actions, dispatch); return { actions: bindAction } }
)(Form.create()(CameraAdd_));
module.exports = CameraAdd