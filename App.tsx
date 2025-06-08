import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  fetchGenreMap,
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchMovieVideos,
} from 'api/fetchMovies';
import { iMovie, HeroSectionProps, MovieCardProps, MovieRowProps, iVideo } from 'models/Movie';
import { mockMovies } from 'models/MockedData';
import TrailerModal from 'components/TrailerModal';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

const { width: screenWidth } = Dimensions.get('window');

export const CinemaNowLogo = () => (
  <View style={styles.logoContainer}>
    <Image source={require('./assets/CINEMANOW.png')} style={styles.logoImage} />
  </View>
);

const MovieCard = ({
  movie,
  isLarge = false,
  onSelect,
}: MovieCardProps & { onSelect: (m: iMovie) => void }) => {
  const cardWidth = isLarge ? 140 : 110;
  const cardHeight = isLarge ? 200 : 160;

  return (
    <TouchableOpacity
      onPress={() => onSelect(movie)}
      style={[styles.movieCard, { width: cardWidth }]}
    >
      <Image
        source={{ uri: movie.poster }}
        style={[styles.poster, { width: cardWidth, height: cardHeight }]}
        resizeMode="cover"
      />
      <Text style={[styles.movieTitle, { width: cardWidth }]} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={[styles.movieGenre, { width: cardWidth }]} numberOfLines={1}>
        {movie.genre}
      </Text>
    </TouchableOpacity>
  );
};

const MovieRow = ({
  title,
  movies,
  isLarge = false,
  onSelect,
}: MovieRowProps & { onSelect: (m: iMovie) => void }) => (
  <View style={styles.movieRow}>
    <Text style={styles.rowTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} isLarge={isLarge} onSelect={onSelect} />
      ))}
    </ScrollView>
  </View>
);

const HeroSection = ({ movie }: HeroSectionProps) => (
  <View style={styles.heroContainer}>
    <TouchableOpacity activeOpacity={0.8}>

    <Image
      source={require('./assets/strangerthinghy.jpg')}
      style={styles.heroImage}
      resizeMode="cover"
      />
      </TouchableOpacity>
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000']}
      style={styles.heroGradient}
      >
      <Text style={styles.heroTitle}>{movie.title}</Text>

      {movie.rating && movie.description && (
        <>
          <View style={styles.heroInfo}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{movie.rating}</Text>
            </View>
            <Text style={styles.heroYear}>{movie.year}</Text>
            <Text style={styles.heroBullet}>•</Text>
            <Text style={styles.heroGenre} numberOfLines={1}>
              {movie.genre}
            </Text>
          </View>

          <Text style={styles.heroDescription} numberOfLines={3}>
            {movie.description}
          </Text>
        </>
      )}

      <View style={styles.heroButtons}>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>▶ Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>+ My List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>ℹ Info</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

const App = () => {
  const heroMovie: iMovie = mockMovies[0];
  const [popular, setPopular] = useState<iMovie[]>([]);
  const [trending, setTrending] = useState<iMovie[]>([]);
  const [continueWatching, setContinueWatching] = useState<iMovie[]>([]);
  const [video, setVideo] = useState<iVideo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const genres = await fetchGenreMap();
      const [pop, trend] = await Promise.all([
        fetchPopularMovies(genres),
        fetchTrendingMovies(genres),
      ]);
      setPopular(pop);
      setTrending(trend);
      setContinueWatching(pop.slice(5, 10));
    };
    load();
  }, []);

  const handleSelectMovie = async (movie: iMovie) => {
    try {
      const vids = await fetchMovieVideos(movie.id);
      const vid =
        vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
        vids[0] ||
        null;
      if (vid) {
        setVideo(vid);
        setShowModal(true);
      }
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <CinemaNowLogo />
        <HeroSection movie={heroMovie} />
        <View style={styles.content}>
          <MovieRow
            title="Continue Watching"
            movies={continueWatching}
            isLarge
            onSelect={handleSelectMovie}
          />
          <MovieRow
            title="Trending Now"
            movies={trending}
            onSelect={handleSelectMovie}
          />
          <MovieRow
            title="Popular on CinemaNow"
            movies={popular}
            onSelect={handleSelectMovie}
          />
          <MovieRow
            title="CinemaNow Originals"
            movies={[...continueWatching].reverse()}
            isLarge
            onSelect={handleSelectMovie}
          />
        </View>
      </ScrollView>
      <TrailerModal
        visible={showModal}
        video={video}
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { flex: 1 },
  logoContainer: { alignItems: 'center', paddingVertical: 16 },
  logoImage: { width: 190, height: 40 },
  heroContainer: { position: 'relative', marginBottom: 32 },
  heroImage: { width: screenWidth, height: 400, opacity: 0.4 },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  heroInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ratingBadge: {
    backgroundColor: '#ebd234',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  ratingText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  heroYear: { color: '#ccc', fontSize: 14 },
  heroBullet: { color: '#ccc', fontSize: 14, marginHorizontal: 8 },
  heroGenre: { color: '#ccc', fontSize: 14, flex: 1 },
  heroDescription: { color: '#e5e5e5', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  heroButtons: { flexDirection: 'row', gap: 12 },
  playButton: {
    backgroundColor: 'white',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: { color: 'black', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: '#404040',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  movieRow: { marginBottom: 32 },
  rowTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', margin: 16 },
  movieCard: { marginLeft: 16 },
  poster: { borderRadius: 8 },
  movieTitle: { color: 'white', fontSize: 14, fontWeight: '600', marginTop: 8 },
  movieGenre: { color: '#999', fontSize: 12, marginTop: 4 },
  content: { paddingBottom: 40 },
});
