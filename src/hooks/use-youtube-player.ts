'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * YouTube IFrame API audio player.
 * Loads the IFrame API once, creates a hidden YT player, and exposes play/pause/seek controls.
 * This is the legal way to play YouTube audio without downloading the file.
 */

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return apiPromise;
}

export interface YouTubePlayerState {
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  muted: boolean;
}

export function useYouTubePlayer(videoId: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [state, setState] = useState<YouTubePlayerState>({
    ready: false,
    playing: false,
    currentTime: 0,
    duration: 0,
    muted: false,
  });
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    loadYouTubeAPI().then(() => {
      if (!mounted || !containerRef.current) return;
      // Clear any previous player
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: '0',
        height: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: videoId, // required for loop
        },
        events: {
          onReady: () => {
            if (!mounted) return;
            setState((s) => ({ ...s, ready: true, duration: playerRef.current?.getDuration?.() ?? 0 }));
            // Try to mute-and-play to satisfy autoplay policies
            try {
              playerRef.current?.mute();
              setState((s) => ({ ...s, muted: true }));
            } catch {}
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (!mounted || !YT) return;
            const isPlaying = e.data === YT.PlayerState.PLAYING;
            const isPaused = e.data === YT.PlayerState.PAUSED;
            const isEnded = e.data === YT.PlayerState.ENDED;
            setState((s) => ({
              ...s,
              playing: isPlaying,
              duration: playerRef.current?.getDuration?.() ?? s.duration,
            }));
            if (isEnded) {
              try { playerRef.current?.seekTo(0, true); playerRef.current?.playVideo(); } catch {}
            }
            void isPaused;
          },
        },
      });
    });
    return () => {
      mounted = false;
      if (pollRef.current) clearInterval(pollRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, [videoId]);

  // Poll current time
  useEffect(() => {
    if (!state.ready) return;
    pollRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        setState((s) => ({
          ...s,
          currentTime: playerRef.current.getCurrentTime() ?? s.currentTime,
          duration: playerRef.current.getDuration() ?? s.duration,
        }));
      } catch {}
    }, 1000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state.ready]);

  const play = useCallback(() => {
    try { playerRef.current?.playVideo(); } catch {}
  }, []);
  const pause = useCallback(() => {
    try { playerRef.current?.pauseVideo(); } catch {}
  }, []);
  const seek = useCallback((seconds: number) => {
    try { playerRef.current?.seekTo(seconds, true); } catch {}
  }, []);
  const mute = useCallback(() => {
    try { playerRef.current?.mute(); setState((s) => ({ ...s, muted: true })); } catch {}
  }, []);
  const unMute = useCallback(() => {
    try { playerRef.current?.unMute(); setState((s) => ({ ...s, muted: false })); } catch {}
  }, []);
  const setVolume = useCallback((v: number) => {
    try { playerRef.current?.setVolume(v); } catch {}
  }, []);

  return { state, containerRef, play, pause, seek, mute, unMute, setVolume };
}
