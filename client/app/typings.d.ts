// TODO: Fix TS compiler error. Improve tsProjectFn.
// It should reference definitions from ./tsd_typings directly
/// <reference path="../tools/typings/tsd/tsd.d.ts" />
/// <reference path="../tools/typings/ng2_test.d.ts" />
/// <reference path="../tools/typings/ng2_testing_workaround.d.ts" />

declare var io : {
    connect(url: string): Socket;
} 
interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
    emit(event: string, data: any, func : Function);
    disconnect();
}

// Type definitions for WebRTC
// Project: http://dev.w3.org/2011/webrtc/
// Definitions by: Ken Smith <https://github.com/smithkl42/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// Taken from http://dev.w3.org/2011/webrtc/editor/getusermedia.html
// version: W3C Editor's Draft 29 June 2015
// Type definitions for es6-promise
// Project: https://github.com/jakearchibald/ES6-Promise
// Definitions by: François de Campredon <https://github.com/fdecampredon/>, vvakame <https://github.com/vvakame>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module 'es6-promise' {
	var foo: typeof Promise; // Temp variable to reference Promise in local context
	module rsvp {
		export var Promise: typeof foo;
	}
	export = rsvp;
}

interface ConstrainBooleanParameters {
    exact: boolean;
    ideal: boolean;
}

interface NumberRange {
    max: number;
    min: number;
}

interface ConstrainNumberRange extends NumberRange {
    exact: number;
    ideal: number;
}

interface ConstrainStringParameters {
    exact: string | string[];
    ideal: string | string[];
}

interface MediaStreamConstraints {
    video?: boolean | MediaTrackConstraints;
    audio?: boolean | MediaTrackConstraints;
}

declare module W3C {
    type LongRange = NumberRange;
    type DoubleRange = NumberRange;
    type ConstrainBoolean = boolean | ConstrainBooleanParameters;
    type ConstrainNumber = number | ConstrainNumberRange;
    type ConstrainLong = ConstrainNumber;
    type ConstrainDouble = ConstrainNumber;
    type ConstrainString = string | string[] | ConstrainStringParameters;
}

interface MediaTrackConstraints extends MediaTrackConstraintSet {
    advanced?: MediaTrackConstraintSet[];
}

interface MediaTrackConstraintSet {
    width?: W3C.ConstrainLong;
    height?: W3C.ConstrainLong;
    aspectRatio?: W3C.ConstrainDouble;
    frameRate?: W3C.ConstrainDouble;
    facingMode?: W3C.ConstrainString;
    volume?: W3C.ConstrainDouble;
    sampleRate?: W3C.ConstrainLong;
    sampleSize?: W3C.ConstrainLong;
    echoCancellation?: W3C.ConstrainBoolean;
    latency?: W3C.ConstrainDouble;
    deviceId?: W3C.ConstrainString;
    groupId?: W3C.ConstrainString;
}

interface MediaTrackSupportedConstraints {
    width: boolean;
    height: boolean;
    aspectRatio: boolean;
    frameRate: boolean;
    facingMode: boolean;
    volume: boolean;
    sampleRate: boolean;
    sampleSize: boolean;
    echoCancellation: boolean;
    latency: boolean;
    deviceId: boolean;
    groupId: boolean;
}

interface MediaStream extends EventTarget {
    id: string;
    active: boolean;
    
    onactive: EventListener;
    oninactive: EventListener;
    onaddtrack: (event: MediaStreamTrackEvent) => any;
    onremovetrack: (event: MediaStreamTrackEvent) => any;
    
    clone(): MediaStream;
    stop(): void;
    
    getAudioTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
    getTracks(): MediaStreamTrack[];
    
    getTrackById(trackId: string): MediaStreamTrack;
    
    addTrack(track: MediaStreamTrack): void;
    removeTrack(track: MediaStreamTrack): void;
}

interface MediaStreamTrackEvent extends Event {
    track: MediaStreamTrack;
}

declare enum MediaStreamTrackState {
	"live",
    "ended"
}

interface MediaStreamTrack extends EventTarget {
    id: string;
    kind: string;
    label: string;
    enabled: boolean;
    muted: boolean;
    remote: boolean;
    readyState: MediaStreamTrackState;
    
    onmute: EventListener;
    onunmute: EventListener;
    onended: EventListener;
    onoverconstrained: EventListener;
    
    clone(): MediaStreamTrack;
    
    stop(): void;
    
    getCapabilities(): MediaTrackCapabilities;
    getConstraints(): MediaTrackConstraints;
    getSettings(): MediaTrackSettings;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;
}

