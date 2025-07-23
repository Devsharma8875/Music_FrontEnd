
import React, { useEffect, useState } from "react";
import "./CustomPlayer.css";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { BsFullscreen } from "react-icons/bs";

const CustomPlayer = ({
  songId,
  playerRef,
  songsInfo,
  isLoading,
  activeToggle,
  playerState,
  setPlayerState,
  setAudioLoading,
  autoPlay,
  handleNext,
  setAlertMessage,
}) => {
  const handleFullscreenToggle = () => {
    if (playerRef.current) {
      if (!document.fullscreenElement) {
        playerRef.current.wrapper.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
          setAlertMessage("Unable to change fullscreen mode");
        });
      } else {
        document.exitFullscreen().catch((err) => {
          console.error(
            `Error attempting to exit fullscreen mode: ${err.message} (${err.name})`
          );
          setAlertMessage("Unable to change exit mode");
        });
      }
    }
  };

  return (
    <div
      className={`player-song-image-wrapper ${
        !songsInfo[0]?.snippet.thumbnails?.maxres ? "small-hq-image" : ""
      }`}
    >
      {/* Thumbnail Image */}
      {!isLoading && songsInfo.length ? (
        <img
          src={
            songsInfo[0]?.snippet.thumbnails?.maxres
              ? `https://i.ytimg.com/vi/${songId}/maxresdefault.jpg`
              : `https://i.ytimg.com/vi/${songId}/hqdefault.jpg`
          }
          alt="song-poster"
          className="player-song-image"
        />
      ) : (
        <SkeletonTheme
          baseColor="#747070"
          highlightColor="#615e5e"
          duration={2}
        >
          <Skeleton height={"200px"} />
        </SkeletonTheme>
      )}

      {/* ReactPlayer for audio/video */}
      <ReactPlayer
        url={
          activeToggle === "audio" || activeToggle === "video"
            ? `https://www.youtube.com/watch?v=${songId}`
            : null
        }
        ref={playerRef}
        volume={playerState.volume}
        onReady={() => setAudioLoading(false)}
        playing={playerState.playing}
        onPlay={() => setPlayerState({ ...playerState, playing: true })}
        onPause={() => setPlayerState({ ...playerState, playing: false })}
        width={activeToggle === "video" ? "100%" : "0px"}
        height={activeToggle === "video" ? "100%" : "0px"}
        style={{
          position: activeToggle === "video" ? "absolute" : "absolute",
          top: "0px",
          transform: activeToggle === "video" ? "scale(1.01)" : "scale(0)",
          display: activeToggle === "video" ? "block" : "none",
        }}
        onProgress={(state) =>
          setPlayerState({
            ...playerState,
            played: state.played,
            loaded: state.loaded,
          })
        }
        onEnded={() => (autoPlay ? handleNext() : null)}
        onError={(e) => {
          console.log(e?.target?.error);
          if (
            e?.target?.error?.code === 4 ||
            !e?.target?.error?.message?.length
          ) {
            setPlayerState({ ...playerState, url: null });
            if (activeToggle === "audio") {
              setAlertMessage("Try reloading or switching to video.");
            }
          }
        }}
      />

      {/* Fullscreen Button (only for video) */}
      {activeToggle === "video" && (
        <button
          type="button"
          title="fullScreen"
          className="fullscreen-btn absolute-center"
          onClick={handleFullscreenToggle}
        >
          <BsFullscreen size={18} />
        </button>
      )}
    </div>
  );
};

export default CustomPlayer;
