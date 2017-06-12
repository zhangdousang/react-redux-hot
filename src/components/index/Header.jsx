import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;
export default React.createClass({
    render: function () {
        return <Header>
            <a>设备管理</a>
        </Header>
    }
})