import React from "react";
import {Button,message} from "antd";


const constraints = window.constraints ={
    audio:true,
    video:false
}

class Microphone extends React.Component{


    componentDidMount(){
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
        const audio = this.refs['audio'];
        const audioTracks = stream.getAudioTracks();
        console.log('使用的设备是:' + audioTracks[0].label);
        window.stream = stream;
        audio.srcObject = stream;
    }

    handleError(error){
        console.log('getUserMedia error:' ,error.message,error.name);
    }


    render(){
        return(
            <div className="container">
            <h1>
              <span>麦克风示例</span>
            </h1>
            <audio ref="audio" controls autoPlay ></audio>
          </div>   
        );
    }

}

export default Microphone;