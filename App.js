import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  StatusBar,
  BackHandler,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';

const LANCERTUBE_URL = 'https://laparoscopylancers.com/lancertube/';

export default function App() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#e94560" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: LANCERTUBE_URL }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        thirdPartyCookiesEnabled={true}
        originWhitelist={['*']}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36"
        injectedJavaScriptBeforeContentLoaded={`
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.head.appendChild(meta);
          true;
        `}
        injectedJavaScript={`
          function fixLayout() {
            const style = document.createElement('style');
            style.innerHTML = \`
              html, body { overflow-x: hidden !important; max-width: 100vw !important; }
              * { max-width: 100vw !important; box-sizing: border-box !important; }
              video { width: 100vw !important; max-width: 100vw !important; height: auto !important; object-fit: cover !important; }
              .elementor-video-container, .elementor-widget-video, .wp-video-shortcode { width: 100% !important; max-width: 100% !important; }
            \`;
            document.head.appendChild(style);
            document.querySelectorAll('video').forEach(v => {
              v.style.width = '100vw';
              v.style.maxWidth = '100vw';
              v.style.height = 'auto';
            });
          }
          fixLayout();
          window.addEventListener('load', fixLayout);
          setTimeout(fixLayout, 1000);
          setTimeout(fixLayout, 3000);
          true;
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  webview: { flex: 1 },
  loaderContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    zIndex: 10,
  },
});
