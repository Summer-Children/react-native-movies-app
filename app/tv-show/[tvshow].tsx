import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const TV_BASE_URL = "https://api.themoviedb.org/3/tv";
const API_KEY = "14de32a8be1f00851f479285b73ccfc6";

export default function TvShowDetails() {
  const { tvshow: tvShowId } = useLocalSearchParams();

  interface TvShowData {
    name: string;
    poster_path: string;
    overview: string;
    popularity: number;
    first_air_date: string;
  }

  const [tvShowData, setTvShowData] = useState<TvShowData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tvShowId) return;

    const fetchTvShowDetails = async () => {
      try {
        const response = await fetch(
          `${TV_BASE_URL}/${tvShowId}?api_key=${API_KEY}&language=en-US`,
        );
        const data = await response.json();
        setTvShowData(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvShowDetails();
  }, [tvShowId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00897b" />
      </View>
    );
  }

  if (!tvShowData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">TV show not found.</Text>
      </View>
    );
  }

  console.log("TV Show data", tvShowData);

  return (
    <>
      <Stack.Screen options={{ title: tvShowData.name }} />
        <View className="p-6 items-center flex-col " style={{ gap: 40, marginTop: 40 }}>
          <Text className="text-2xl font-bold mb-4 text-center">
            {tvShowData.name}
          </Text>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${tvShowData.poster_path}`,
            }}
            style={{ width: 200, height: 200 }}
            className="mb-4"
            resizeMode="cover"
          />
          <Text className="text-gray-500 mb-4 px-5">
            {tvShowData.overview}
          </Text>
          <Text className="text-gray-500 ">
            Popularity: {tvShowData.popularity} | Release Date:{" "}
            {tvShowData.first_air_date}
          </Text>
        </View>
    </>
  );
}
