import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React from "react";
import { StoreWithStateProps, Tables } from "@/types";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import { useGetStores } from "@/api/store";
import PersonalStoreFront from "@/components/common/PersonalStoreFront";
import SearchBar from "@/components/common/SearchBar";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StoresScreen = () => {
  const { data, isLoading, refetch } = useGetStores();
  const [stores, setStores] = React.useState<StoreWithStateProps[] | []>([]);
  const [search, setSearch] = React.useState("");
  const onChangeSearch = (query: string) => setSearch(query);

  const getData = React.useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem("filterStoreData");
      if (value !== null) {
        if (JSON.parse(value).length > 0) {
          // value previously stored
          const alreadyFilter = JSON.parse(value);
          const arrayOfIds = alreadyFilter.map((obj: { id: any }) => obj.id);
          const filteredStores =
            stores && stores?.filter((x) => arrayOfIds.includes(x.state.id));
          //   const catProducts = filteredProducts?.filter(
          //     (product) => product?.categoryid === category
          // );
          if (alreadyFilter[0]?.orderBy === "desc") {
            const newFilter = filteredStores
              ?.slice()
              .sort((a, b) => b.name.localeCompare(a.name));
            setStores(
              newFilter?.filter((x) => x?.state.id !== undefined) || []
            );
          } else {
            const newFilter = filteredStores
              ?.slice()
              .sort((a, b) => a.name.localeCompare(b.name));
            setStores(
              newFilter?.filter((x) => x?.state.id !== undefined) || []
            );
          }
        }
      } else {
        setStores(
          (data && data?.filter((x) => x?.state_id !== null)) as
            | StoreWithStateProps[]
            | []
        );
      }
    } catch (e) {
      // error reading value
    }
  }, [data]);
  useFocusEffect(() => {
    if (search !== "") {
      console.log("first search");
    } else {
      getData();
      // console.log("secu search");
    }
  });
  React.useEffect(() => {
    let isCanelled = false;
    let newdata = [];
    if (search) {
      newdata = stores?.filter((x) =>
        x?.name?.toLowerCase().includes(search?.toLowerCase())
      ) as StoreWithStateProps[];
      setStores(newdata);
    } else {
      setStores(
        (data && data?.filter((x) => x?.state_id !== null)) as
          | StoreWithStateProps[]
          | []
      );
    }

    return () => {
      isCanelled = true;
    };
  }, [search, data]);
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white ">
      <CustomHeadMenu header={"Stores"} hasImage={true} />

      <View className="flex items-center justify-center ">
        <SearchBar
          onSearch={onChangeSearch}
          name={"stores"}
          type="store"
          data={stores as []}
        />
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            margin: 8,
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          {stores &&
            stores.map((store) => (
              <StoreBaggedItem key={store.id} store={store} />
            ))}
          {stores && stores.length === 0 && (
            <View className="flex-1 mt-32">
              <NoDataAvailable message="No stores available" />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default StoresScreen;

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  sortButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    width: "100%",
    flexWrap: "wrap",
    // backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "flex-start",
    // borderWidth: 1,
    borderColor: "#ccc",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
  },
  itemImage: {
    backgroundColor: "#fff",
    width: 167,
    height: 200,
    marginBottom: 1,
    resizeMode: "cover",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  itemPrice: {
    fontSize: 14,
    color: "green",
  },
  itemCategory: {
    fontSize: 12,
    color: "gray",
  },
});

const StoreBaggedItem = ({ store }: { store: StoreWithStateProps }) => {
  return (
    <View className="   w-[49%] h-[270px]">
      <View style={styles.gridItem}>
        <PersonalStoreFront store={store as unknown as StoreWithStateProps} />
      </View>
    </View>
  );
};
