import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie";
const API_KEY = "14de32a8be1f00851f479285b73ccfc6";

export default function MovieDetails() {
  const { movie: movieId } = useLocalSearchParams();
  const router = useRouter();

  interface MovieData {
    title: string;
    poster_path: string;
    overview: string;
    popularity: number;
    release_date: string;
  }

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${MOVIE_BASE_URL}/${movieId}?api_key=${API_KEY}&language=en-US`,
        );
        const data = await response.json();

        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00897b" />
      </View>
    );
  }

  if (!movieData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Movie not found.</Text>
      </View>
    );
  }

  console.log("Movie data", movieData);

  return (
    <>
      <Stack.Screen options={{ title: movieData.title }} />

      {/* <ScrollView className="flex-1 p-6   bg-white "> */}
        <View className="p-6 items-center flex-col " style={{ gap: 40, marginTop: 40 }}>
          <Text className="text-2xl font-bold mb-4 text-center">
            {movieData.title}
          </Text>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
            }}
            style={{ width: 200, height: 200 }}
            className="mb-4"
            resizeMode="cover"
          />
          <Text className="text-gray-500 mb-4 px-5">
            {movieData.overview}
          </Text>
          <Text className="text-gray-500 ">
            Popularity: {movieData.popularity} | Release Date:{" "}
            {movieData.release_date}
          </Text>
        </View>
      {/* </ScrollView> */}
    </>
  );
}
