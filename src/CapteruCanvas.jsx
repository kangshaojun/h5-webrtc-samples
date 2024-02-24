import React from "react";
import {Button,message} from "antd";
import '../styles/css/capture-canvas.css';

const constraints = window.constraints ={
    audio:false,
    video:true
}

let stream;
let canvas;
let context;

class CaptureCanvas extends React.Component{

    componentDidMount(){
        canvas = this.refs['canvas'];
        this.startCaptureCanvas();
    }

    startCaptureCanvas = async (e) => {
       

        stream = canvas.captureStream(10);
        const video = this.refs['video'];
        video.srcObject = stream;

        this.drawLine();
    }

    drawLine = () => {
        context = canvas.getContext('2d');

        context.fillStyle = '#CCC';
        context.fillRect(0,0,320,240);

        context.lineWidth = 1;
        context.strokeStyle = "#FF0000";

        canvas.addEventListener("mousedown",this.startAction);
        canvas.addEventListener("mouseup",this.endAction);
    }

    startAction = (event) => {
        context.beginPath();
        context.moveTo(event.offsetX,event.offsetY);
        context.stroke();

        canvas.addEventListener("mousemove",this.moveAction);
    }


    moveAction = (event) => {
        context.lineTo(event.offsetX,event.offsetY);
        context.stroke();
    }

    endAction = (event) => {
        canvas.removeEventListener("mousemove",this.moveAction);
    }

    render(){
        return(
            <div className="container">
            <h1>
              <span>示例</span>
            </h1>
            <div className="small-canvas">
                <canvas ref='canvas'></canvas>
            </div>
            <video className="small-video" ref="video"  playsInline autoPlay></video>
          </div>   
        );
    }

}

export default CaptureCanvas;