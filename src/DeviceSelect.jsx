import React from "react";
import {Button,Select} from "antd";

const {Option} = Select;

let videoElement;

class DeviceSelect extends React.Component{

    constructor(){
        super();
        this.state = {
            selectedAudioDevice:"",
            selectedAudioOutputDevice:"",
            selectedVideoDevice:"",
            videoDevices:[],
            audioDevices:[],
            audioOutputDevices:[],
        }
    }

    componentDidMount(){
        videoElement = this.refs['previewVideo'];
        this.updateDevices().then((data) => {

            if(this.state.selectedAudioDevice === "" && data.audioDevices.length > 0 ){
                this.setState({
                    selectedAudioDevice : data.audioDevices[0].deviceId,
                });
            }

            if(this.state.selectedAudioOutputDevice === "" && data.audioOutputDevices.length > 0 ){
                this.setState({
                    selectedAudioOutputDevice : data.audioOutputDevices[0].deviceId,
                });
            }

            if(this.state.selectedVideoDevice === "" && data.videoDevices.length > 0 ){
                this.setState({
                    selectedVideoDevice : data.videoDevices[0].deviceId,
                });
            }

            this.setState({
                videoDevices: data.videoDevices,
                audioDevices: data.audioDevices,
                audioOutputDevices: data.audioOutputDevices,
            });

        });

    }

    updateDevices = () => {
        return new Promise((pResolve,pReject) => {
            
            let videoDevices = [];
            let audioDevices = [];
            let audioOutputDevices = [];

            navigator.mediaDevices.enumerateDevices()
            .then((devices) => {

                for(let device of devices){
                    if(device.kind === 'videoinput'){
                        videoDevices.push(device);
                    }else if(device.kind === 'audioinput'){
                        audioDevices.push(device);
                    }if(device.kind === 'audiooutput'){
                        audioOutputDevices.push(device);
                    }
                }

            }).then(() => {
                let data = {videoDevices,audioDevices,audioOutputDevices};
                pResolve(data);
            });

        });
    }

    handleAudioDeviceChange = (e) => {
        this.setState({ selectedAudioDevice:e});
        setTimeout(this.startTest,100);
    }

    handleVideoDeviceChange = (e) => {
        this.setState({ selectedVideoDevice:e});
        setTimeout(this.startTest,100);
    }

    handleAudioOutputDeviceChange = (e) => {
        this.setState({ selectedAudioOutputDevice:e});
        
        if(typeof videoElement.skinId !== 'undefined'){
            videoElement.setSinkId(e).then(() => {
                console.log("音频输出设备设置成功");
            }).catch(error => {
                console.log("音频输出设备设置失败");
            });
        }else{
            console.warn("你的浏览器不支持输出设备选择");
        }

    }


    startTest = () => {
        let audioSource = this.state.selectedAudioDevice;
        let videoSource = this.state.selectedVideoDevice;

        let constraints = {
            audio:{deviceId:audioSource ? {exact:audioSource} :undefined},
            video:{deviceId:videoSource ? {exact:videoSource} :undefined},
        }
        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            window.stream = stream;
            videoElement.srcObject = stream;
        }).catch((e) => {
            console.log(e);
        });

    }




    render(){
        return(
            <div className="container">
            <h1>
              <span>设备枚举示例</span>
            </h1>
            <Select value={this.state.selectedAudioDevice} style={{width:150,marginRight:'10px'}} onChange={this.handleAudioDeviceChange}>
                {
                    this.state.audioDevices.map((device,index) => {
                    return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>)
                    })
                }
            </Select>
            <Select value={this.state.selectedAudioOutputDevice} style={{width:150,marginRight:'10px'}} onChange={this.handleAudioOutputDeviceChange}>
                {
                    this.state.audioOutputDevices.map((device,index) => {
                    return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>)
                    })
                }
            </Select>
            <Select value={this.state.selectedVideoDevice} style={{width:150}} onChange={this.handleVideoDeviceChange}>
                {
                    this.state.videoDevices.map((device,index) => {
                    return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>)
                    })
                }
            </Select>
            <video className="video" ref="previewVideo" autoPlay playsInline style={{objectFit:'contain',marginTop:'10px'}}></video>
            <Button onClick={this.startTest}>测试</Button>
          </div>   
        );
    }

}

export default DeviceSelect;