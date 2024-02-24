import React from "react";
import { Button, message } from "antd";

let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

let fileReader;
let receiveBuffer = [];
let receivedSize = 0;
let filetInput;
let sendProgress;
let receiveProgress;

class DataChannelFile extends React.Component {

    componentDidMount(){
        sendProgress = this.refs['sendProgress'];
        receiveProgress = this.refs['receiveProgress'];

        filetInput = this.refs['fileInput'];
        filetInput.addEventListener('change',async () => {
            const file = filetInput.files[0];
            if(!file){
                console.log('没有选择文件');
            }else{
                console.log('选择的文件是:' + file.name);
            }
        });
    }
    
    startSendFile = async () => {

    
        localConnection = new RTCPeerConnection();
        localConnection.addEventListener('icecandidate', this.onLocalIceCandidate);

        sendChannel = localConnection.createDataChannel('webrtc-datachannel');
        sendChannel.binaryType = 'arraybuffer';
        sendChannel.onopen = this.onSendChannelStateChange;
        sendChannel.onclose = this.onSendChannelStateChange;


        remoteConnection = new RTCPeerConnection();
        remoteConnection.addEventListener('icecandidate', this.onRemoteIceCandidate);

        localConnection.addEventListener('iceconnectionstatechange', this.onLocalIceStateChange);
        remoteConnection.addEventListener('iceconnectionstatechange', this.onRemoteIceStateChange);


        remoteConnection.ondatachannel = this.receiveChannelCallback;


        try {
            const offer = await localConnection.createOffer();
            await this.onCreateOfferSuccess(offer);

        } catch (e) {
            this.onCreateSessionDescriptionError(e);
        }

    }

    onSendChannelStateChange = () => {
        const readyState = sendChannel.readyState;
        console.log('发送通道状态:' + readyState);
        if(readyState === 'open'){
            this.sendData();
        }
    }

    onReceiveChannelStateChange = () => {
        const readyState = receiveChannel.readyState;
        console.log('接收通道状态:' + readyState);
    }

    
    receiveChannelCallback = (event) =>{

        receiveChannel = event.channel;
        receiveChannel.binaryType = 'arraybuffer';
        receiveChannel.onmessage = this.onReceiveMessageCallBack;
        receiveChannel.onopen = this.onReceiveChannelStateChange;
        receiveChannel.onclose = this.onReceiveChannelStateChange;

        receivedSize = 0;

    }

    onReceiveMessageCallBack = (event) => {
        receiveBuffer.push(event.data);
        receivedSize += event.data.byteLength;
        receiveProgress.value = receivedSize;

        const file = filetInput.files[0];
        if(receivedSize === file.size){
            const received = new Blob(receiveBuffer);
            receiveBuffer = [];

            let download = this.refs['download'];
            download.href = URL.createObjectURL(received);
            download.download = file.name;
            download.textContent = `点击下载'${file.name}'&(${file.size} bytes)`;
            download.style.display = 'block';
        }
    }


    onCreateOfferSuccess = async (desc) => {
        console.log(`localConnection创建Offer返回的SDP信息\n${desc.sdp}`);
        console.log('设置localConnection的本地描述start');
        try {
            await localConnection.setLocalDescription(desc);
            this.onSetLocalSuccess(localConnection);

        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }

        try {
            await remoteConnection.setRemoteDescription(desc);
            this.onSetRemoteSuccess(remoteConnection);

        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }



        try {
            const answer = await remoteConnection.createAnswer();
            this.onCreateAnswerSuccess(answer);

        } catch (e) {
            this.onCreateSessionDescriptionError(e);
        }


    }


    onCreateAnswerSuccess = async (desc) => {
        console.log(`remoteConnection的应答Answer数据:\n${desc.sdp}`);
        console.log('remoteConnection设置本地描述开始:setLocalDescription');
        try {
            await remoteConnection.setLocalDescription(desc);
            this.onSetLocalSuccess(remoteConnection);

        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }


        try {
            await localConnection.setRemoteDescription(desc);
            this.onSetRemoteSuccess(localConnection);

        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }

    }

