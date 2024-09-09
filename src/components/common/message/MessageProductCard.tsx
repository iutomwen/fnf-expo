import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { blurhash, currencyFormat } from "@/lib/helper";
import { Image } from "expo-image";
import { useGetProductById } from "@/api/store/product";
import { useGetImageUrl } from "@/api/general/imageUrl";
import { appLogo } from "@/lib/images";
type MessageProductCardProps = {
  product: number;
};
export default function MessageProductCard({
  product,
}: MessageProductCardProps) {
  const router = useRouter();
  const {
    data: productData,
    isLoading: productLoading,
    refetch: fetchProduct,
  } = useGetProductById(product);
  // get image url
  const [file, setFile] = React.useState<string | null>(null);
  const { data: fileData } = useGetImageUrl({
    file: productData?.product_images[0].image_url as string,
    bucket: "products",
  });
  React.useEffect(() => {
    if (fileData) {
      setFile(fileData as string);
    }
  }, [fileData]);
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(personal)/(modal)/product-item",
          params: {
            id: productData?.id!,
          },
        })
      }
      className="flex flex-row items-start justify-start h-32 m-2"
    >
      <Image
        source={file ? { uri: file, cache: "force-cache" } : appLogo}
        placeholder={blurhash}
        className="object-contain w-32 h-32 "
      />
      <View className="flex-col items-start justify-center flex-1 p-3 space-y-3">
        <Text
          numberOfLines={2}
          className="overflow-hidden text-lg font-semibold text-black"
        >
          {productData?.name}
        </Text>
        <Text className="overflow-hidden text-base font-semibold text-gray-500">
          {currencyFormat(Number(productData?.price))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
