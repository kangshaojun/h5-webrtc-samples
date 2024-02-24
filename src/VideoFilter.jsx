import React from "react";
import { Button, message, Select } from "antd";
import '../styles/css/video-filter.css';

const { Option } = Select;

const constraints = window.constraints = {
    audio: false,
    video: true
}

let video;

class VideoFilter extends React.Component {

    componentDidMount() {

        video = this.refs['video'];

        const constraints = {
            audio: false,
            video: true
        }

        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
    }



    handleSuccess = (stream) => {

        window.stream = stream;
        video.srcObject = stream;
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            const v = constraints.video;
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`);
        } else if (error.name === 'PermissionDeniedError') {
            message.error('没有摄像头和麦克风的使用权限,请点击允许按钮');
        }
        message.error('getUserMedia错误:', error);
    }

    handChange = (value) => {
        video.className = value;
    }


    render() {
        return (
            <div className="container">
                <h1>
                    <span>视频滤镜示例</span>
                </h1>
                <video ref="video" autoPlay playsInline></video>
                <Select defaultValue="none" style={{ width: '100px' }} onChange={this.handChange}>
                    <Option value="none">没有滤镜</Option>
                    <Option value="blur">模糊</Option>
                    <Option value="grayscale">灰度</Option>
                    <Option value="invert">反转</Option>
                    <Option value="sepia">深褐色</Option>
                </Select>
            </div>
        );
    }

}

export default VideoFilter;