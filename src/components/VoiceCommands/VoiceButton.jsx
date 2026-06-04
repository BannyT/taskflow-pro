import { useState } from 'react';
import VoiceInput from './VoiceInput';
import './VoiceButton.css';

function VoiceButton({ onTaskCreated }) {
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Keyboard shortcut: Cmd/Ctrl + V
  useState(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        setShowVoiceModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button className="voice-btn" onClick={() => setShowVoiceModal(true)}>
        <span className="mic-icon">🎙️</span>
        <span className="voice-text">Voice Task</span>
        <span className="shortcut">⌘V</span>
      </button>

      {showVoiceModal && (
        <VoiceInput
          onTaskCreated={onTaskCreated}
          onClose={() => setShowVoiceModal(false)}
        />
      )}
    </>
  );
}

export default VoiceButton;