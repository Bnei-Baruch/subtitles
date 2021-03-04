import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import GalaxyStream from './GalaxyStream';
import { SubtitlesContainer } from '../subtitles/SubtitlesContainer';

class VirtualStreaming extends Component {

  state = {
    room: Number(localStorage.getItem('room')) || null,
    user: {},
    cssFixInterval: null,
    talking: false
  };

  componentDidMount() {
    this.setState({ cssFixInterval: setInterval(() => this.cssFix(), 500) });
  };

  cssFix() {
    const d = document.getElementsByClassName('controls__dropdown');
    if (d) {
      const o = document.getElementById('video0');
      if (o) {
        Array.from(d).forEach(x => {
          x.style.maxHeight = `${o.offsetHeight - 50}px`;
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.cssFixInterval) {
      clearInterval(this.state.cssFixInterval);
    }
  };

  render() {
    const { playerLang, user } = this.props;

    return (
      <div className="video video--broadcast" key='v0' id='video0'>
        <div className="video__overlay">
          <div className={`activities`}>
            <div className="controls">

            </div>
            <SubtitlesContainer layout={'equal'} playerLang={playerLang} />
          </div>
        </div>
        <div className='mediaplayer'>
          <GalaxyStream user={user} />
        </div>
      </div>
    );
  }
}

export default withTranslation()(VirtualStreaming);
