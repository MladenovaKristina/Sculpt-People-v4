import Model from '../../../data/model';
import ConfigurableParams from '../../../data/configurable_params';

export default class SoundsController {
  constructor() {
    if (!SoundsController.instance) SoundsController.instance = this;
    else return SoundsController.instance;

    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    this.context = new AudioContext();

    this.globalVolume = 1;
    this.needDelayBeforeInitialization = true;

    console.log()

    this.sounds = {
      bg: {
        earlyInit: true,
        play: false,
        needPlay: ConfigurableParams.getData()['audio']['sound_bg_enabled']['value'],
        playMany: false,
        loop: true,
        src: ConfigurableParams.getData()['audio']['sound_bg']['value'],
        source: null,
        AudioBuffer: null
      },
      win: {
        earlyInit: true,
        play: false,
        needPlay: false,
        playMany: true,
        loop: false,
        src: ConfigurableParams.getData()['audio']['sound_final']['value'],
        source: null,
        AudioBuffer: null
      }
    }

    this.data2buffer = function (data) {
      let byteString = atob(data.split(',')[1])
      let len = byteString.length;
      let buffer = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        buffer[i] = byteString.charCodeAt(i);
      }
      return buffer.buffer;
    };

    this._ready = false;
    window.isSoundsControllerReady = () => {

      if (this._ready) {
        return true;
      } else {
        return false;
      }

    };
    window.mute = () => {
      Model.mute = true;
      SoundsController.pauseAll();
    };
    window.unmute = () => {
      Model.mute = false;
      SoundsController.continueAll();
    };
  }

  initializationEarly() {
    if (Model.soundEarlyInitializationComplete) return;

    try {
      Model.soundEarlyInitializationComplete = true;
      this.context.resume();

      for (const key in this.sounds) {
        let obj = this.sounds[key];

        if (obj.AudioBuffer !== null || !obj.earlyInit) {
          continue;
        }

        this.context.decodeAudioData(this.data2buffer(obj.src), (buffer) => {
          obj.AudioBuffer = buffer;
        });

        setTimeout(() => {
          if (obj.AudioBuffer) {
            Model.soundEarlyInitializationComplete = true;
            if (obj.needPlay) this.playWithKey(key);

          }
          else {
            setTimeout(() => {
              Model.soundEarlyInitializationComplete = false;
              obj.AudioBuffer = null;
              this.initializationEarly();
            }, 1000);
          }
        }, 1000);
      }

      this._ready = true;
    } catch (error) {
      this._ready = false;
      setTimeout(() => {
        Model.soundEarlyInitializationComplete = false;
        obj.AudioBuffer = null;
        this.initialization();
      }, 1000);
    }
  }

  initialization() {
    if (Model.soundInitializationComplete) return;

    try {
      Model.soundInitializationComplete = true;
      if (!Model.soundEarlyInitializationComplete) this.context.resume();

      for (const key in this.sounds) {
        let obj = this.sounds[key];

        if (obj.AudioBuffer !== null) {
          continue;
        }

        this.context.decodeAudioData(this.data2buffer(obj.src), (buffer) => {
          obj.AudioBuffer = buffer;
        });

        setTimeout(() => {
          if (obj.AudioBuffer) {
            Model.soundInitializationComplete = true;

            if (obj.needPlay) this.playWithKey(key);
          }
          else {

            setTimeout(() => {
              Model.soundInitializationComplete = false;
              this.initialization();
            }, 1000);
          }
        }, 1000);
      }

      this._ready = true;
    } catch (error) {
      this._ready = false;
      setTimeout(() => {
        Model.soundInitializationComplete = false;
        this.initialization();
      }, 1000);
    }
  }

  playWithKey(key) {
    try {
      if (!Model.mute) {
        let obj = this.sounds[key];

        if (obj.playMany) {
          this.playArrayWithKey(obj);
          return;
        }

        if (!obj.AudioBuffer) return;
        if (obj.play) return;

        obj.play = true;
        obj.source = this.context.createBufferSource();
        obj.source.buffer = obj.AudioBuffer;
        obj.source.connect(this.context.destination);

        const gainNode = this.context.createGain();
        gainNode.gain.value = this.globalVolume;
        gainNode.connect(this.context.destination);
        obj.source.connect(gainNode);

        if (obj.loop) {
          obj.source.loop = true;
        }
        else {
          obj.source.loop = false;
        }

        obj.source.start(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  playArrayWithKey(obj) {
    try {
      if (!Model.mute) {
        if (!obj.AudioBuffer) return;
        obj.play = true;

        let newSource = this.context.createBufferSource();
        newSource.buffer = obj.AudioBuffer;
        newSource.connect(this.context.destination);

        const gainNode = this.context.createGain();
        gainNode.gain.value = this.globalVolume;
        gainNode.connect(this.context.destination);
        newSource.connect(gainNode);

        if (obj.loop) {
          newSource.loop = true;
        } else {
          newSource.loop = false;
        }

        newSource.start(0);

        if (obj.source === null) {
          obj.source = [];
        } else {
          obj.source.push(newSource);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    try {
      for (const key in this.sounds) {

        this.stopWithKey(key);

      }
    } catch (error) {
      console.log(error);
    }
  }

  stopWithKey(key) {
    try {
      let obj = this.sounds[key];

      if (!obj.AudioBuffer) return;
      if (!obj.play) return;

      obj.play = false;
      obj.source.stop();
    } catch (error) {
      console.log(error);
    }
  }

  pauseAll() {
    try {
      // console.log("PAUSE ALL");

      for (const key in this.sounds) {

        this.pauseWithKey(key);

      }
    } catch (error) {
      console.log(error);
    }
  }

  pauseWithKey(key) {
    let obj = this.sounds[key];

    if (!obj.AudioBuffer) return;
    if (!obj.play) return;

    obj.play = false;

    try {
      if (obj.playMany) {
        obj.source = [];
      }
      else {
        obj.source.context.suspend();
      }
    } catch (error) {

      setTimeout(() => {
        obj.play = true;
        this.pauseWithKey(key);
      }, 1000);
    };
  }

  continueAll() {
    try {
      if (!Model.mute) {
        for (const key in this.sounds) {
          this.continueWithKey(key);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  continueWithKey(key) {
    if (!Model.mute) {
      let obj = this.sounds[key];

      if (!obj.AudioBuffer) return;
      if (obj.play) return;

      try {
        if (!obj.playMany) {
          obj.play = true;
          obj.source.context.resume();
        }
      } catch (error) {
        setTimeout(() => {
          obj.play = false;
          this.continueWithKey(key);
        }, 1000);
      };
    }
  }

  update() { }
}

SoundsController.playWithKey = function (key) {
  SoundsController.instance.playWithKey(key);
}

SoundsController.stopWithKey = function (key) {
  SoundsController.instance.stopWithKey(key);
}

SoundsController.pauseWithKey = function (key) {
  SoundsController.instance.pauseWithKey(key);
}

SoundsController.pauseAll = function () {
  SoundsController.instance.pauseAll();
}

SoundsController.continueAll = function () {
  SoundsController.instance.continueAll();
}

SoundsController.initialization = function () {
  SoundsController.instance.initialization();
}

SoundsController.initializationEarly = function () {
  SoundsController.instance.initializationEarly();
}

SoundsController.instance = null;