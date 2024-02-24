import React from "react";
import { Button, message, Select } from "antd";
const { Option } = Select;


const qvgaConstraints = {
    video: { width: { exact: 320 }, height: { exact: 240 } }
};

const vgaConstraints = {
    video: { width: { exact: 640 }, height: { exact: 480 } }
};

const hdConstraints = {
    video: { width: { exact: 1280 }, height: { exact: 720 } }
};

const fullHdConstraints = {
    video: { width: { exact: 1920 }, height: { exact: 1080 } }
};

const twoKConstraints = {
    video: { width: { exact: 2560 }, height: { exact: 1440 } }
};

const fourKConstraints = {
    video: { width: { exact: 4096 }, height: { exact: 2160 } }
};

const eightConstraints = {
    video: { width: { exact: 7680 }, height: { exact: 4320 } }
};

let stream;

let video;

class Resolution extends React.Component {

    componentDidMount() {
        video = this.refs['video'];
    }

    getMedia = (constraints) => {

        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
            });
        }

        navigator.mediaDevices.getUserMedia(constraints).then(this.gotStream).catch(e => {
            this.handleError(e);
        });

    }

    gotStream = (mediaStream) => {
        stream = window.stream = mediaStream;
        video.srcObject = stream;
    }

    handleError(error) {
        console.log('getUserMedia错误:', error);
    }

    handChange = (value) => {
        switch (value) {
            case 'qvga':
                this.getMedia(qvgaConstraints);
                break;
            case 'vga':
                this.getMedia(vgaConstraints);
                break;
            case 'hd':
                this.getMedia(hdConstraints);
                break;
            case 'fullhd':
                this.getMedia(fullHdConstraints);
                break;
            case '2k':
                this.getMedia(twoKConstraints);
                break;
            case '4k':
                this.getMedia(fourKConstraints);
                break;
            case '8k':
                this.getMedia(eightKConstraints);
                break;
            default:
                this.getMedia(vgaConstraints);
                break;
        }
    }

    dynamicChange = (e) => {
        const track = window.stream.getVideoTracks()[0];
        console.log(window.stream.getVideoTracks());
        let constraints = vgaConstraints;
        track.applyConstraints(constraints)
        .then(() => {
            console.log("动态改变分辨率成功...");
        }).catch(err => {
            console.log("动态改变分辨率错误...",err.name);
        })
    }


    render() {
        return (
            <div className="container">
                <h1>
                    <span>摄像头示例</span>
                </h1>
                <video className="video" ref="video" autoPlay playsInline></video>
                <Select defaultValue="vga" style={{ width: '100px', marginLeft: '20px' }} onChange={this.handChange}>
                    <Option value="qvga">QVGA</Option>
                    <Option value="vga">VGA</Option>
                    <Option value="hd">高清</Option>
                    <Option value="fullhd">超清</Option>
                    <Option value="2k">2K</Option>
                    <Option value="4k">4K</Option>
                    <Option value="8k">8K</Option>
                </Select>
                <Button onClick={this.dynamicChange}>动态设置</Button>
            </div>
        );
    }

}

export default Resolution;