    onLocalIceStateChange = (event) => {
        console.log(`localConnection连接的ICE状态: ${localConnection.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }

    onRemoteIceStateChange = (event) => {
        console.log(`remoteConnection连接的ICE状态: ${localConnection.iceConnectionState}`);
        console.log('ICE状态改变事件: ', event);
    }


    onSetLocalSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置本地描述完成:setLocalDescription`);
    }


    onSetRemoteSuccess = (pc) => {
        console.log(`${this.getName(pc)}设置远端描述完成:setRemoteDescription`);
    }

    getName = (pc) => {
        return (pc === localConnection) ? 'localConnection' : 'remoteConnection';
    }

    onCreateSessionDescriptionError = (error) => {
        console.log(`创建会话描述SD错误: ${error.toString()}`);
    }

    onSetSessionDescriptionError = (error) => {
        console.log(`设置会话描述SD错误: ${error.toString()}`);
    }


    onLocalIceCandidate = async (event) => {
        try {
            if (event.candidate) {
                await remoteConnection.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(remoteConnection);
            }
        } catch (e) {
            this.onAddIceCandidateError(localConnection, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    onRemoteIceCandidate = async (event) => {
        try {
            if (event.candidate) {
                await localConnection.addIceCandidate(event.candidate);
                this.onAddIceCandidateSuccess(localConnection);
            }
        } catch (e) {
            this.onAddIceCandidateError(remoteConnection, e);
        }
        console.log(`IceCandidate数据:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    onAddIceCandidateSuccess = (pc) => {
        console.log(`${this.getName(pc)}添加IceCandidate成功`);
    }

    onAddIceCandidateError = (pc, error) => {
        console.log(`${this.getName(pc)}添加IceCandidate失败: ${error.toString()}`);
    }


    sendData = () =>{

        let file = filetInput.files[0];

        sendProgress.max = file.size;
        receiveProgress.max = file.size;

        let chunkSize = 16384;
        fileReader = new FileReader();
        let offset = 0;

        fileReader.addEventListener('error',(error)=>{
            console.error('读取文件出错:',error);
        });

        fileReader.addEventListener('abort',(event)=>{
            console.error('读取文件取消:',event);
        });

        fileReader.addEventListener('load',(e)=>{

            sendChannel.send(e.target.result);

            offset +=e.target.result.byteLength;

            sendProgress.value = offset;

            if(offset < file.size){
                readSlice(offset);
            }

        });
        let readSlice = (o) =>{
            let slice = file.slice(offset,o + chunkSize);
            fileReader.readAsArrayBuffer(slice);
        };
        readSlice(0);
    }



    closeChannel = () => {
        console.log('结束会话');
        sendChannel.close();
        if(receiveChannel){
            receiveChannel.close();
        }
        localConnection.close();
        remoteConnection.close();
        localConnection = null;
        remoteConnection = null;
    }

    cancleSendFile = () => {
        if(fileReader && fileReader.readyState === 1){
            console.log('取消读取文件');
            fileReader.abort();
        }
    }

    render() {
        return (
            <div className="container">
                <h1>
                    <span>示例</span>
                </h1>
                <div>
                    <form id="fileInfo">
                        <input type="file" ref="fileInput" name="files" />
                    </form>
                    <div>
                        <h2>发送</h2>
                        <progress ref="sendProgress" max="0" value="0" style={{width:'500px'}}></progress>
                    </div>
                    <div>
                        <h2>接收</h2>
                        <progress ref="receiveProgress" max="0" value="0" style={{width:'500px'}}></progress>
                    </div>
                </div>

                <a ref="download"></a>
                <Button onClick={this.startSendFile}>发送</Button>
                <Button onClick={this.cancleSendFile}>取消</Button>
                <Button onClick={this.closeChannel}>关闭</Button>
            </div>
        );
    }

}

export default DataChannelFile;