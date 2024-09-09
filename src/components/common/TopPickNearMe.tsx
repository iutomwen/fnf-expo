import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";
import { appLogo } from "@/lib/images";
import { currencyFormat } from "@/lib/helper";
import { ProductProps, Tables } from "@/types";
import { useGetProductImagesById } from "@/api/store";
import { useGetImageUrl } from "@/api/general/imageUrl";
import { useAuth } from "@/providers/AuthProvider";
import LikedBadge from "./LikedBadge";
import { useGetProductById } from "@/api/store/product";

export type HomeProductProps = {
  products: Tables<"products">[] | null;
};
export default function TopPickNearMe({ products }: HomeProductProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      {products &&
        products?.map((product, index) => (
          <TopPickProduct key={index} product={product} />
        ))}
    </ScrollView>
  );
}

export type ImageProps = {
  fileId?: number | null;
};
export const ImageProduct = ({ fileId = null }: ImageProps) => {
  const { data: productImages } = useGetProductImagesById(fileId as number);
  const [image, setImage] = React.useState("");
  const { data, isLoading } = useGetImageUrl({
    file: (productImages && productImages[0]?.image_url) || "",
    bucket: "products",
  });
  React.useEffect(() => {
    if (data) {
      setImage(data as string);
    }
  }, [data]);
  if (isLoading) {
    return null;
  }
  return (
    <Image
      style={styles.image}
      source={image ? { uri: image, cache: "force-cache" } : appLogo}
    />
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 300,
    height: 250,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
  },
  categoryText: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    flex: 5,
    width: undefined,
    height: undefined,
  },
  categoryBox: {
    flex: 2,
    padding: 10,
  },
});

const TopPickProduct = ({ product }: { product: Tables<"products"> }) => {
  const { profile: account } = useAuth();
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetProductById(product?.id);
  return (
    <Link
      href={{
        pathname: "/(personal)/details",
        params: {
          id: product.id,
        },
      }}
      asChild
    >
      <TouchableOpacity>
        <View style={styles.categoryCard}>
          <ImageProduct fileId={product?.id} />
          <View className="flex flex-row w-full">
            <View style={styles.categoryBox}>
              <Text style={styles.categoryText}>{product.name}</Text>
              <Text style={{ color: Colors.primary }}>
                {currencyFormat(product.price as any)}
              </Text>
              <Text style={{ color: Colors.medium }} className="capitalize ">
                {product.delivery_type === "both"
                  ? "Pickup & Delivery"
                  : product.delivery_type}
              </Text>
            </View>

            {account?.role === "personal" && (
              <View className="flex-row items-center justify-start">
                <LikedBadge
                  productData={product as unknown as ProductProps}
                  itemId={productData?.id!}
                  // count={productData?.product_likes.length || 0}
                  fetchProduct={refetch}
                  size={30}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
