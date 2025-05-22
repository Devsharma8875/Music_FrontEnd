import React from "react";
import "./ExploreList.css";
import ExploreCard from "../exploreCard/ExploreCard";
import ExploreCardSkeleton from "../exploreCard/ExploreCardSkeleton";
import { useGetMyplaylistInfoQuery } from "../../reduxtool/services/myApi";
import { useGetPlaylistQuery } from "../../reduxtool/services/songsApi";

const ExploreList = ({ playlistId, serverType }) => {
  const { data, isLoading } =
    serverType === "myServer"
      ? useGetMyplaylistInfoQuery()
      : useGetPlaylistQuery(playlistId);

  return (
    <div className="explore-list-container">
      {isLoading ? (
        <ExploreCardSkeleton amount={5} />
      ) : serverType === "myServer" ? (
        data?.localPlaylistsInfo?.length ? (
          data.localPlaylistsInfo.map((playlist, index) => (
            <div key={index} className="explore-card-wrapper">
              <h2>{playlist?.playlistTitle}</h2>
              <div className="explore-card-list">
                {playlist.data.map((item) => (
                  <ExploreCard
                    key={item.playlistId}
                    playlistId={item.playlistId}
                    title={item.title}
                    poster={item.poster}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>No playlists found</div>
        )
      ) : data?.items?.length ? (
        <div className="explore-card-list">
          {data.items.map((item) => (
            <ExploreCard
              key={item.id}
              playlistId={item.id}
              title={item.snippet.title}
              poster={item.snippet.thumbnails.standard.url}
              description={item.snippet.description}
            />
          ))}
        </div>
      ) : (
        <div>No items found</div>
      )}
    </div>
  );
};

export default ExploreList;
