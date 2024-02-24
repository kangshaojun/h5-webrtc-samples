import React from "react";
import {Button,message} from "antd";
import SoundMeter from "./soundmeter";




class AudioVolume extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            audioLevel:0,
        }
    }

    componentDidMount(){

        try{
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        }catch(e){
            console.log('网页音频API不支持.')
        }

        soundMeter = window.soundMeter = new SoundMeter(window.audioContext);

        const constraints  = window.constraints = {
            audio:true,
            video:false,
        }

        navigator.mediaDevices.getUserMedia(constraints).then(this.handleSuccess).catch(this.handleError);
    }

    handleSuccess = (stream) =>{
        
        window.stream = stream;
        soundMeter.connectToSource(stream);
        setTimeout(this.soundMeterProcess,100);
    }

    soundMeterProcess = () =>{
        var val = (window.soundMeter.instant.toFixed(2) * 348) + 1;
        this.setState({audioLevel:val});
        setTimeout(this.soundMeterProcess,100);
    }

    handleError(error){
        console.log('getUserMedia error:' ,error.message,error.name);
    }


    render(){
        return(
            <div className="container">
            <h1>
              <span>音量检测示例</span>
            </h1>
            <div style={{
                width:this.state.audioLevel + 'px',
                height:'10px',
                backgroundColor:'#8dc63f',
                marginTop:'20px',
            }}>

            </div>
          </div>   
        );
    }

}

export default AudioVolume;