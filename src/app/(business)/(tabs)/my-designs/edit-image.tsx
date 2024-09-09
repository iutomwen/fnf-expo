import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import NoDataAvailable from "@/components/common/NoDataAvailable";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingScreen from "@/components/common/LoadingScreen";
import { ScrollView } from "react-native";
import { blurhash } from "@/lib/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetProductImagesById } from "@/api/store";
import { ImageProps, InsertTables, Tables } from "@/types";
import * as ImageManipulator from "expo-image-manipulator";
import { useInsertProductImage } from "@/api/store/product";
import {
  deleteImageById,
  doImageUpload,
  useGetImageUrl,
} from "@/api/general/imageUrl";
import { appLogo } from "@/lib/images";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const EditImageScreen = () => {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const productId = params.productId as string | undefined;
  const [selectedImages, setSelectedImages] = React.useState<ImageProps[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [imageCount, setImageCount] = React.useState<number>(0);
  const { data: productImages } = useGetProductImagesById(parseInt(productId!));
  const [numberOfImages, setNumberOfImages] = React.useState<any[]>([]);
  const [productImagesData, setProductImagesData] = React.useState<
    Tables<"product_images">[]
  >([]);
  React.useEffect(() => {
    if (productId && productImages) {
      const images = productImages?.filter(
        (image) => image.product_id === parseInt(productId!)
      );
      if (images) {
        setProductImagesData(images);
        setImageCount(images.length);
        const arr = Array(5 - images.length).fill(0);
        setNumberOfImages(arr);
        setLoading(false);
      }
    }
  }, [productImages, productId]);
  function removeObjectWithId(arr: ImageProps[], id: string) {
    const objWithIdIndex = arr.findIndex((obj) => obj.assetId === id);
    arr.splice(objWithIdIndex, 1);
    return arr;
  }
  const handleUpload = async (values: any, id = null) => {
    setLoading(true);
    if (id) {
      const images = productImagesData?.filter(
        (image) => image.image_url !== id
      );
      if (images) {
        setProductImagesData(images);
        setImageCount(images.length);
        const arr = Array(5 - images.length).fill(0);
        setNumberOfImages(arr);
        setLoading(false);
      }
      const arr = removeObjectWithId(selectedImages, id);
      setSelectedImages(arr);
    } else {
      setSelectedImages([...selectedImages, values]);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    await queryClient.invalidateQueries();
    setTimeout(() => {
      Alert.alert("Updated successfully");
      router.push("/(business)/(tabs)/my-designs");
      setLoading(false);
    }, 1500);
  };

  function cancelImageEdit(productId: number) {
    Alert.alert(
      "Cancel Edit",
      "Are you sure you want to cancel this edit? This will undo all changes made to all the images",

      [
        {
          text: "Yes",
          onPress: () => {
            router.push("/(business)/(tabs)/post-designs");
          },
          style: "cancel",
        },
        { text: "No", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <CustomHeadMenu header="Edit Images" innerScreen hasImage />
      <View className={` px-1 mb-5 mt-2 flex items-center`}>
        <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
          Edit Post Images
        </Text>
        <View className="w-full mb-44">
          {loading ? (
            <LoadingScreen text="Loading Images" />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              key={imageCount}
              ListFooterComponent={
                <View className="w-full mt-2">
                  {imageCount === 0 && (
                    <NoDataAvailable message="No images uploaded yet" />
                  )}
                  <OldPostImages
                    products={productImagesData}
                    uploadedImage={handleUpload}
                    queryClient={queryClient}
                  />
                </View>
              }
              data={numberOfImages}
              renderItem={(item) => (
                <EditUploadImageBox
                  uploadedImage={handleUpload}
                  productId={productId as any}
                  queryClient={queryClient}
                />
              )}
              numColumns={numberOfImages.length % 2 === 0 ? 2 : 3}
              contentContainerStyle={{ gap: 10 }}
              columnWrapperStyle={{ gap: 10, margin: 5 }}
            />
          )}
        </View>
      </View>
      <FooterButtonArea>
        <View className="flex-row justify-between items-center w-full">
          <View className="w-1/2">
            <CustomButton
              isDisabled={ready ? true : false}
              text={ready ? "Saving.." : "Save Changes"}
              onPress={() => {
                handleSubmit();
              }}
            />
          </View>
          <View className="w-1/2">
            <CustomButton
              text={"Cancel"}
              type="TERTIARY"
              onPress={() => cancelImageEdit(productId as any)}
            />
          </View>
        </View>
      </FooterButtonArea>
    </SafeAreaView>
  );
};

export default EditImageScreen;

type UploadImageBoxProps = {
  uploadedImage: (values: any, id: any) => void;
  productId: number;
  queryClient: QueryClient;
};
const EditUploadImageBox = ({
  uploadedImage,
  productId,
  queryClient,
}: UploadImageBoxProps) => {
  const [uploading, setUploading] = React.useState(false);
  const [imageId, setImageId] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const { mutate: insertProductImage } = useInsertProductImage();
  const pickImage = async () => {
    setUploading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 400 } }],
        { compress: 0.1, format: ImageManipulator.SaveFormat.PNG }
      );
      if (productId) {
        const imagePath = await doImageUpload({
          image: manipResult.uri,
          bucket: "products",
        });
        const data: InsertTables<"product_images"> = {
          product_id: productId,
          image_url: imagePath,
        };
        insertProductImage(data, {
          onSuccess: (data, variables, context) => {
            setImageId(variables?.id as any);
            setSelectedImage(manipResult.uri);
            uploadedImage(
              { id: imageId, file: result.assets[0], name: null },
              imageId
            );
          },
          async onSettled(data, error, variables, context) {
            await queryClient.invalidateQueries();
            setUploading(false);
          },
          onError: (error) => {
            console.log(error);
          },
        });
      }
    } else {
      setSelectedImage(null);
      setUploading(false);
    }
    setUploading(false);
  };

  return (
    <View style={styles.box}>
      {selectedImage ? (
        <>
          <Image source={selectedImage} style={styles.image} />
          <View className="absolute top-0 right-0 ">
            <MaterialIcons
              name="close"
              size={24}
              color="red"
              onPress={() => {
                setSelectedImage(null);
                uploadedImage(null, selectedImage);
                deleteImageById({
                  file: selectedImage,
                  bucket: "products",
                  productId: productId,
                });
              }}
            />
          </View>
        </>
      ) : (
        <Pressable
          className="items-center justify-center flex-1 "
          onPress={pickImage}
        >
          <Text>Upload Image</Text>
          <MaterialIcons
            name="file-upload"
            size={24}
            color="black"
            onPress={pickImage}
          />
        </Pressable>
      )}
      {uploading && <LoadingScreen text="Uploading Image" />}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "whitesmoke",
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",

    flex: 1,
    aspectRatio: 1,
  },
  scrollViewContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  image: {
    width: 200,
    height: 200, // Adjust the height as needed
    marginHorizontal: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

const OldPostImages = ({
  products: productImages,
  uploadedImage,
  queryClient,
}: {
  products: Tables<"product_images">[];
  uploadedImage: (values: any, id: any) => void;
  queryClient: QueryClient;
}) => {
  const [images, setImages] = React.useState<Tables<"product_images">[]>([]);
  React.useEffect(() => {
    if (productImages) {
      setImages(productImages);
    }
  }, [productImages]);

  return (
    <View className={`flex justify-between items-center mt-2`}>
      <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
        Other Images
      </Text>
      <View className={`flex-row justify-between items-center mt-2 `}>
        <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
            className="flex-row space-x-2 w-full h-72"
            contentOffset={{ x: 0, y: 0 }} // scroll to start
          >
            {images?.map((fileUrl) => {
              return (
                <OtherImageView
                  key={fileUrl.id}
                  file={fileUrl?.image_url as string}
                  product={fileUrl.product_id as number}
                  queryClient={queryClient}
                  uploadedImage={uploadedImage}
                />
              );
            })}
          </ScrollView>
        </Text>
      </View>
    </View>
  );
};

type OtherImageProps = {
  file: string;
  product: number;
  queryClient: QueryClient;
  uploadedImage: (values: any, id: any) => void;
};
const OtherImageView = ({
  file,
  product,
  queryClient,
  uploadedImage,
}: OtherImageProps) => {
  const [image, setImage] = React.useState("");
  const { data, isLoading } = useGetImageUrl({
    file: file,
    bucket: "products",
  });
  React.useEffect(() => {
    if (data) {
      setImage(data as string);
    }
  }, [data]);
  return (
    <View className="border-gray-100 h-40 flex-1 w-full ">
      <Image
        source={image ? { uri: image } : appLogo}
        placeholder={blurhash}
        cachePolicy={"memory-disk"}
        style={styles.image}
        contentFit={"cover"}
      />
      <View className="absolute top-[2px] right-[12px] shadow-lg bg-gray-100 h-5 w-5 items-center flex justify-center rounded-full ">
        <MaterialIcons
          name="close"
          size={18}
          color="red"
          onPress={async () => {
            const data = deleteImageById({
              file: file,
              bucket: "products",
              productId: product,
            });
            uploadedImage({ id: file, file: null, name: null }, file);
          }}
        />
      </View>
    </View>
  );
};
