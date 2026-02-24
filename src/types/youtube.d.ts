declare namespace YT {
  interface PlayerOptions {
    height?: string | number
    width?: string | number
    videoId?: string
    host?: string
    playerVars?: PlayerVars
    events?: Events
  }

  interface PlayerVars {
    autoplay?: 0 | 1
    controls?: 0 | 1
    disablekb?: 0 | 1
    enablejsapi?: 0 | 1
    fs?: 0 | 1
    modestbranding?: 0 | 1
    origin?: string
    rel?: 0 | 1
    showinfo?: 0 | 1
    iv_load_policy?: 1 | 3
    playsinline?: 0 | 1
    cc_load_policy?: 0 | 1
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void
    onStateChange?: (event: OnStateChangeEvent) => void
    onError?: (event: OnErrorEvent) => void
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnStateChangeEvent {
    target: Player
    data: PlayerState
  }

  interface OnErrorEvent {
    target: Player
    data: number
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions)
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead?: boolean): void
    getPlayerState(): PlayerState
    getCurrentTime(): number
    getDuration(): number
    getVolume(): number
    setVolume(volume: number): void
    isMuted(): boolean
    mute(): void
    unMute(): void
    setPlaybackRate(rate: number): void
    getPlaybackRate(): number
    getAvailablePlaybackRates(): number[]
    getVideoLoadedFraction(): number
    loadVideoById(videoId: string, startSeconds?: number): void
    cueVideoById(videoId: string, startSeconds?: number): void
    getIframe(): HTMLIFrameElement
    destroy(): void
  }
}

interface Window {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: () => void
}
