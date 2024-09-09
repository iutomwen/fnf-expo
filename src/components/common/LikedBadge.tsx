import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React from "react";
import { ProductProps } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import Colors from "@/constants/Colors";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { kFormatter, showToast } from "@/lib/helper";
import { useAddProductLike, useRemoveProductLike } from "@/api/store/product";
type LikedProps = {
  productData: ProductProps;
  itemId: number;
  count?: number;
  fetchProduct: () => void;
  size?: number;
};
const LikedBadge = ({
  itemId,
  count,
  productData,
  fetchProduct,
  size = 25,
}: LikedProps) => {
  const { profile: user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (productData) {
        const getFavorite = productData.product_likes?.find(
          (like) => like.product_id === itemId && like.profile_id === user?.id
        );
        if (getFavorite) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [productData]);

  const { mutate: addProductLike } = useAddProductLike();
  const addToWishList = async () => {
    setIsFavorite(null);
    const data = {
      product_id: productData?.id,
      profile_id: user?.id,
    };
    addProductLike(data, {
      onSuccess: async () => {
        await reloadData();
        setIsFavorite(true);
      },
      onError: (error) => {
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
        setIsFavorite(false);
      },
    });
  };

  const { mutate: removeProductLike } = useRemoveProductLike();
  const removeFromWishList = async () => {
    setIsFavorite(null);
    const data = {
      product_id: productData?.id,
      profile_id: user?.id,
    };
    removeProductLike(data, {
      onSuccess: async () => {
        await reloadData();
        setIsFavorite(false);
      },
      onError: (error) => {
        showToast({
          message: error.message,
          messageType: "error",
          header: "Error",
        });
        setIsFavorite(true);
      },
    });
  };

  const reloadData = async () => {
    fetchProduct();
  };
  return (
    <View className="flex-row items-center pr-1 space-x-1">
      {isFavorite === null && (
        <ActivityIndicator size="small" color={Colors.primary} />
      )}
      {isFavorite && (
        <TouchableOpacity
          disabled={loading}
          onPress={async () => {
            //check if user is a business account
            if (user?.role === "business") return;
            //mark item as liked
            await removeFromWishList();
          }}
          className="flex items-center justify-center rounded-full w-7 h-7"
        >
          <MaterialCommunityIcons name="cards-heart" size={size} color="red" />
        </TouchableOpacity>
      )}
      {isFavorite === false && (
        <TouchableOpacity
          disabled={loading}
          onPress={async () => {
            //check if user is a business account
            if (user?.role === "business") return;
            //mark item as liked
            await addToWishList();
          }}
          className="flex items-center justify-center rounded-full w-8 h-8"
        >
          <FontAwesome5 name="heart" size={size} color="red" />
        </TouchableOpacity>
      )}
      {count && <Text className="text-white">{kFormatter(count)}</Text>}
    </View>
  );
};

export default LikedBadge;
