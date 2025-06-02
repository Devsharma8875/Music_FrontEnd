import React, { useEffect, useRef, useState } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addSongInfo } from "../../../reduxtool/slice/currentSongSlice";
import "./RelatedSongs.css";
import RelatedSongsSkeleton from "./RelatedSongsSkeleton";
import { useGetRelatedSongsQuery } from "../../../reduxtool/services/myApi";

const RelatedSongs = ({ songsList, setSongsList }) => {
  const dispatch = useDispatch();
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;
  const [isUpClick, setIsUpClick] = useState(false);
  const upNextRef = useRef();

  const { data, isLoading, isError, error, refetch } = useGetRelatedSongsQuery(
    id,
    {
      skip: !id,
    }
  );

  // Format duration from seconds to HH:MM:SS or MM:SS
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    console.log("Related songs API data:", data); // <-- Add this
    if (data) {
      const transformedData = data.songs.map((song, index) => ({
        index,
        videoId: song.id,
        title: song.title,
        thumbnails: song.thumbnail,
        length: song.duration,
        artistInfo: {
          artist: [{ text: song.author || "Unknown Artist" }],
        },
      }));
      setSongsList(transformedData);
    }
  }, [data, setSongsList]);

  const handleRedirect = (videoId) => {
    const song = songsList.find((s) => s.videoId === videoId);
    if (song) {
      dispatch(
        addSongInfo({
          ...currentSong,
          id: videoId,
          title: song.title,
          artist: song.artistInfo.artist[0]?.text,
        })
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (upNextRef.current && !upNextRef.current.contains(e.target)) {
        setIsUpClick(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="related-songs-section">
      <h3 className="relate-songs-heading">Up Next Songs</h3>
      <div
        className="relate-songs-heading mobile-next cur-pointer"
        ref={upNextRef}
        onClick={() => setIsUpClick(!isUpClick)}
      >
        Up Next Songs
      </div>

      <div
        className={`related-songs-container ${
          isUpClick ? "related-songs-mobile" : ""
        }`}
      >
        {isLoading ? (
          <RelatedSongsSkeleton amount={6} />
        ) : (
          <>
            {songsList?.length ? (
              songsList.map(
                ({ videoId, index, thumbnails, title, length, artistInfo }) => (
                  <button
                    key={`${videoId}-${index}`}
                    type="button"
                    className={`related-songs-info-wrapper cur-pointer ${
                      id === videoId ? "active-song" : ""
                    }`}
                    onClick={() => handleRedirect(videoId)}
                    aria-current={id === videoId ? "true" : undefined}
                  >
                    <div className="related-songs-image-wrapper">
                      <img
                        src={thumbnails}
                        alt={title}
                        className="related-songs-image"
                        loading="lazy"
                      />
                      {id === videoId && (
                        <div className="playing-status-wrapper">
                          <BsPlayCircleFill />
                        </div>
                      )}
                      <small className="song-time-length">{length}</small>
                    </div>
                    <div className="related-songs-title-channel-wrapper">
                      <p className="related-songs-title-wrapper" title={title}>
                        {title}
                      </p>
                      <p className="related-songs-channel-wrapper">
                        • {artistInfo.artist[0]?.text}
                      </p>
                    </div>
                  </button>
                )
              )
            ) : (
              <div className="related-songs-error-wrapper">
                <p className="sorry-emoji">😢</p>
                <p>Sorry! Not able to fetch related songs</p>
                {isError && (
                  <p className="error-message">
                    Error: {error?.data?.error || "Unknown error occurred"}
                  </p>
                )}
                <button
                  type="button"
                  className="cur-pointer refetch-button"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Refetch"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RelatedSongs;
