import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./page/home/Home";
import SearchResult from "./page/searchResult/SearchResult";
import PlaylistSongs from "./page/playlistSongs/PlaylistSongs";
import ScrollToTop from "./utils/ScrollToUp";
import PageNotFound from "./page/pageNotFound/PageNotFound";
import Trending from "./page/trending/Trending";
import Player from "./components/player/Player";
import Explore from "./page/explore/Explore";
import Header from "./components/header/Header";
import Feedback from "./page/feedback/Feedback";
import About from "./page/about/About";
import OfflineBanner from "./components/offlineBanner/OfflineBanner";
import Footer from "./components/footer/Footer";
import RedirectToOrigin from "./utils/RedirectToOrigin";
import ImportedPlaylist from "./page/importedPlaylist/ImportedPlaylist";

function App() {
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;

  // Handle offline status
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const OnlineRoute = ({ component: Component }) => {
    return !isOffline ? <Component /> : <OfflineBanner />;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<OnlineRoute component={Home} />} />
        <Route
          path="/:urlTitle/:playlistId"
          element={<OnlineRoute component={PlaylistSongs} />}
        />
        <Route
          path="/search/:q"
          element={<OnlineRoute component={SearchResult} />}
        />
        <Route
          path="/trending"
          element={<OnlineRoute component={Trending} />}
        />
        <Route path="/explore" element={<OnlineRoute component={Explore} />} />
        <Route
          path="/imported-playlist"
          element={<OnlineRoute component={ImportedPlaylist} />}
        />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
      {id && <Player />}
    </BrowserRouter>
  );
}

export default App;
