import React from "react";
import {Button,message} from "antd";


const constraints = window.constraints ={
    audio:false,
    video:true
}

class Camera extends React.Component{


    openCamera = async (e) =>{

        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('success');
            this.handleSuccess(stream);

        }catch(e){
            this.handleError(e);
        }

    }

    handleSuccess = (stream) =>{
        const video = this.refs['myVideo'];
        const videoTracks = stream.getVideoTracks();
        console.log('使用的设备是:' + videoTracks[0].label);
        window.stream = stream;
        video.srcObject = stream;
    }

    handleError(error){
        if(error.name === 'ConstraintNotSatisfiedError'){
            const v = constraints.video;
            message.error(`宽:${v.width.exact} 高:${v.height.exact} 设备不支持`);
        } else if(error.name === 'PermissionDeniedError'){
            message.error('没有摄像头和麦克风的使用权限,请点击允许按钮');
        }
        message.error('getUserMedia错误:',error);
    }


    render(){
        return(
            <div className="container">
            <h1>
              <span>摄像头示例</span>
            </h1>
            <video className="video" ref="myVideo" autoPlay playsInline></video>
            <Button onClick={this.openCamera}>打开摄像头</Button>
          </div>   
        );
    }

}

export default Camera;