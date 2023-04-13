export const soundLists = {
  success: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3',
  faild: 'https://notificationsounds.com/storage/sounds/file-sounds-1137-eventually.mp3',
  update: 'https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3',
  warning: 'https://notificationsounds.com/storage/sounds/file-sounds-1133-anxious.mp3',
  error: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/error.mp3',
};

const useAudio = (url: RequestInfo | URL) => {
  const context = new window.AudioContext();
  fetch(url)
    // Read it into memory as an arrayBuffer
    .then((response) => response.arrayBuffer())
    // Turn it from mp3/aac/whatever into raw audio data
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      // Now we're ready to play!
      const soundSource = context.createBufferSource();
      soundSource.buffer = audioBuffer;
      soundSource.connect(context.destination);
      soundSource.start();
    });
};

export default useAudio;
