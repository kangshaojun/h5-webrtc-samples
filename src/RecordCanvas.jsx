import React from "react";
import { Button, message } from "antd";
import '../styles/css/record-canvas.css';

let mediaRecorder;

let recordedBlobs;

let stream;
let canvas;
let context;

class RecordCanvas extends React.Component {




    componentDidMount() {
        this.drawLine();
    }



    drawLine = () => {
        canvas = this.refs['canvas'];
        context = canvas.getContext('2d');

        context.fillStyle = '#CCC';
        context.fillRect(0, 0, 320, 240);

        context.lineWidth = 1;
        context.strokeStyle = "#FF0000";

        canvas.addEventListener("mousedown", this.startAction);
        canvas.addEventListener("mouseup", this.endAction);
    }

    startAction = (event) => {
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
        context.stroke();

        canvas.addEventListener("mousemove", this.moveAction);
    }


    moveAction = (event) => {
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }

    endAction = (event) => {
        canvas.removeEventListener("mousemove", this.moveAction);
    }


    startCaptureCanvas = async (e) => {

        stream = canvas.captureStream(10);
        const video = this.refs['video'];
        window.stream = stream;
        video.srcObject = stream;

        this.startRecord();
    }

    startRecord = (e) => {

        stream.addEventListener('inactive', e => {
            this.stopRecord(e);
        });

        recordedBlobs = [];

        try {
            mediaRecorder = new MediaRecorder(window.stream, { mineType: 'video/webm' });
        } catch (e) {
            console.log("MediaRecorder:", e);
            return;
        }

        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped:', event);
            console.log('Recorder blobs:', recordedBlobs);
        }

        mediaRecorder.ondataavailable = this.handleDataAvailable;
        mediaRecorder.start(10);

    }

    stopRecord = (e) => {
        try{
            mediaRecorder.stop();
        }catch(e){
            console.log(e);
        }

        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'canvas.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);

    }
    handleDataAvailable = (event) => {

        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>示例</span>
                </h1>

                <div className="small-canvas">
                    <canvas ref='canvas'></canvas>
                </div>
                <video className="small-video" ref="video" playsInline autoPlay></video>
                <div>
                    <Button
                        className="button"
                        onClick={this.startCaptureCanvas}
                    >
                        开始
                    </Button>
                            <Button
                                className="button"
                                onClick={this.stopRecord}
                            >
                                停止
                    </Button>
                </div>

            </div>
        );
    }

}

export default RecordCanvas;