interface MediaTrackCapabilities {
    width: number | W3C.LongRange;
    height: number | W3C.LongRange;
    aspectRatio: number | W3C.DoubleRange;
    frameRate: number | W3C.DoubleRange;
    facingMode: string;
    volume: number | W3C.DoubleRange;
    sampleRate: number | W3C.LongRange;
    sampleSize: number | W3C.LongRange;
    echoCancellation: boolean[];
    latency: number | W3C.DoubleRange;
    deviceId: string;
    groupId: string;
}

interface MediaTrackSettings {
    width: number;
    height: number;
    aspectRatio: number;
    frameRate: number;
    facingMode: string;
    volume: number;
    sampleRate: number;
    sampleSize: number;
    echoCancellation: boolean;
    latency: number;
    deviceId: string;
    groupId: string;
}

interface MediaStreamError {
    name: string;
    message: string;
    constraintName: string;
}

interface NavigatorGetUserMedia {
    (constraints: MediaStreamConstraints,
     successCallback: (stream: MediaStream) => void,
     errorCallback: (error: MediaStreamError) => void): void;
}

interface Navigator {
    getUserMedia: NavigatorGetUserMedia;
    
    webkitGetUserMedia: NavigatorGetUserMedia;
    
    mozGetUserMedia: NavigatorGetUserMedia;
    
    msGetUserMedia: NavigatorGetUserMedia;
    
    mediaDevices: MediaDevices;
}

interface MediaDevices {
    getSupportedConstraints(): MediaTrackSupportedConstraints;

    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
    enumerateDevices(): Promise<MediaDeviceInfo[]>;
}

interface MediaDeviceInfo {
    label: string;
    id: string;
    kind: string;
    facing: string;
}

// Type definitions for WebRTC
// Project: http://dev.w3.org/2011/webrtc/
// Definitions by: Ken Smith <https://github.com/smithkl42/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
//
// Definitions taken from http://dev.w3.org/2011/webrtc/editor/webrtc.html
//
// For example code see:
//   https://code.google.com/p/webrtc/source/browse/stable/samples/js/apprtc/js/main.js
//
// For a generic implementation see that deals with browser differences, see:
//   https://code.google.com/p/webrtc/source/browse/stable/samples/js/base/adapter.js

/// <reference path='MediaStream.d.ts' />

// TODO(1): Get Typescript to have string-enum types as WebRtc is full of string
// enums.
// https://typescript.codeplex.com/discussions/549207

// TODO(2): get Typescript to have union types as WebRtc uses them.
// https://typescript.codeplex.com/workitem/1364

interface RTCConfiguration {
  iceServers: RTCIceServer[];
}
declare var RTCConfiguration: {
  prototype: RTCConfiguration;
  new (): RTCConfiguration;
};

interface RTCIceServer {
  url: string;
  credential?: string;
}
declare var RTCIceServer: {
  prototype: RTCIceServer;
  new (): RTCIceServer;
};

// moz (Firefox) specific prefixes.
interface mozRTCPeerConnection extends RTCPeerConnection {
}
declare var mozRTCPeerConnection: {
  prototype: mozRTCPeerConnection;
  new (settings: RTCPeerConnectionConfig,
       constraints?:RTCMediaConstraints): mozRTCPeerConnection;
};
// webkit (Chrome) specific prefixes.
interface webkitRTCPeerConnection extends RTCPeerConnection {
}
declare var webkitRTCPeerConnection: {
  prototype: webkitRTCPeerConnection;
  new (settings: RTCPeerConnectionConfig,
       constraints?:RTCMediaConstraints): webkitRTCPeerConnection;
};

// For Chrome, look at the code here:
// https://code.google.com/p/chromium/codesearch#chromium/src/third_party/libjingle/source/talk/app/webrtc/webrtcsession.cc&sq=package:chromium&dr=C&l=63
interface RTCOptionalMediaConstraint {
  // When true, will use DTLS/SCTP data channels
  DtlsSrtpKeyAgreement?: boolean;
  // When true will use Rtp-based data channels (depreicated)
  RtpDataChannels?: boolean;
}

// ks 12/20/12 - There's more here that doesn't seem to be documented very well yet.
// http://www.w3.org/TR/2013/WD-webrtc-20130910/
interface RTCMediaConstraints {
  mandatory?: RTCMediaOfferConstraints;
  optional?: RTCOptionalMediaConstraint[]
}

interface RTCMediaOfferConstraints {
  offerToReceiveAudio: boolean;
  offerToReceiveVideo: boolean;
}

