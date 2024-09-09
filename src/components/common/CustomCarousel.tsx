import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { blurhash } from "@/lib/helper";
import { appLogo } from "@/lib/images";
import { Tables } from "@/types";
import { useGetProductImagesById } from "@/api/store";
import { supabase } from "@/lib/supabase";
import ImageContainer from "./ImageContainer";

type CustomCarouselProps = {
  productId: number | null;
};

export default function CustomCarousel({ productId }: CustomCarouselProps) {
  const { data: productImages } = useGetProductImagesById(productId as number);
  const [images, setImages] = React.useState<Tables<"product_images">[] | null>(
    null
  );
  React.useEffect(() => {
    if (productId && productImages) {
      const images = productImages?.filter(
        (image) => image.product_id === productId
      );
      if (images) {
        setImages(images);
      }
    }
  }, [productImages, productId]);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const { width: windowWidth } = useWindowDimensions();
  const ratio = windowWidth / 541; //541 is actual image width
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={1}
        >
          {images && images?.length > 0 ? (
            images?.map((fileUrl, index) => (
              <ImageContainer
                key={index}
                fileUrl={fileUrl.image_url as string}
              />
            ))
          ) : (
            <ImageContainer fileUrl={""} />
          )}
        </ScrollView>
        <View style={styles.indicatorContainer}>
          {images?.map((image, imageIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                windowWidth * (imageIndex - 1),
                windowWidth * imageIndex,
                windowWidth * (imageIndex + 1),
              ],
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={imageIndex}
                style={[styles.normalDot, { width }]}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    backgroundColor: "rgba(0,0,0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  image: {
    // flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
  },
});
