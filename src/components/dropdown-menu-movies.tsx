import { MaterialIcons } from "@expo/vector-icons";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";


interface DropdownMenuMoviesProps {
  widthPercentage?: number;
  options: { label: string; value: string }[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
}

export function DropdownMenuMovies({
  widthPercentage,
  options,
  selectedOption,
  setSelectedOption,
}: DropdownMenuMoviesProps) {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setModalVisible(false);
  };

  return (
    <View className="w-full ">
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        className="self-stretch flex-row items-center justify-between px-3 py-1  rounded-sm  "
        style={{ width: widthPercentage ? `${widthPercentage}%` : undefined, borderWidth: 1, borderColor: "lightgrey" }}
      >
        <Text className="text-base text-gray-600">
          {options.find((opt) => opt.value === selectedOption)?.label}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={16} color="grey" />
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
          className="flex-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} 
          onPress={() => setModalVisible(false)}
        />

        {/* 画面下部に固定されたモーダルコンテンツ */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-lg px-2 py-4">
          <FlatList
            className="py-4 rounded-lg"
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`flex-row items-center gap-4 px-8 py-2 rounded-md ${
                  item.value === selectedOption ? "bg-green-500 " : "bg-white "
                }`}
                onPress={() => handleSelect(item.value)}
              >
                <Text
                  className={` ${
                    item.value === selectedOption
                      ? " text-white"
                      : " text-black"
                  }`}
                >
                  {item.label}
                </Text>

                {item.value === selectedOption && (
                  <Check size={24} color="white" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

export default DropdownMenuMovies;
