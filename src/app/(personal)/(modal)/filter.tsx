import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStateList } from "@/api/general/general";
import { useGetAllActiveProducts } from "@/api/store/product";
import { Tables } from "@/types";
import LoadingScreen from "@/components/common/LoadingScreen";
interface CategoryStateProps {
  id: string;
  name: string;
  checked?: boolean;
  count?: number;
  orderBy?: string | "desc" | "asc";
}

export default function FilterScreen() {
  const params = useLocalSearchParams();
  const type = params?.type as string;
  const category_id = params?.data as string;
  const navigation = useNavigation();
  const { data: stateList, isLoading: stateLoading } = useStateList();
  const { data: products, isLoading: productsLoading } =
    useGetAllActiveProducts();
  const [items, setItems] = useState<CategoryStateProps[]>(
    stateList?.map((item) => {
      return {
        id: item.id,
        name: item.name,
        checked: false,
        count: 0,
        orderBy: "desc",
      };
    }) as unknown as CategoryStateProps[]
  );
  const [selected, setSelected] = useState<CategoryStateProps[]>([]);
  const [orderBy, setOrderBy] = useState<string | "desc" | "asc">("desc");
  const [nearBy, setNearBy] = useState<boolean>(false);
  const flexWidth = useSharedValue(0);
  const scale = useSharedValue(0);
  const [dataItems, setDataItems] = useState<Tables<"products">[]>([]);
  React.useEffect(() => {
    if (items) {
      setOrderBy(items[0]?.orderBy as string);
    }
  }, [items]);
  React.useEffect(() => {
    if (type === "category") {
      if (products && category_id) {
        const filteredProducts = products.filter(
          (product) => product?.category_id === parseInt(category_id)
        );
        setDataItems(filteredProducts);
      }
    }
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("filterData");
      if (value !== null) {
        // value previously stored
        // console.log("Filter: ", JSON.parse(value));
        const updatedItems =
          items &&
          items.map((item) => {
            //attach products to state object
            const stateProducts =
              dataItems &&
              dataItems.filter(
                (product) => product.state_id === (item.id as any)
              );
            return {
              id: item.id,
              name: item?.name,
              checked: false,
              count: stateProducts?.length,
              orderBy: orderBy,
            };
          });
        // const mergedArray = Array.from(new Set([...JSON.parse(value), ...updatedItems]));
        const mergedArray = [...JSON.parse(value), ...updatedItems].reduce(
          (acc, current) => {
            // Check if an object with the same id exists in the accumulator
            const exists = acc.find(
              (item: { _id: any }) => item._id === current._id
            );

            // If not, add it to the accumulator
            if (!exists) {
              acc.push(current);
            }

            return acc;
          },
          []
        );
        setItems(mergedArray);
      } else {
        const updatedItems =
          items &&
          items.map((item) => {
            //attach products to state object
            const stateProducts =
              dataItems &&
              dataItems.filter(
                (product) => product.state_id === (item.id as any)
              );
            return {
              id: item.id,
              name: item?.name,
              checked: false,
              count: stateProducts?.length,
              orderBy: orderBy,
            };
          });
        setItems(updatedItems as CategoryStateProps[]);
      }
    } catch (e) {
      // error reading value
    }
  };
  console.log("dataItems", dataItems);
  useEffect(() => {
    //set all items to false
    getData();
  }, [dataItems]);

  React.useEffect(() => {
    if (orderBy === "desc") {
      const updatedItems =
        items &&
        items.map((item) => {
          return {
            ...item,
            orderBy: orderBy,
          };
        });
      setSelected(updatedItems);
      setItems(updatedItems);
    }
    if (orderBy === "asc") {
      const updatedItems =
        items &&
        items.map((item) => {
          return {
            ...item,
            orderBy: orderBy,
          };
        });
      setSelected(updatedItems);
      setItems(updatedItems);
    }
  }, [orderBy, nearBy]);

  useEffect(() => {
    const hasSelected = selected.length > 0;
    const selectedItems = items && items.filter((item) => item.checked);
    const newSelected = selectedItems && selectedItems.length > 0;

    if (hasSelected !== newSelected) {
      flexWidth.value = withTiming(newSelected ? 150 : 0);
      scale.value = withTiming(newSelected ? 1 : 0);
    }
    if (selectedItems) {
      setSelected(selectedItems);
    }
  }, [items]);

  const handleClearAll = async () => {
    const updatedItems =
      items &&
      items.map((item) => {
        item.checked = false;
        return item;
      });
    setOrderBy("");
    try {
      await AsyncStorage.removeItem("filterStoreData");
    } catch (error) {}
    setItems(updatedItems);
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: flexWidth.value,
      opacity: flexWidth.value > 0 ? 1 : 0,
    };
  });

  const animatedText = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderItem: ListRenderItem<CategoryStateProps> = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.itemText}>
        {item.name} ({item.count})
      </Text>
      <BouncyCheckbox
        isChecked={items[index].checked}
        fillColor={Colors.primary}
        unfillColor="#fff"
        disableBuiltInState
        iconStyle={{
          borderColor: Colors.primary,
          borderRadius: 4,
          borderWidth: 2,
        }}
        innerIconStyle={{ borderColor: Colors.primary, borderRadius: 4 }}
        onPress={() => {
          const isChecked = items[index].checked;

          const updatedItems =
            items &&
            items.map((item) => {
              if (item.name === items[index].name) {
                item.checked = !isChecked;
              }

              return item;
            });

          setItems(updatedItems);
        }}
      />
    </View>
  );
  // console.log(JSON.stringify(products, null, 2));
  if (stateLoading || productsLoading || !items || !products) {
    return <LoadingScreen text="Loading..." />;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: `Filter search in ${type}`,
        }}
      />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ItemBox
            onSelectOrderBy={setOrderBy}
            onSelectNearBy={setNearBy}
            orderBy={orderBy}
            nearBy={nearBy}
          />
        }
      />
      <View style={{ height: 76 }} />
      <View style={styles.footer}>
        <View style={styles.btnContainer}>
          <Animated.View style={[animatedStyles, styles.outlineButton]}>
            <TouchableOpacity onPress={handleClearAll}>
              <Animated.Text style={[animatedText, styles.outlineButtonText]}>
                Clear all
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.fullButton}
            onPress={async () => {
              try {
                if (selected.length > 0) {
                  await AsyncStorage.setItem(
                    "filterData",
                    JSON.stringify(selected)
                  );
                } else {
                  await AsyncStorage.removeItem("filterData");
                }
              } catch (e) {
                // saving error
              }
              navigation.goBack();
            }}
          >
            <Text style={styles.footerText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.lightGrey,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: -10,
    },
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    height: 56,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  itemText: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  btnContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  outlineButton: {
    borderColor: Colors.primary,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 56,
  },
  outlineButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

