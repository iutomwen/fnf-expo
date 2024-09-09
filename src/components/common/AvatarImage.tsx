import { View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { blurhash } from "@/lib/helper";
import { appLogo } from "@/lib/images";
import { useGetImageUrl } from "@/api/general/imageUrl";
import { AvatarImageProps } from "@/types";

const AvatarImage = ({
  size = 100,
  name = "",
  file,
  bucket = "avatars",
}: AvatarImageProps) => {
  const [image, setImage] = React.useState("");
  const { data, isLoading } = useGetImageUrl({
    file: (file && file) || "",
    bucket: bucket,
  });

  React.useEffect(() => {
    if (data) {
      setImage(data as string);
    }
  }, [data]);
  if (!image) {
  }
  return (
    <View className="items-center justify-center border border-gray-300 rounded-full ">
      <Image
        alt={name}
        placeholder={blurhash}
        source={image ? { uri: image } : appLogo}
        cachePolicy={"memory-disk"}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
};

export default AvatarImage;
