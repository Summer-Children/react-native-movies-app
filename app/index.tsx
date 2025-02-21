import { useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import DropdownMenuMovies from "~/src/components/dropdown-menu-movies";
import { API_KEY, MOVIE_BASE_URL, TV_BASE_URL } from "@env";


// const MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie";
// const TV_BASE_URL = "https://api.themoviedb.org/3/tv";

export default function TabsScreen() {
  // General
  const apiKey = "14de32a8be1f00851f479285b73ccfc6";
  const [loading, setLoading] = useState(false);

  // For "1.Movies" tab
  const moviesOptions = [
    { label: "Now Playing", value: "now_playing" },
    { label: "Popular", value: "popular" },
    { label: "Top Rated", value: "top_rated" },
    { label: "Upcoming", value: "upcoming" },
  ];

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [value, setValue] = React.useState("movies");
  const [selectedMoviesOption, setSelectedMoviesOption] = useState("popular");
  const [movies, setMovies] = useState<
    {
      id: number;
      title?: string;
      name?: string;
      popularity: number;
      release_date?: string;
      poster_path?: string;
      profile_path?: string;
      known_for?: { poster_path?: string }[];
    }[]
  >([]);

  const fetchMovies = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${MOVIE_BASE_URL}/${category}?api_key=${apiKey}&language=en-US&page=1`,
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // For "2. Search Results" tab
  const [selectedSearchTypeOption, setSelectedSearchTypeOption] =
    useState("multi");
  const [searchQuery, setSearchQuery] = useState("");
  const [multi, setMulti] = useState([]);

  const searchTypeOptions = [
    { label: "Multi", value: "multi" },
    { label: "Movies", value: "movies" },
    { label: "TV", value: "tv" },
  ];

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const endpoint =
        selectedSearchTypeOption === "multi"
          ? "multi"
          : selectedSearchTypeOption === "tv"
          ? "tv"
          : "movie";

      const response = await fetch(
        `https://api.themoviedb.org/3/search/${endpoint}?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
          query,
        )}&page=1&include_adult=false`,
      );

      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // For "3. TV Shows" tab
  const tvShowsOptions = [
    { label: "Airing Today", value: "airing_today" },
    { label: "On the Air", value: "on_the_air" },
    { label: "Popular", value: "popular" },
    { label: "Tope Rated", value: "top_rated" },
  ];

  const [selectedTvShowsOption, setSelectedTvShowsOption] = useState("popular");
  const [tvShows, setTvShows] = useState<
    {
      id: number;
      name: string;
      poster_path?: string;
      popularity: number;
      first_air_date?: string;
    }[]
  >([]);

  const fetchTvShows = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(
         `${TV_BASE_URL}/${category}?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();
      
      console.log(`Fetched TV Shows for ${category}`, data.results)

      setTvShows(data.results || []);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  //General
  const router = useRouter();

  useEffect(() => {
    fetchMovies(selectedMoviesOption);
  }, [selectedMoviesOption]);

  useEffect(() => {
    fetchTvShows(selectedTvShowsOption);
  }, [selectedTvShowsOption]);

  return (
    <View className="flex-1  p-6">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="w-full max-w-[400px] mx-auto flex-col gap-1.5"
      >
        {/* Tab Header */}
        <TabsList className="flex-row w-full">
          <TabsTrigger value="movies" className="flex-1">
            <Text>Movies</Text>
          </TabsTrigger>
          <TabsTrigger value="search results" className="flex-2">
            <Text>Search Results</Text>
          </TabsTrigger>
          <TabsTrigger value="tv shows" className="flex-1">
            <Text>TV Shows</Text>
          </TabsTrigger>
        </TabsList>

        {/* 1_Movies */}
        <TabsContent value="movies" className="py-2">
          {/* Dropdown Menu */}
          <View className="flex items-center justify-center w-full">
            <DropdownMenuMovies
              widthPercentage={50}
              options={moviesOptions}
              selectedOption={selectedMoviesOption}
              setSelectedOption={setSelectedMoviesOption}
            />
          </View>

          {/* A list of fetched movies */}
          <View className="gap-1">
            {loading ? (
              <View className="flex-row items-center justify-center gap-2 py-4">
                <ActivityIndicator size="small" color="#00897b" />
                <Text className="text-gray-500 text-lg">Loading results</Text>
              </View>
            ) : (
              <FlatList
                data={movies}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) =>
                  item.id.toString() ||
                  item.name ||
                  `${item.popularity}` ||
                  `${item.id}`
                }
                renderItem={({ item }) => (
                  <View className="border-b border-gray-300 py-4 flex-row gap-4">
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${
                          item.poster_path || item.profile_path
                        }`,
                      }}
                      className="w-full h-full"
                      style={{ width: 100, height: 100 }}
                    />
                    <View className="flex-1 flex-col gap-1">
                      <Text className="text-lg font-semibold w-full">
                        {item.title || item.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Popularity: {item.popularity}
                      </Text>
                      {item.release_date && (
                        <Text className="text-sm text-gray-500">
                          Release Date: {item.release_date}
                        </Text>
                      )}
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#06B6D4",
                        }}
                        onPress={() => router.push(`/movie/${item.id}`)}
                      >
                        <Text style={{ color: "white" }}>More Details</Text>
                      </Button>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </TabsContent>

        {/* 2_Search Results */}
        <TabsContent value="search results">
          <View className="px-5">
            <Label>Search Movie/TV Show Name</Label>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <Label className="text-lg font-semibold">Choose Search Type</Label>
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <DropdownMenuMovies
                  options={searchTypeOptions}
                  selectedOption={selectedSearchTypeOption}
                  setSelectedOption={setSelectedSearchTypeOption}
                />
              </View>

              <Button
                onPress={() => fetchSearchResults(searchQuery)}
                style={{
                  backgroundColor: "#06B6D4",
                }}
                className="flex-row items-center gap-2"
              >
                <Search color="white" />
                <Text style={{ color: "white" }}>Search</Text>
              </Button>
            </View>
            <Text>Please select a search type</Text>
          </View>
          {/* a list of search results */}
          <View className="gap-1">
            {loading ? (
              <View className="flex-row items-center justify-center gap-2 py-4">
                <ActivityIndicator size="small" color="#00897b" />
                <Text className="text-gray-500 text-lg">Loading results</Text>
              </View>
            ) : (
              <FlatList
                data={movies}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const imagePath =
                    item.poster_path ||
                    item.profile_path ||
                    (item.known_for?.find((k) => k.poster_path)?.poster_path ??
                      null);

                  return (
                    <View className="border-b border-gray-300 py-4 flex-row gap-4">
                      <Image
                        source={{
                          uri: imagePath
                            ? `https://image.tmdb.org/t/p/w500${imagePath}`
                            : "https://via.placeholder.com/100",
                        }}
                        className="w-full h-full"
                        style={{ width: 100, height: 100 }}
                      />
                      <View className="flex-1 flex-col gap-1">
                        <Text className="text-lg font-semibold w-full">
                          {item.title ?? item.name ?? "Unknown"}
                        </Text>
                        {typeof item.popularity === "number" && (
                          <Text className="text-sm text-gray-500">
                            Popularity: {item.popularity.toFixed(2)}
                          </Text>
                        )}

                        <Text className="text-sm text-gray-500">
                          Release Date: {item.release_date}
                        </Text>
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: "#06B6D4",
                          }}
                          onPress={() => router.push(`/${item.id}`)}
                        >
                          <Text style={{ color: "white" }}>More Details</Text>
                        </Button>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </TabsContent>

        {/* 3_TV Shows */}
        <TabsContent value="tv shows">
          {/* Dropdown Menu */}
          <View className="flex items-center justify-center w-full">
            <DropdownMenuMovies
              widthPercentage={50}
              options={tvShowsOptions}
              selectedOption={selectedTvShowsOption}
              setSelectedOption={setSelectedTvShowsOption}
            />
          </View>

          {/* A list of fetched TV shows */}
          <View className="gap-1">
            {loading ? (
              <View className="flex-row items-center justify-center gap-2 py-4">
                <ActivityIndicator size="small" color="#00897b" />
                <Text className="text-gray-500 text-lg">Loading results</Text>
              </View>
            ) : (
              <FlatList
                data={tvShows}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) =>
                  item.id.toString() ||
                  item.name ||
                  `${item.popularity}` ||
                  `${item.id}`
                }
                renderItem={({ item }) => (
                  <View className="border-b border-gray-300 py-4 flex-row gap-4">
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                      }}
                      className="w-full h-full"
                      style={{ width: 100, height: 100 }}
                    />
                    <View className="flex-1 flex-col gap-1">
                      <Text className="text-lg font-semibold w-full">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Popularity: {item.popularity}
                      </Text>
                      {item.first_air_date && (
                        <Text className="text-sm text-gray-500">
                          Release Date: {item.first_air_date}
                        </Text>
                      )}
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#06B6D4",
                        }}
                        onPress={() => router.push(`/tv-show/${item.id}`)}
                      >
                        <Text style={{ color: "white" }}>More Details</Text>
                      </Button>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </TabsContent>
      </Tabs>
    </View>
  );
}
