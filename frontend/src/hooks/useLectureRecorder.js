import { useState } from 'react';

export const useLectureRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRecording = () => {
    setIsRecording(true);
    // Logic for media stream API would go here
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return { isRecording, duration, startRecording, stopRecording };
};