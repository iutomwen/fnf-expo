import { DimensionValue } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { appLogo } from "@/lib/images";
import { blurhash } from "@/lib/helper";
import { useGetImageUrl } from "@/api/general/imageUrl";
import { StoreImageProps } from "@/types";

const StoreImage = ({
  resizeMode = "cover",
  radius = 2,
  width = "100%",
  height = "100%",
  file,
}: StoreImageProps) => {
  const [image, setImage] = React.useState("");
  const { data, isLoading } = useGetImageUrl({
    file: (file && file) || "",
    bucket: "store_logo",
  });
  React.useEffect(() => {
    if (data) {
      setImage(data as string);
    }
  }, [data]);

  if (!image) {
  }
  return (
    <Image
      source={image ? { uri: image } : appLogo}
      placeholder={blurhash}
      transition={200}
      cachePolicy={"memory-disk"}
      contentFit="cover"
      style={{
        width: width as DimensionValue,
        height: height as DimensionValue,
        borderRadius: radius,
      }}
    />
  );
};

export default StoreImage;