interface RTCSessionDescriptionInit {
  type: string;  // RTCSdpType; See TODO(1)
  sdp: string;
}

interface RTCSessionDescription {
  type?: string;  // RTCSdpType; See TODO(1)
  sdp?: string;
}
declare var RTCSessionDescription: {
  prototype: RTCSessionDescription;
  new (descriptionInitDict?: RTCSessionDescriptionInit): RTCSessionDescription;
  // TODO: Add serializer.
  // See: http://dev.w3.org/2011/webrtc/editor/webrtc.html#idl-def-RTCSdpType)
};

interface webkitRTCSessionDescription extends RTCSessionDescription{
  type?: string;
  sdp?: string;
}
declare var webkitRTCSessionDescription: {
  prototype: webkitRTCSessionDescription;
  new (descriptionInitDict?: RTCSessionDescriptionInit): webkitRTCSessionDescription;
};

interface mozRTCSessionDescription extends RTCSessionDescription{
  type?: string;
  sdp?: string;
}
declare var mozRTCSessionDescription: {
  prototype: mozRTCSessionDescription;
  new (descriptionInitDict?: RTCSessionDescriptionInit): mozRTCSessionDescription;
};



interface RTCDataChannelInit {
  ordered             ?: boolean; // messages must be sent in-order.
  maxPacketLifeTime   ?: number;  // unsigned short
  maxRetransmits      ?: number;  // unsigned short
  protocol            ?: string;  // default = ''
  negotiated          ?: boolean; // default = false;
  id                  ?: number;  // unsigned short
}

// TODO(1)
declare enum RTCSdpType {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#rtcsdptype
  'offer',
  'pranswer',
  'answer'
}

interface RTCMessageEvent {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#event-datachannel-message
  // At present, this can be an: ArrayBuffer, a string, or a Blob.
  // See TODO(2)
  data: any;
}

// TODO(1)
declare enum RTCDataChannelState {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#idl-def-RTCDataChannelState
  'connecting',
  'open',
  'closing',
  'closed'
}

interface RTCDataChannel extends EventTarget {
  label: string;
  reliable: boolean;
  readyState: string; // RTCDataChannelState; see TODO(1)
  bufferedAmount: number;
  binaryType: string;

  onopen: (event: Event) => void;
  onerror: (event: Event) => void;
  onclose: (event: Event) => void;
  onmessage: (event: RTCMessageEvent) => void;

  close(): void;

  send(data: string): void ;
  send(data: ArrayBuffer): void;
  send(data: ArrayBufferView): void;
  send(data: Blob): void;
}
declare var RTCDataChannel: {
  prototype: RTCDataChannel;
  new (): RTCDataChannel;
};

interface RTCDataChannelEvent extends Event {
  channel: RTCDataChannel;
}
declare var RTCDataChannelEvent: {
  prototype: RTCDataChannelEvent;
  new (eventInitDict: RTCDataChannelEventInit): RTCDataChannelEvent;
};

interface RTCIceCandidateEvent extends Event {
  candidate: RTCIceCandidate;
}

interface RTCMediaStreamEvent extends Event {
  stream: MediaStream;
}

interface EventInit {
}

interface RTCDataChannelEventInit extends EventInit {
  channel: RTCDataChannel;
}

interface RTCVoidCallback {
  (): void;
}
interface RTCSessionDescriptionCallback {
  (sdp: RTCSessionDescription): void;
}
interface RTCPeerConnectionErrorCallback {
  (errorInformation: DOMError): void;
}

// TODO(1)
declare enum RTCIceGatheringState {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#rtcicegatheringstate-enum
  'new',
  'gathering',
  'complete'
}

// TODO(1)
declare enum RTCIceConnectionState {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#idl-def-RTCIceConnectionState
  'new',
  'checking',
  'connected',
  'completed',
  'failed',
  'disconnected',
  'closed'
}

// TODO(1)
declare enum RTCSignalingState {
  // http://dev.w3.org/2011/webrtc/editor/webrtc.html#idl-def-RTCSignalingState
  'stable',
  'have-local-offer',
  'have-remote-offer',
  'have-local-pranswer',
  'have-remote-pranswer',
  'closed'
}

// This is based on the current implementation of WebRtc in Chrome; the spec is
// a little unclear on this.
// http://dev.w3.org/2011/webrtc/editor/webrtc.html#idl-def-RTCStatsReport
interface RTCStatsReport {
  stat(id: string): string;
}

interface RTCStatsCallback {
  (report: RTCStatsReport): void;
}

