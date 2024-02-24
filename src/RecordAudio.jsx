import React from "react";
import {Button,message} from "antd";
import "../styles/css/record-audio.css";


let mediaRecorder;

let recordedBlobs;

let audioPlayer;



class RecordAudio extends React.Component{

    constructor(){
        super();
        this.state = {
            status:'start',
        }
    }

    componentDidMount(){
        audioPlayer = this.refs['audioPlayer'];
    }

    startClickHandler = async(e) => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({audio:true});

            window.stream = stream;

            this.setState({
                status:'startRecord',
            });

        }catch(e){
            console.log("navigator.mediaDevices.getUserMedia:",e);
        }
    }


    startRecordButtonClickHandler = (e) => {

        recordedBlobs = [];

        let options = {mineType:'audio/ogg;'};

        try{

            mediaRecorder = new MediaRecorder(window.stream,options);

        }catch(e){
            console.log("MediaRecorder:",e);
            return;
        }

        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped:',event);
            console.log('Recorder blobs:',recordedBlobs);
        }

        mediaRecorder.ondataavailable = this.handleDataAvailable;

        mediaRecorder.start(10);

        this.setState({
            status:'stopRecord',
        });
        
    }

    stopRecordButtonClickHandler = (e) => {
        mediaRecorder.stop();
        this.setState({
            status:'play',
        });

    }

    playButtonClickHandler = (e) => {
        const blob = new Blob(recordedBlobs,{type:'audio/ogg'});

        audioPlayer.src = null;
        audioPlayer.src = window.URL.createObjectURL(blob);
        audioPlayer.play();
        this.setState({
            status:'download',
        });
    }

    downloadButtonClickHandler = (e) => {
        const blob = new Blob(recordedBlobs,{type:'audio/ogg'});
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.ogg';
        document.body.appendChild(a);
        a.click();
        setTimeout(()=>{
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },100);
        this.setState({
            status:'start',
        });

    }


    handleDataAvailable = (event) => {

        if(event.data && event.data.size > 0){
            recordedBlobs.push(event.data);
        }

    }
    

    render(){
        return(
            <div className="container">
            <h1>
              <span>示例</span>
            </h1>
            <audio ref="audioPlayer" autoPlay controls></audio>
            <div>
            <Button 
                className="button" 
                onClick={this.startClickHandler} 
                disabled={this.state.status != 'start'}>
                打开麦克风
            </Button>
            <Button 
                className="button" 
                onClick={this.startRecordButtonClickHandler} 
                disabled={this.state.status != 'startRecord'}>
                开始录制
            </Button>
            <Button 
                className="button" 
                onClick={this.stopRecordButtonClickHandler} 
                disabled={this.state.status != 'stopRecord'}>
                停止录制
            </Button>
            <Button 
                className="button" 
                onClick={this.playButtonClickHandler} 
                disabled={this.state.status != 'play'}>
                播放
            </Button>
            <Button 
                className="button" 
                onClick={this.downloadButtonClickHandler} 
                disabled={this.state.status != 'download'}>
                下载
            </Button>
            </div>
          </div>   
        );
    }

}

export default RecordAudio;