type ItemBoxProps = {
  onSelectOrderBy: (value: string) => void;
  onSelectNearBy: (value: boolean) => void;
  orderBy: string | "desc" | "asc";
  nearBy: boolean;
};
const ItemBox = ({
  onSelectOrderBy,
  onSelectNearBy,
  nearBy,
  orderBy,
}: ItemBoxProps) => {
  return (
    <>
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelectOrderBy("desc")}
        >
          <Ionicons name="arrow-down-outline" size={20} color={Colors.medium} />
          <Text style={{ flex: 1 }}>Sort desending (Price)</Text>
          {orderBy === "desc" && (
            <Ionicons name="checkmark" size={22} color={Colors.primary} />
          )}
          <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelectOrderBy("asc")}
        >
          <Ionicons name="arrow-up-outline" size={20} color={Colors.medium} />
          <Text style={{ flex: 1 }}>Sort ascending (Price)</Text>
          {orderBy === "asc" && (
            <Ionicons name="checkmark" size={22} color={Colors.primary} />
          )}
          <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons name="pricetag-outline" size={20} color={Colors.medium} />
          <Text style={{ flex: 1 }}>Offers</Text>
          <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.item}>
        <Ionicons name="md-map-outline" size={20} color={Colors.medium} />
        <Text style={{ flex: 1 }}>NearBy</Text>
        <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
      </TouchableOpacity> */}
      </View>
      <Text style={styles.header}>States</Text>
    </>
  );
};
