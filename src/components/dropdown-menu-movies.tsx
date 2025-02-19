import React, { useState } from "react";
import { View, TouchableOpacity, Modal, FlatList, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CornerDownLeft } from "lucide-react-native";

const options = [
  { label: "Now Playing", value: "now_playing" },
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

export function DropdownMenuMovies() {
  const [selectedOption, setSelectedOption] = useState("popular");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setModalVisible(false);
  };

  console.log(isModalVisible);

  return (
    <View className="w-full px-4">
      <TouchableOpacity
        onPress={() => {
          console.log("Before:", isModalVisible);
          setModalVisible(true);
          console.log("After:", isModalVisible);
        }}
      >
        <Text className="text-base text-black">
          {options.find((opt) => opt.value === selectedOption)?.label}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* モーダルの背景（タップで閉じる） */}
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 bg-black/40"
          onPress={() => setModalVisible(false)}
        />

        {/* 画面下部に固定されたモーダルコンテンツ */}
        <View className="absolute bottom-0 left-0 right-0 bg-white py-3 rounded-t-2xl">
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`px-4 py-3 ${
                  item.value === selectedOption ? "bg-teal-500" : "bg-white"
                }`}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  className={`text-lg text-center ${
                    item.value === selectedOption ? "text-white" : "text-black"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

export default DropdownMenuMovies;
