import React from 'react';
import {
  SafeAreaView,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import { iVideo } from 'models/Movie';

const { width } = Dimensions.get('window');

export interface TrailerModalProps {
  visible: boolean;
  video: iVideo | null;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({
  visible,
  video,
  onClose,
}) => {
  if (!video) return null;

  const isYouTube = video.site === 'YouTube';
  const isVimeo = video.site === 'Vimeo';

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropOpacity={0.9}
      style={styles.modal}
    >
      <SafeAreaView style={styles.wrapper}>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeTxt}>✕</Text>
        </Pressable>

        {isYouTube ? (
          <YoutubeIframe
            width={width}
            height={(width * 9) / 16}
            play
            videoId={video.key}
            webViewProps={{ allowsFullscreenVideo: true }}
          />
        ) : isVimeo ? (
          <WebView
            style={styles.playerFull}
            source={{ uri: `https://player.vimeo.com/video/${video.key}` }}
            allowsFullscreenVideo
          />
        ) : (
          <Text style={{ color: 'white' }}>Video site not supported</Text>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default TrailerModal;

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'center' },
  wrapper: { backgroundColor: 'black', borderRadius: 8, overflow: 'hidden' },
  playerFull: { flex: 1 },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 2 },
  closeTxt: { color: 'white', fontSize: 26 },
});
