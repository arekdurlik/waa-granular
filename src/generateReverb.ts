/* eslint-disable no-var */
type GenerateReverbParams = {
  numChannels: number
  fadeInTime: number
  decayTime: number
  sampleRate: number
  lpFreqStart: number
  lpFreqEnd: number,
}

declare global {
  interface Window {
    filterNode: BiquadFilterNode
  }
}

//https://github.com/adelespinasse/reverbGen/blob/master/reverbgen.js
/** Generates a reverb impulse response.
        @param {!Object} params TODO: Document the properties.
        @param {!function(!AudioBuffer)} callback Function to call when
          the impulse response has been generated. The impulse response
          is passed to this function as its parameter. May be called
          immediately within the current execution context, or later. */
export const generateReverb = function(audioContext: AudioContext, params: GenerateReverbParams, callback: Function) {
  var sampleRate = params.sampleRate || 44100;
  var numChannels = params.numChannels || 2;
  // params.decayTime is the -60dB fade time. We let it go 50% longer to get to -90dB.
  var totalTime = params.decayTime * 1.5;
  var decaySampleFrames = Math.round(params.decayTime * sampleRate);
  var numSampleFrames = Math.round(totalTime * sampleRate);
  var fadeInSampleFrames = Math.round((params.fadeInTime || 0) * sampleRate);
  // 60dB is a factor of 1 million in power, or 1000 in amplitude.
  var decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
  var reverbIR = audioContext.createBuffer(numChannels, numSampleFrames, sampleRate);
  for (var i = 0; i < numChannels; i++) {
    var chan = reverbIR.getChannelData(i);
    for (var j = 0; j < numSampleFrames; j++) {
      chan[j] = randomSample() * Math.pow(decayBase, j);
    }
    for (var j = 0; j < fadeInSampleFrames; j++) {
      chan[j] *= (j / fadeInSampleFrames);
    }
  }

  applyGradualLowpass(reverbIR, params.lpFreqStart || 0, params.lpFreqEnd || 0, params.decayTime, callback);
}

/** Applies a constantly changing lowpass filter to the given sound.
  @private
  @param {!AudioBuffer} input
  @param {number} lpFreqStart
  @param {number} lpFreqEnd
  @param {number} lpFreqEndAt
  @param {!function(!AudioBuffer)} callback May be called
  immediately within the current execution context, or later.*/
var applyGradualLowpass = function(input: AudioBuffer, lpFreqStart: number, lpFreqEnd: number, lpFreqEndAt: number, callback: Function) {
  if (lpFreqStart == 0) {
    callback(input);
    return;
  }
  var channelData = getAllChannelData(input);
  var context = new OfflineAudioContext(input.numberOfChannels, channelData[0].length, input.sampleRate);
  var player = context.createBufferSource();
  player.buffer = input;
  var filter = context.createBiquadFilter();

  lpFreqStart = Math.min(lpFreqStart, input.sampleRate / 2);
  lpFreqEnd = Math.min(lpFreqEnd, input.sampleRate / 2);

  filter.type = "lowpass";
  filter.Q.value = 0.0001;
  filter.frequency.setValueAtTime(lpFreqStart, 0);
  filter.frequency.linearRampToValueAtTime(lpFreqEnd, lpFreqEndAt);

  player.connect(filter);
  filter.connect(context.destination);
  player.start();
  context.oncomplete = function(event) {
    callback(event.renderedBuffer);
  };
  context.startRendering();

  window.filterNode = filter;
};

  /** @private
  @param {!AudioBuffer} buffer
  @return {!Array.<!Float32Array>} An array containing the Float32Array of each channel's samples. */
  var getAllChannelData = function(buffer: AudioBuffer) {
    var channels = [];
    for (var i = 0; i < buffer.numberOfChannels; i++) {
      channels[i] = buffer.getChannelData(i);
    }
    return channels;
  };

  /** @private
      @return {number} A random number from -1 to 1. */
  var randomSample = function() {
    return Math.random() * 2 - 1;
  };