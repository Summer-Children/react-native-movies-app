import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { MaterialIcons } from "@expo/vector-icons";

const BASE_URL = "https://api.themoviedb.org/3/movie";

const OPTIONS = [
  { label: "Now Playing", value: "now_playing" },
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

export default function MoviesScreen() {
  const apiKey = "14de32a8be1f00851f479285b73ccfc6";
  const [selectedOption, setSelectedOption] = useState("popular");
  const [movies, setMovies] = useState<
    { id: number; title: string; popularity: number; release_date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // API からデータを取得
  const fetchMovies = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/${category}?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(selectedOption);
  }, [selectedOption]);

  return (
    <Tabs.Container>
      <Tabs.Tab name="Movies">
      <Tabs.ScrollView keyboardShouldPersistTaps="handled">
        <View className="p-4">
          {/* ドロップダウンメニュー (リストの直前に表示) */}
          <TouchableOpacity
            className="flex-row items-center justify-between border border-gray-300 px-3 py-2 rounded-md bg-white w-40 mb-4"
            onPress={() => setDropdownVisible(true)}
          >
            <Text className="text-base text-black">
              {OPTIONS.find((opt) => opt.value === selectedOption)?.label}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>

          {/* ドロップダウンモーダル */}
          <Modal
            transparent={true}
            visible={isDropdownVisible}
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <TouchableOpacity
              className="absolute bottom-0 right-0 left-0 bg-black bg-opacity-50 flex-1"
              onPress={() => setDropdownVisible(false)}
            >
              <View className="bg-white rounded-t-lg p-4 shadow-lg">
                {OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`p-3 border-b border-gray-300 rounded-md ${
                      selectedOption === option.value
                        ? "bg-green-500 text-white"
                        : "bg-white text-black"
                    }`}
                    onPress={() => {
                      setSelectedOption(option.value);
                      setDropdownVisible(false);
                      fetchMovies(option.value);
                    }}
                  >
                    <Text
                      className={`text-lg ${
                        selectedOption === option.value ? "text-white" : "text-black"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* 映画リスト */}
          {loading ? (
            <ActivityIndicator size="large" color="#00897b" />
          ) : (
            <FlatList
              data={movies}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="border-b border-gray-300 p-4">
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-sm text-gray-500">
                    Popularity: {item.popularity}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Release Date: {item.release_date}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
        </Tabs.ScrollView>
      </Tabs.Tab>

      <Tabs.Tab name="Search Results">
        <View className="p-4">
          <Text className="text-lg">Search Results .</Text>
        </View>

      </Tabs.Tab>

      <Tabs.Tab name="TV shows">
        <View className="p-4">
          <Text className="text-lg">TV shows .</Text>
        </View>
      </Tabs.Tab>
    </Tabs.Container>
  );
}
