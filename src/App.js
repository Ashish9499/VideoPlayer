import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import YouTube from 'react-youtube';
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState([
    { id: 1, title: 'IronMan', videoId: 'tNjOtzy-0n4' },
    { id: 2, title: 'Euro 2022', videoId: 'BTSigJ9Plrg' },
    { id: 3, title: 'Video 3', videoId: 'xvFZjo5PgG0' }
  ]);
  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
    } else {
      playerRef.current.internalPlayer.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStateChange = (event) => {
    setCurrentTime(event.target.getCurrentTime());
    setDuration(event.target.getDuration());
  };

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    playerRef.current.internalPlayer.setPlaybackRate(speed);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    playerRef.current.internalPlayer.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylist(items);
  };

  return (
    <div className="app">
      <div className="video-container">
        <YouTube
          videoId={currentVideo.videoId}
          opts={{ width: '560', height: '315' }}
          onStateChange={handleStateChange}
          ref={playerRef}
        />
        <div className="controls">
          <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
          <input type="range" value={currentTime} max={duration} onChange={handleSeek} />
          <span>{`${currentTime.toFixed(2)} / ${duration.toFixed(2)}`}</span>
          <select value={playbackSpeed} onChange={handleSpeedChange}>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
      </div>
      <div className="playlist">
        <h2>Playlist</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {playlist.map((video, index) => (
                  <Draggable key={video.id} draggableId={video.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleVideoClick(video)}
                      >
                        {video.title}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
