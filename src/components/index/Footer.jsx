import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;
export default React.createClass({
    getInitialState: function () {
        return {
            time: ""
        }
    },
    componentWillMount: function () {
        this.timer();
        setInterval(this.timer, 1000)
    },
    timer: function () {
        var date = new Date();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        if (second < 10) {
            second = "0" + second;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        var time = hours + ":" + minute + ":" + second;
        this.setState({
            time: time
        })
    },
    render:function(){
        return <Footer>
            <small>KANIMAMEIPI股份有限公司</small>
            </Footer>
    }

})