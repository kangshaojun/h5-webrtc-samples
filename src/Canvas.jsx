import React from "react";
import {Button,message} from "antd";
import '../styles/css/canvas.css';


const constraints = window.constraints ={
    audio:false,
    video:true
}

let video;

class Canvas extends React.Component{

    componentDidMount(){

        video = this.refs['video'];
       this.openCamera();

    }

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

    takeSnap = async (e) => {
        let canvas = this.refs['canvas'];
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
    }


    render(){
        return(
            <div className="container">
            <h1>
              <span>截取视频示例</span>
            </h1>
            <video className="small-video" ref="video" autoPlay playsInline></video>
            <canvas className="small-canvas" ref="canvas"></canvas>
            <Button onClick={this.takeSnap}>截屏</Button>
          </div>   
        );
    }

}

export default Canvas;