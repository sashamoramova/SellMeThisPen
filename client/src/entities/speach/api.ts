const API_URL = import.meta.env.VITE_API;

export async function sendAudioForTranslate(audioBlob: Blob): Promise<{ text: string; translated: string }> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');

  const response = await fetch(`${API_URL}/speach/translate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to translate audio');
  }

  return response.json();
}
