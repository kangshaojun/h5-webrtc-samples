import React from "react";
import {Button,Select,Modal} from "antd";
import SoundMeter from "./soundmeter";
import '../../styles/css/media-settings.css'

const {Option} = Select;

let videoElement;

export default class MediaSettings extends React.Component{

    constructor(){
        super();
        this.state = {
            visible:false,
            videoDevices:[],
            audioDevices:[],
            audioOutputDevices:[],
            resolution:'vga',
            selectedAudioDevice:"",
            selectedVideoDevice:"",
            audioLevel:0,
        }

        try{
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        }catch(e){
            console.log('网页音频API不支持.')
        }
    }

    componentDidMount(){

        if(window.localStorage){
            let deviceInfo = localStorage['deviceInfo'];
            if(deviceInfo){
                let info = JSON.parse(deviceInfo);
                this.setState({
                    selectedAudioDevice:info.audioDevice,
                    selectedVideoDevice:info.videoDevice,
                    resolution:info.resolution,
                });
            }
        }

        this.updateDevices().then((data) => {

            if(this.state.selectedAudioDevice === "" && data.audioDevices.length > 0 ){
                this.setState({
                    selectedAudioDevice : data.audioDevices[0].deviceId,
                });
            }

            if(this.state.selectedVideoDevice === "" && data.videoDevices.length > 0 ){
                this.setState({
                    selectedVideoDevice : data.videoDevices[0].deviceId,
                });
            }

            this.state.videoDevices = data.videoDevices;
            this.state.audioDevices = data.audioDevices;
            this.state.audioOutputDevices = data.audioOutputDevices;
            

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

    soundMeterProcess = () =>{
        var val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
        this.setState({audioLevel:val});
        if(this.state.visible){
            setTimeout(this.soundMeterProcess,100);
        }
        
    }

    stopPreview = () => {
        if(window.stream){
            this.closeMediaStream(window.stream);
        }
    }

    startPreview = () => {
        //
        if(window.stream){
            this.closeMediaStream(window.stream);
        }

        this.soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
        let soundMeterProcess = this.soundMeterProcess;

        let videoElement = this.refs['previewVideo'];
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
            soundMeter.connectToSource(stream);
            setTimeout(soundMeterProcess,100);

            return navigator.mediaDevices.enumerateDevices();

        }).then((devices) => {}).catch((e) => {
            console.log(e);
        });
        

    }

    closeMediaStream = (stream) => {

        if(!stream){
            return;
        }

        var tracks,i,len;
        if(stream.getTracks){
            tracks = stream.getTracks();
            for(i = 0,len = tracks.length;i<len; i+=1){
                tracks[i].stop();
            }
        }else{

            tracks = stream.getAudioTracks();
            for(i = 0,len = tracks.length;i<len; i+=1){
                tracks[i].stop();
            }

            tracks = stream.getVideoTracks();
            for(i = 0,len = tracks.length;i<len; i+=1){
                tracks[i].stop();
            }
        }

    }


    showModal = () => {
        this.setState({
            visible:true,
        });
        setTimeout(this.startPreview,100);
    }


    handleOk = (e) => {
        this.setState({
            visible:false,
        });
        if(window.localStorage){
            let deviceInfo = {
                audioDevice: this.state.selectedAudioDevice,
                videoDevice:this.state.selectedVideoDevice,
                resolution:this.state.resolution,
            }
            localStorage["deviceInfo"] = JSON.stringify(deviceInfo);
        }
        this.stopPreview();
    }

    handleCancel = () => {
        this.setState({
            visible:false,
        });
        this.stopPreview();
    }




    handleAudioDeviceChange = (e) => {
        this.setState({ selectedAudioDevice:e});
        setTimeout(this.startPreview,100);
    }

    handleVideoDeviceChange = (e) => {
        this.setState({ selectedVideoDevice:e});
        setTimeout(this.startPreview,100);
    }

    handleResolutionChange = (e) => {
        this.setState({ resolution:e});
    }

    
   
    render() {
        return (
            <div className="container">
                <h1>
                    <span>设置综合示例</span>
                </h1>
                <Button onClick={this.showModal}>修改设备</Button>
                <Modal
                    title="修改设备"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消">
                    <div className="item">
                        <span className="item-left">麦克风</span>
                        <div className="item-right">
                            <Select value={this.state.selectedAudioDevice} style={{ width: 350 }} onChange={this.handleAudioDeviceChange}>
                                {
                                    this.state.audioDevices.map((device, index) => {
                                        return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
                                    })
                                }
                            </Select>
                            <div ref="progressbar" style={{
                                width: this.state.audioLevel + 'px',
                                height: '10px',
                                backgroundColor: '#8dc63f',
                                marginTop: '20px',
                            }}>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <span className="item-left">摄像头</span>
                        <div className="item-right">
                            <Select value={this.state.selectedVideoDevice} style={{ width: 350 }} onChange={this.handleVideoDeviceChange}>
                                {
                                    this.state.videoDevices.map((device, index) => {
                                        return (<Option value={device.deviceId} key={device.deviceId}>{device.label}</Option>);
                                    })
                                }
                            </Select>
                            <div className="video-container">
                                <video id='previewVideo' ref='previewVideo' autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }}></video>
                            </div>

                        </div>
                    </div>
                    <div className="item">
                        <span className="item-left">清晰度</span>
                        <div className="item-right">
                            <Select style={{ width: 350 }} value={this.state.resolution} onChange={this.handleResolutionChange}>
                                <Option value="qvga">流畅(320x240)</Option>
                                <Option value="vga">标清(640x360)</Option>
                                <Option value="hd">高清(1280x720)</Option>
                                <Option value="fullhd">超清(1920x1080)</Option>
                            </Select>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}

