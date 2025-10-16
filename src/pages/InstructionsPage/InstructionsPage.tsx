import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import tokens from '../../../tokens.json';

export default function InstructionsPage() {
  let videoEl: HTMLVideoElement | null = null;
  const [progress, setProgress] = React.useState(0);
  const [watched, setWatched] = React.useState(false);
  const navigate = useNavigate();

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoEl = el;
  };

  const handleTimeUpdate = () => {
    const v = videoEl;
    if (!v) return;
    const pct = (v.currentTime / Math.max(v.duration, 1)) * 100;
    setProgress(Math.floor(pct));
  };

  const handleEnded = () => {
    setWatched(true);
    setProgress(100);
  };

  const handleNext = () => {
    if (!watched) return;
    // navigate to the personality page by default
    navigate('/DemographicForm/Personality');
  };

  const accent = tokens?.colors?.accent ?? '#2563eb';
  const muted = tokens?.colors?.muted ?? '#f1f5f9';
  const surface = tokens?.colors?.surface ?? '#f8fafc';

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg text-text">
      <div
        className="w-full max-w-6xl bg-surface rounded-lg shadow-md p-6 border border-muted"
        style={{ backgroundColor: surface }}
      >
        <h1 className="text-2xl font-bold mb-4">Bevezető videó</h1>

        <div className="mb-6 flex justify-center">
          <div className="w-full" style={{ maxWidth: 1100 }}>
            <video
              ref={setVideoRef}
              src="/video.mp4"
              controls
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              className="w-full rounded-md bg-black"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '65vh',
                display: 'block',
                borderRadius: '0.5rem',
                backgroundColor: '#000',
              }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="flex-shrink-0">
            <button
              disabled={!watched}
              onClick={handleNext}
              aria-disabled={!watched}
              className={`px-4 py-2 rounded-md font-semibold text-white transition-colors disabled:opacity-60`}
              style={{ backgroundColor: watched ? accent : muted }}
            >
              {watched ? 'Tovább a tesztre' : 'Nézze meg a videót'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
