import React from "react";
import {Button,message} from "antd";


const constraints = window.constraints ={
    audio:false,
    video:true
}

class CaptureVideo extends React.Component{


    canPlay = () => {
        let sourceVideo = this.refs['sourceVideo'];
        let playerVideo = this.refs['playerVideo'];

        let stream;

        //侦率
        const fps = 0;

        stream = sourceVideo.captureStream(fps); 

        playerVideo.srcObject = stream;
    }

    render(){
        return(
            <div className="container">
            <h1>
              <span>示例</span>
            </h1>
            <video className="video" ref="sourceVideo" controls loop muted playsInline onCanPlay={this.canPlay}>
                <source src="./assets/webrtc.mp4" type="video/mp4"/>
            </video>
            <video className="video" ref="playerVideo"  playsInline autoPlay></video>
          </div>   
        );
    }

}

export default CaptureVideo;