interface RTCPeerConnection {
  createOffer(successCallback: RTCSessionDescriptionCallback,
              failureCallback?: RTCPeerConnectionErrorCallback,
              constraints?: RTCMediaConstraints): void;
  createAnswer(successCallback: RTCSessionDescriptionCallback,
               failureCallback?: RTCPeerConnectionErrorCallback,
               constraints?: RTCMediaConstraints): void;
  setLocalDescription(description: RTCSessionDescription,
                      successCallback?: RTCVoidCallback,
                      failureCallback?: RTCPeerConnectionErrorCallback): void;
  localDescription: RTCSessionDescription;
  setRemoteDescription(description: RTCSessionDescription,
                        successCallback?: RTCVoidCallback,
                        failureCallback?: RTCPeerConnectionErrorCallback): void;
  remoteDescription: RTCSessionDescription;
  signalingState: string; // RTCSignalingState; see TODO(1)
  updateIce(configuration?: RTCConfiguration,
            constraints?: RTCMediaConstraints): void;
  addIceCandidate(candidate:RTCIceCandidate,
                  successCallback:() => void,
                  failureCallback:RTCPeerConnectionErrorCallback): void;
  iceGatheringState: string;  // RTCIceGatheringState; see TODO(1)
  iceConnectionState: string;  // RTCIceConnectionState; see TODO(1)
  getLocalStreams(): MediaStream[];
  getRemoteStreams(): MediaStream[];
  createDataChannel(label?: string,
                    dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
  ondatachannel: (event: Event) => void;
  addStream(stream: MediaStream, constraints?: RTCMediaConstraints): void;
  removeStream(stream: MediaStream): void;
  close(): void;
  onnegotiationneeded: (event: Event) => void;
  onconnecting: (event: Event) => void;
  onopen: (event: Event) => void;
  onaddstream: (event: RTCMediaStreamEvent) => void;
  onremovestream: (event: RTCMediaStreamEvent) => void;
  onstatechange: (event: Event) => void;
  oniceconnectionstatechange: (event: Event) => void;
  onicecandidate: (event: RTCIceCandidateEvent) => void;
  onidentityresult: (event: Event) => void;
  onsignalingstatechange: (event: Event) => void;
  getStats: (successCallback: RTCStatsCallback,
             failureCallback: RTCPeerConnectionErrorCallback) => void;
}
declare var RTCPeerConnection: {
  prototype: RTCPeerConnection;
  new (configuration: RTCConfiguration,
       constraints?: RTCMediaConstraints): RTCPeerConnection;
  new(options : any) : RTCPeerConnection;
};

interface RTCIceCandidate {
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}
declare var RTCIceCandidate: {
  prototype: RTCIceCandidate;
  new (candidateInitDict?: RTCIceCandidate): RTCIceCandidate;
};

interface webkitRTCIceCandidate extends RTCIceCandidate {
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}
declare var webkitRTCIceCandidate: {
  prototype: webkitRTCIceCandidate;
  new (candidateInitDict?: webkitRTCIceCandidate): webkitRTCIceCandidate;
};

interface mozRTCIceCandidate extends RTCIceCandidate {
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}
declare var mozRTCIceCandidate: {
  prototype: mozRTCIceCandidate;
  new (candidateInitDict?: mozRTCIceCandidate): mozRTCIceCandidate;
};

interface RTCIceCandidateInit {
  candidate: string;
  sdpMid: string;
  sdpMLineIndex: number;
}
declare var RTCIceCandidateInit:{
  prototype: RTCIceCandidateInit;
  new (): RTCIceCandidateInit;
};

interface PeerConnectionIceEvent {
  peer: RTCPeerConnection;
  candidate: RTCIceCandidate;
}
declare var PeerConnectionIceEvent: {
  prototype: PeerConnectionIceEvent;
  new (): PeerConnectionIceEvent;
};

interface RTCPeerConnectionConfig {
  iceServers: RTCIceServer[];
}
declare var RTCPeerConnectionConfig: {
  prototype: RTCPeerConnectionConfig;
  new (): RTCPeerConnectionConfig;
};

interface Window{
  RTCPeerConnection: RTCPeerConnection;
  webkitRTCPeerConnection: webkitRTCPeerConnection;
  mozRTCPeerConnection: mozRTCPeerConnection;
  RTCSessionDescription: RTCSessionDescription;
  webkitRTCSessionDescription: webkitRTCSessionDescription;
  mozRTCSessionDescription: mozRTCSessionDescription;
  RTCIceCandidate: RTCIceCandidate;
  webkitRTCIceCandidate: webkitRTCIceCandidate;
  mozRTCIceCandidate: mozRTCIceCandidate;
}