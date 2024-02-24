import React from 'react';
import {HashRouter as Router,Route} from 'react-router-dom';
import Samples from './Samples';
import Camera from './Camera';
import Microphone from './Microphone';
import Canvas from './Canvas';
import ScreenSharing from './ScreenShare';
import VideoFilter from './VideoFilter';
import Resolution from './Resolution';
import AudioVolume from './volume/AudioVolume';
import DeviceSelect from './DeviceSelect';
import MediaSettings from './media-settings/MediaSetting';
import MediaStreamAPI from './MediaStreamAPI';
import CaptureVideo from './CaptureVideo';
import CaptureCanvas from './CapteruCanvas';
import RecordAudio from './RecordAudio';
import RecordVideo from './RecordVideo';
import RecordScreen from './RecordScreen';
import RecordCanvas from './RecordCanvas';
import PeerConnection from './PeerConnection';
import PeerConnectionVideo from './PeerConnectionVideo';
import PeerConnectionCanvas from './PeerConnectionCanvas';
import DataChannel from './DataChannel';
import DataChannelFile from './DataChannelFile';

class App extends React.Component{
    

    render(){
        return <Router>
            <div>
                <Route exact path="/" component={Samples}/>
                <Route exact path="/camera" component={Camera}/>
                <Route exact path="/microphone" component={Microphone}/>
                <Route exact path="/canvas" component={Canvas}/>
                <Route exact path="/screenSharing" component={ScreenSharing}/>
                <Route exact path="/videoFilter" component={VideoFilter}/>
                <Route exact path="/resolution" component={Resolution}/>
                <Route exact path="/audioVolume" component={AudioVolume}/>
                <Route exact path="/deviceSelect" component={DeviceSelect}/>
                <Route exact path="/mediaSettings" component={MediaSettings}/>
                <Route exact path="/mediaStreamAPI" component={MediaStreamAPI}/>
                <Route exact path="/captureVideo" component={CaptureVideo}/>
                <Route exact path="/captureCanvas" component={CaptureCanvas}/>
                <Route exact path="/recordAudio" component={RecordAudio}/>
                <Route exact path="/recordVideo" component={RecordVideo}/>
                <Route exact path="/recordScreen" component={RecordScreen}/>
                <Route exact path="/recordCanvas" component={RecordCanvas}/>
                <Route exact path="/peerConnection" component={PeerConnection}/>
                <Route exact path="/peerConnectionVideo" component={PeerConnectionVideo}/>
                <Route exact path="/peerConnectionCanvas" component={PeerConnectionCanvas}/>
                <Route exact path="/dataChannel" component={DataChannel}/>
                <Route exact path="/dataChannelFile" component={DataChannelFile}/>
            </div>
        </Router>
    }

}

export default App;