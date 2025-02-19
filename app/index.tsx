import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList, Text, ActivityIndicator } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_KEY } from "@env";

// import { API_KEY } from "@env";
// import Constants from "expo-constants";

const BASE_URL = "https://api.themoviedb.org/3/movie";

const OPTIONS = [
  { label: "Now Playing", value: "now_playing" },
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

export default function MoviesScreen() {
  const apiKey = process.env.EXPO_PRIVATE_API_KEY 

  console.log("API_KEY", API_KEY);
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState("popular");
  const [movies, setMovies] = useState<{ id: number; title: string; popularity: number; release_date: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // API からデータを取得
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/${selectedOption}?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedOption]);

  return (
    <Tabs.Container
      headerContainerStyle={{ paddingTop: insets.top }}
      renderHeader={() => (
        <View className="bg-white shadow-md p-4">
          {/* ドロップダウンメニュー */}
          <TouchableOpacity
            className="flex-row items-center justify-between border border-gray-300 px-3 py-2 rounded-md bg-white w-40"
            onPress={() => {}}
          >
            <Text className="text-base text-black">
              {OPTIONS.find((opt) => opt.value === selectedOption)?.label}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    >
      <Tabs.Tab name="Movies">
        <View className="p-4">
          {loading ? (
            <ActivityIndicator size="large" color="#00897b" />
          ) : (
            <FlatList
              data={movies}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="border-b border-gray-300 p-4">
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-sm text-gray-500">Popularity: {item.popularity}</Text>
                  <Text className="text-sm text-gray-500">Release Date: {item.release_date}</Text>
                </View>
              )}
            />
          )}
        </View>
      </Tabs.Tab>
      <Tabs.Tab name="Search Results">
        <View className="flex-1 justify-center items-center">
          <Text>Search Results will be implemented later.</Text>
        </View>
      </Tabs.Tab>
      <Tabs.Tab name="TV Shows">
        <View className="flex-1 justify-center items-center">
          <Text>TV Shows will be implemented later.</Text>
        </View>
      </Tabs.Tab>
    </Tabs.Container>
  );
}
