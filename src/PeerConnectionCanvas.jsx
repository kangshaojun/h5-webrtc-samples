import React from "react";
import {Button,message} from "antd";
import '../styles/css/pc-canvas.css';


let canvas;
let context;

let localVideo;
let remoteVideo;
let localStream;
let peerConnA;
let peerConnB;

class PeerConnectionCanvas extends React.Component{

    componentDidMount(){
        remoteVideo = this.refs['remoteVideo'];
        canvas = this.refs['canvas'];
        this.startCaptureCanvas();
    }

    startCaptureCanvas = async (e) => {
    
        localStream = canvas.captureStream(10);
    
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

    
    call = async () => {

        //视频轨道
        const videoTracks = localStream.getVideoTracks();
        //音频轨道
        const audioTracks = localStream.getAudioTracks();
        //判断视频轨道是否有值
        if (videoTracks.length > 0) {
        //输出摄像头的名称
        console.log(`使用的视频设备为: ${videoTracks[0].label}`);
        }
        //判断音频轨道是否有值
        if (audioTracks.length > 0) {
        //输出麦克风的名称
        console.log(`使用的音频设备为: ${audioTracks[0].label}`);
        }

        let configuration = {"iceServers":[{ "url": "stun:stun.l.google.com:19302" }]};

        peerConnA = new RTCPeerConnection(configuration);
        peerConnA.addEventListener('icecandidate',this.onIceCandidateA);

        peerConnB = new RTCPeerConnection(configuration);
        peerConnB.addEventListener('icecandidate',this.onIceCandidateB);

        peerConnA.addEventListener('iceconnectionstatechange',this.onIceStateChangeA);
        peerConnB.addEventListener('iceconnectionstatechange',this.onIceStateChangeB);

        peerConnB.addEventListener('track',this.gotRemoteStream);

        localStream.getTracks().forEach((track) => {
            peerConnA.addTrack(track,localStream);
        });

        try{
            const offer = await peerConnA.createOffer();
            await this.onCreateOfferSuccess(offer);

        }catch(e){
            this.onCreateSessionDescriptionError(e);
        }

    }


    onCreateOfferSuccess =  async (desc) => {
        console.log(`peerConnA创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置peerConnA的本地描述start');
        try{
           await peerConnA.setLocalDescription(desc);
           this.onSetLocalSuccess(peerConnA);

        }catch(e){
            this.onSetSessionDescriptionError(e);
        }

        try{
            await peerConnB.setRemoteDescription(desc);
            this.onSetRemoteSuccess(peerConnB);
 
         }catch(e){
            this.onSetSessionDescriptionError(e);
         }



         try{
            const answer = await peerConnB.createAnswer();
            this.onCreateAnswerSuccess(answer);
 
         }catch(e){
            this.onCreateSessionDescriptionError(e);
         }


    }


    onCreateAnswerSuccess =  async (desc) => {
        console.log(`peerConnB的应答Answer数据:\n${desc.sdp}`);
        console.log('peerConnB设置本地描述开始:setLocalDescription');
        try{
            await peerConnB.setLocalDescription(desc);
            this.onSetLocalSuccess(peerConnB);
 
         }catch(e){
            this.onSetSessionDescriptionError(e);
         }
 

         try{
             await peerConnA.setRemoteDescription(desc);
             this.onSetRemoteSuccess(peerConnA);
  
          }catch(e){
            this.onSetSessionDescriptionError(e);
          }

    }

    onIceStateChangeA = (event) =>{
        console.log(`peerConnA连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    onIceStateChangeB = (event) =>{
        console.log(`peerConnB连接的ICE状态: ${peerConnA.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }


    onSetLocalSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置本地描述完成:setLocalDescription`);
    }


    onSetRemoteSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置远端描述完成:setRemoteDescription`);
    }

    getName = (pc) =>{
        return (pc === peerConnA)?'peerConnA':'peerConnB';
    }

    onCreateSessionDescriptionError = (error) => {
        console.log(`创建会话描述SD错误: ${error.toString()}`);
    }

    onSetSessionDescriptionError = (error) => {
        console.log(`设置会话描述SD错误: ${error.toString()}`);
    }


    onIceCandidateA = async (event) => {
        try{
            if(event.candidate){
                await peerConnB.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(peerConnB);
            }
        } catch(e){
            this.onAddIceCandidateError(peerConnA, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    onIceCandidateB = async (event) => {
        try{
            if(event.candidate){
                await peerConnA.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(peerConnA);
            }
        } catch(e){
            this.onAddIceCandidateError(peerConnB, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    onAddIceCandidateSuccess = (pc) => {
        console.log(`${this.getName(pc)}添加IceCandidate成功`);
    }

    onAddIceCandidateError = (pc,error) =>{
        console.log(`${this.getName(pc)}添加IceCandidate失败: ${error.toString()}`);
    }
    
    gotRemoteStream = (e) =>{
        if(remoteVideo.srcObject !== e.streams[0]){
            remoteVideo.srcObject = e.streams[0];
        }
    }

    hangup = () =>{
        console.log('结束会话');
        peerConnA.close();
        peerConnB.close();
        peerConnA = null;
        peerConnB = null;
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
            <video className="small-video" ref="remoteVideo"  playsInline autoPlay></video>
            <div>
                <Button onClick={this.call}>呼叫</Button>
                <Button onClick={this.hangup}>挂断</Button>
            </div>
          </div>   
        );
    }

}

export default PeerConnectionCanvas;