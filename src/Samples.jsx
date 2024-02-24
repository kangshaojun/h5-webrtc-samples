import React from 'react';
import {List} from "antd";
import {Link} from 'react-router-dom';

const data = [
    {title:'首页',path:'/'},
    {title:'摄像头示例',path:'/camera'},
    {title:'麦克风示例',path:'/microphone'},
    {title:'截取视频示例',path:'/canvas'},
    {title:'共享屏幕示例',path:'/screenSharing'},
    {title:'视频滤镜示例',path:'/videoFilter'},
    {title:'视频分辨率示例',path:'/resolution'},
    {title:'音量检测示例',path:'/audioVolume'},
    {title:'设备枚举示例',path:'/deviceSelect'},
    {title:'设置综合示例',path:'/mediaSettings'},
    {title:'MediaStreamAPI测试',path:'/mediaStreamAPI'},
    {title:'捕获Video作为媒体流示例',path:'/captureVideo'},
    {title:'捕获Canvas作为媒体流示例',path:'/captureCanvas'},
    {title:'录制音频示例',path:'/recordAudio'},
    {title:'录制视频示例',path:'/recordVideo'},
    {title:'录制屏幕示例',path:'/recordScreen'},
    {title:'录制Canvas示例',path:'/recordCanvas'},
    {title:'RTCPeerConnection示例',path:'/peerConnection'},
    {title:'Video发送至远端示例',path:'/peerConnectionVideo'},
    {title:'电子白板同步示例',path:'/peerConnectionCanvas'},
    {title:'数据通道示例',path:'/dataChannel'},
    {title:'数据通道发送文件示例',path:'/dataChannelFile'},
];

class Samples extends React.Component{

    render(){
        return <div>
            <List 
                header={<div>WebRTC示例</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Link to={item['path']}>{item['title']}</Link>
                    </List.Item>
                )}>
                
            </List>
        </div>
    }

}

export default Samples;