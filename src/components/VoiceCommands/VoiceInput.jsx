import { useState, useEffect } from 'react';
import './VoiceInput.css';

function VoiceInput({ onTaskCreated, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event) => {
      let interim = '';
      let final = '';
      let lastConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
          lastConfidence = result[0].confidence;
        } else {
          interim += result[0].transcript;
        }
      }
      
      setTranscript(final);
      setInterimTranscript(interim);
      setConfidence(lastConfidence);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setInterimTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const parseTaskFromText = (text) => {
    // Default task object
    const task = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null
    };

    // Extract title (first sentence or until keywords)
    const titleMatch = text.match(/^([^.!?]+)/);
    if (titleMatch) {
      task.title = titleMatch[1].trim();
    }

    // Check for priority keywords
    if (text.match(/high priority|urgent|important|asap/i)) {
      task.priority = 'high';
    } else if (text.match(/low priority|not urgent|whenever/i)) {
      task.priority = 'low';
    }

    // Extract due date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (text.match(/tomorrow|tmr|next day/i)) {
      task.dueDate = tomorrow.toISOString().split('T')[0];
    } else if (text.match(/today|now|asap/i)) {
      task.dueDate = today.toISOString().split('T')[0];
    } else {
      // Try to extract specific date
      const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        const year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear();
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          task.dueDate = date.toISOString().split('T')[0];
        }
      }
    }

    // Extract description (everything after title)
    const descriptionMatch = text.match(/[^.!?]+[.!?](.*)/s);
    if (descriptionMatch && descriptionMatch[1]) {
      task.description = descriptionMatch[1].trim();
    }

    return task;
  };

  const createTask = () => {
    if (transcript) {
      const task = parseTaskFromText(transcript);
      if (task.title) {
        onTaskCreated(task);
        stopListening();
        onClose();
      } else {
        alert('Could not understand the task. Please try again.');
      }
    }
  };

  const sampleCommands = [
    "Buy groceries tomorrow",
    "Finish project report high priority",
    "Call dentist on 12/25",
    "Review pull request today"
  ];

  if (!supported) {
    return (
      <div className="voice-modal">
        <div className="voice-container">
          <div className="voice-header">
            <h3>🎙️ Voice Commands</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="voice-body">
            <div className="not-supported">
              <p>Sorry, your browser doesn't support voice recognition.</p>
              <p>Please use Chrome, Edge, or Safari.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-modal">
      <div className="voice-container">
        <div className="voice-header">
          <h3>🎙️ Voice Command</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="voice-body">
          <div className={`mic-container ${isListening ? 'listening' : ''}`}>
            <button 
              className={`mic-btn ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? '⏹️ Stop' : '🎤 Start'}
            </button>
            {isListening && (
              <div className="pulse-ring">
                <div className="pulse"></div>
                <div className="pulse delay-1"></div>
                <div className="pulse delay-2"></div>
              </div>
            )}
          </div>

          <div className="transcript-container">
            <div className="transcript-label">What you said:</div>
            <div className="transcript">
              {transcript || interimTranscript || "Click 'Start' and speak..."}
            </div>
            {interimTranscript && transcript && (
              <div className="interim">Still listening: {interimTranscript}</div>
            )}
            {confidence > 0 && (
              <div className="confidence">
                Confidence: {Math.round(confidence * 100)}%
              </div>
            )}
          </div>

          {transcript && (
            <div className="parsed-task">
              <div className="parsed-label">📝 Task Preview:</div>
              <div className="task-preview">
                <div><strong>Title:</strong> {parseTaskFromText(transcript).title || '—'}</div>
                <div><strong>Priority:</strong> {parseTaskFromText(transcript).priority}</div>
                <div><strong>Due Date:</strong> {parseTaskFromText(transcript).dueDate || '—'}</div>
                <div><strong>Description:</strong> {parseTaskFromText(transcript).description || '—'}</div>
              </div>
            </div>
          )}

          <div className="sample-commands">
            <div className="sample-label">Try saying:</div>
            <div className="sample-buttons">
              {sampleCommands.map((cmd, i) => (
                <button key={i} className="sample-btn" onClick={() => {
                  setTranscript(cmd);
                  setInterimTranscript('');
                }}>
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>

          {transcript && (
            <button className="create-task-btn" onClick={createTask}>
              ✨ Create Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceInput;