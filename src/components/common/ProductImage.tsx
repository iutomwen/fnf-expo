import { DimensionValue } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { appLogo } from "@/lib/images";
import { blurhash } from "@/lib/helper";
import { useGetProductImagesById } from "@/api/store";
import { useGetImageUrl } from "@/api/general/imageUrl";

type ImageProps = {
  fileId?: number | null;
  style?: any;
  width?: string;
  height?: string;
  borderBottomLeftRadius?: number;
  borderTopLeftRadius?: number;
  resizeMode?: "fill" | "contain" | "cover" | "none" | "scale-down";
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
};

const ProductImage = ({
  fileId = null,
  style,
  width = "95%",
  height = "100%",
  borderBottomLeftRadius,
  borderTopLeftRadius,
  resizeMode = "fill",
  borderTopRightRadius,
  borderBottomRightRadius,
}: ImageProps) => {
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
      source={image ? { uri: image } : appLogo}
      placeholder={blurhash}
      transition={200}
      cachePolicy={"memory-disk"}
      className="w-40 h-32 "
      style={{
        width: width as DimensionValue,
        height: height as DimensionValue,
        borderTopLeftRadius: borderTopLeftRadius || 0,
        borderBottomLeftRadius: borderBottomLeftRadius || 0,
        borderTopRightRadius: borderTopRightRadius || 0,
        borderBottomRightRadius: borderBottomRightRadius || 0,
        alignItems: "center",
        justifyContent: "center",
      }}
      contentFit={resizeMode}
    />
  );
};

export default ProductImage;
