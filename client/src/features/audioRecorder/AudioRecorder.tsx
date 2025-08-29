import React, { useRef, useState } from 'react';
import { Button } from '../../shared/ui/Button/Button';
import { sendAudioForTranslate } from '../../entities/speach/api';

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setTranslated(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      setAudioBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };


  const handleTranslate = async () => {
    if (!audioBlob) return;
    setLoading(true);
    setTranslated(null);
    try {
      const result = await sendAudioForTranslate(audioBlob);
      setTranslated(result.translated);
    } catch (e) {
      setTranslated('Ошибка при переводе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', minWidth: 350 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 48 }}>
        <Button onClick={startRecording} disabled={recording} color="#4f8cff" type="button">Start</Button>
        <Button onClick={stopRecording} disabled={!recording} color="#ff4f4f" type="button">Stop</Button>
        <Button onClick={handleTranslate} disabled={!audioBlob || loading} color="#ffc94f" type="button">Translate</Button>
        <span style={{ color: recording ? 'red' : 'transparent', fontWeight: 700, marginLeft: 8, transition: 'color 0.2s', minWidth: 90 }}>
          ● Recording...
        </span>
      </div>
      <div style={{ minHeight: 40, width: '100%' }}>
        {audioUrl && (
          <audio src={audioUrl} controls style={{ marginTop: 8, width: '100%' }} />
        )}
      </div>
      <div style={{ minHeight: 28, width: '100%' }}>
        {loading && <div>Переводим...</div>}
        {!loading && translated && (
          <div style={{ marginTop: 8 }}>
            <b>Перевод:</b> {translated}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
