import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router';
const { Sider, Content } = Layout;
export default class manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "cameraLit"
        }
    }
    componentWillMount() {
        var url = location.hash.split("?")[0].slice(2);
        this.setState({
            keys: url
        })
    }
    render() {
        return <Layout style={{ "minHeight": "500px", "backgroundColor": "#fff" }}>
            <Sider collapsible>
                <Menu defaultSelectedKeys={[this.state.keys]}>
                    <Menu.Item key="cameraList">
                        <Link to='/cameraList'>摄影机列表</Link>
                    </Menu.Item>
                    <Menu.Item key="cameraAdd">
                        <Link to='/cameraAdd'>摄影机添加</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Content>
                {this.props.children}
            </Content>
        </Layout>
    }



}