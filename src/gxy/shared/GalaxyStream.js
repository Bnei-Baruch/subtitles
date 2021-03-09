import React, { Component, Fragment } from 'react';
import { Janus } from '../lib/janus';
import { GEO_IP_INFO } from './env';
import api from '../../gxy/shared/Api';
import GxyJanus from '../../gxy/shared/janus-utils';
import { kc } from '../../components/UserManagement/UserManagement';
import { audiog_options_sources } from './consts';

const audiosByLang = (lang) => audiog_options_sources.find(o => o.key === lang)?.value;

class GalaxyStream extends Component {
  constructor(props) {
    super();

    this.state = {
      janus: null,
      videostream: null,
      audio: null,
      videos: 1,
      audios: audiosByLang(props.lang),
      user: null,
      audioReady: false
    };

    this.audioElement            = new Audio();
    this.audioElement.volume     = 0.6;
    this.audioElement.autoplay   = true;
    this.audioElement.controls   = false;
    this.audioElement.muted      = true;
    this.audioElement.playinline = true;
  }

  componentDidMount() {
    this.initApp(this.props.user);
  }

  componentWillUnmount() {
    this.state.janus && this.state.janus.destroy();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.shidurOn != prevProps.shidurOn || this.state.audioReady != prevState.audioReady) {
      this.audioElement.muted = !this.props.shidurOn;
    }
  }

  initApp = (user) => {
    fetch(`${GEO_IP_INFO}`)
      .then((response) => {
        if (response.ok) {
          return response.json().then(
            info => {
              localStorage.setItem('gxy_extip', info.ip);
              this.setState({ user: { ...info, ...user } });
              api.setAccessToken(kc.token);
              api.fetchConfig()
                .then(data => GxyJanus.setGlobalConfig(data))
                .then(() => this.initJanus(info.country))
                .catch(err => {
                  console.error('[GalaxyStream] error initializing app', err);
                  this.setState({ appInitError: err });
                });
            }
          );
        } else {
          this.setState({ appInitError: 'Error fetching geo info' });
        }
      })
      .catch(ex => console.log(`get geoInfo`, ex));
  };

  initJanus = (country) => {
    if (this.state.janus)
      this.state.janus.destroy();

    // const gateway = country === "IL" ? 'str4' : 'str3';
    const streamingGateways = GxyJanus.gatewayNames('streaming');
    const gateway           = streamingGateways[Math.floor(Math.random() * streamingGateways.length)];
    const config            = GxyJanus.instanceConfig(gateway);

    Janus.init({
      debug: process.env.NODE_ENV !== 'production' ? ['log', 'error'] : ['error'],
      callback: () => {
        let janus = new Janus({
          server: config.url,
          iceServers: config.iceServers,
          success: () => {
            Janus.log(' :: Connected to JANUS');
            this.setState({ janus });
            this.initVideoStream(janus);
            this.initAudioStream(janus);
          },
          error: (error) => {
            Janus.error(error);
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          },
          destroyed: () => {
            Janus.error('kill');
          }
        });
      }
    });
  };

  initVideoStream = (janus) => {
    let { videos } = this.state;
    janus.attach({
      plugin: 'janus.plugin.streaming',
      opaqueId: 'videostream-' + Janus.randomString(12),
      success: (videostream) => {
        Janus.log(videostream);
        this.setState({ videostream });
        videostream.send({ message: { request: 'watch', id: videos } });
      },
      error: (error) => {
        Janus.log('Error attaching plugin: ' + error);
      },
      iceState: (state) => {
        Janus.log('ICE state changed to ' + state);
      },
      webrtcState: (on) => {
        Janus.log('Janus says our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
      },
      slowLink: (uplink, lost, mid) => {
        Janus.log('Janus reports problems ' + (uplink ? 'sending' : 'receiving') +
          ' packets on mid ' + mid + ' (' + lost + ' lost packets)');
      },
      onmessage: (msg, jsep) => {
        this.onStreamingMessage(this.state.videostream, msg, jsep, false);
      },
      onremotetrack: (track, mid, on) => {
        Janus.debug(' ::: Got a remote video track event :::');
        Janus.debug('Remote video track (mid=' + mid + ') ' + (on ? 'added' : 'removed') + ':', track);
        if (!on) return;
        let stream = new MediaStream();
        stream.addTrack(track.clone());
        this.setState({ video_stream: stream });
        Janus.log('Created remote video stream:', stream);
        let video = this.refs.remoteVideo;
        Janus.attachMediaStream(video, stream);
      },
      oncleanup: () => {
        Janus.log('Got a cleanup notification');
      }
    });
  };

  initAudioStream = (janus) => {
    janus.attach({
      plugin: 'janus.plugin.streaming',
      opaqueId: 'audiostream-' + Janus.randomString(12),
      success: (audioJanusStream) => {
        this.audioJanusStream = audioJanusStream;
        audioJanusStream.send({ message: { request: 'watch', id: 2 } });
      },
      error: (error) => {
        Janus.log('Error attaching plugin: ' + error);
      },
      iceState: (state) => {
        Janus.log('ICE state changed to ' + state);
      },
      webrtcState: (on) => {
        Janus.log('Janus says our WebRTC PeerConnection is ' + (on ? 'up' : 'down') + ' now');
      },
      slowLink: (uplink, lost, mid) => {
        Janus.log('Janus reports problems ' + (uplink ? 'sending' : 'receiving') +
          ' packets on mid ' + mid + ' (' + lost + ' lost packets)');
      },
      onmessage: (msg, jsep) => {
        this.onStreamingMessage(this.audioJanusStream, msg, jsep, false);
      },
      onremotetrack: (track, mid, on) => {
        Janus.log(' ::: Got a remote audio track event :::');
        Janus.log('Remote audio track (mid=' + mid + ') ' + (on ? 'added' : 'removed') + ':', track);
        if (!on) {
          return;
        }
        let stream = new MediaStream();
        stream.addTrack(track.clone());
        this.audioMediaStream = stream;
        Janus.attachMediaStream(this.audioElement, stream);
        this.setState({ audioReady: true });
        this.audioElement.muted = !this.props.shidurOn;
      },
      oncleanup: () => {
        Janus.log('Got a cleanup notification - audiostream.');
        const callbacks                     = [...this.audioJanusStreamCleanup];
        this.audioJanusStreamCleanup.length = 0;
        callbacks.forEach(callback => callback());
      }
    });
  };

  setVideo = (videos) => {
    this.setState({ videos });
    this.state.videostream.send({ message: { request: 'switch', id: videos } });
  };

  onStreamingMessage = (handle, msg, jsep, initdata) => {
    Janus.log(`Got a message ${JSON.stringify(msg)}`);

    if (handle !== null && jsep !== undefined && jsep !== null) {
      Janus.log('Handling SDP as well...', jsep);

      // Answer
      handle.createAnswer({
        jsep: jsep,
        media: { audioSend: false, videoSend: false, data: initdata },
        success: (jsep) => {
          Janus.log('Got SDP!', jsep);
          handle.send({ message: { request: 'start' }, jsep: jsep });
        },
        customizeSdp: (jsep) => {
          Janus.log(':: Modify original SDP: ', jsep);
          jsep.sdp = jsep.sdp.replace(/a=fmtp:111 minptime=10;useinbandfec=1\r\n/g, 'a=fmtp:111 minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1\r\n');
        },
        error: (error) => {
          Janus.log('WebRTC error: ' + error);
        }
      });
    }
  };

  toggleAudio = (muted) => this.audioElement.muted = muted;

  render() {
    const { appInitError } = this.state;

    if (appInitError) {
      return (
        <Fragment>
          <h1>Error Initializing Application</h1>
          {`${appInitError}`}
        </Fragment>
      );
    }

    return (
      <div>
        <video
          ref="remoteVideo"
          id="remoteVideo"
          width="100%"
          height="100%"
          autoPlay={true}
          controls={false}
          muted={true}
          playsInline={true} />
      </div>
    );
  }
}

export default GalaxyStream;



