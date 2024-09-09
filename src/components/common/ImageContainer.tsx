import { View, Pressable, useWindowDimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/lib/helper";
import { appLogo } from "@/lib/images";
import { useGetImageUrl } from "@/api/general/imageUrl";
const ImageContainer = ({ fileUrl }: { fileUrl: string }) => {
  const [image, setImage] = React.useState("");
  const router = useRouter();
  const { data, isLoading } = useGetImageUrl({
    file: fileUrl,
    bucket: "products",
  });
  const { width: windowWidth } = useWindowDimensions();
  const handleImagePress = (fileUrl: string) => {
    router.push({
      pathname: "/(common)/image/post-image",
      params: {
        fileUrl: fileUrl,
      },
    });
  };

  React.useEffect(() => {
    if (data) {
      setImage(data as string);
    }
  }, [data]);
  return (
    <View style={{ width: windowWidth, height: 250 }}>
      <Pressable onPress={() => handleImagePress(image || "")}>
        <Image
          source={image ? { uri: image } : appLogo}
          placeholder={blurhash}
          cachePolicy={"memory-disk"}
          className="w-40 h-32 "
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f3f4f6",
          }}
          contentFit="contain"
          transition={1000}
        />
      </Pressable>
    </View>
  );
};

export default ImageContainer;
