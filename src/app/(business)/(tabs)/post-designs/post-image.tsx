import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BusinessStoreProps, ImageProps, InsertTables } from "@/types";
import { useMyStoreDetails } from "@/api/store";
import { useAuth } from "@/providers/AuthProvider";
import { FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/common/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import LoadingScreen from "@/components/common/LoadingScreen";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { showToast } from "@/lib/helper";
import { supabase } from "@/lib/supabase";
import * as ImageManipulator from "expo-image-manipulator";
import { useInsertProductImage } from "@/api/store/product";

const PostProductImageScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { productId } = params as unknown as { productId: number };
  const { profile } = useAuth();
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");

  React.useEffect(() => {
    if (store) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  const [numberOfImages, setNumberOfImages] = React.useState<any[]>(
    Array(5).fill(0)
  );
  const [ready, setReady] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState<ImageProps[]>([]);
  function removeObjectWithId(arr: ImageProps[], id: string) {
    const objWithIdIndex = arr.findIndex((obj) => obj.assetId === id);
    arr.splice(objWithIdIndex, 1);
    return arr;
  }
  const handleUpload = async (values: any, id = null) => {
    if (id) {
      const arr = removeObjectWithId(selectedImages, id);
      setSelectedImages(arr);
    } else {
      setSelectedImages([...selectedImages, values]);
    }
  };
  const handleSubmit = async () => {
    setReady(true);
    if (selectedImages.length === 0) {
      Alert.alert("Please select at least one image");
      setReady(false);
      return;
    } else {
      Alert.alert("Product saved successfully");
      router.push("/(business)/(tabs)/post-designs/post-done");
    }
    setReady(true);
  };
  function cancelPost(productId: number) {
    Alert.alert(
      "Cancel Post",
      "Are you sure you want to cancel this post? This will delete the post and all the images",

      [
        {
          text: "Yes",
          onPress: () => {
            router.push("/(business)/(tabs)/post-designs/post-done");
          },
          style: "cancel",
        },
        { text: "No", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className={`flex-1 pb-10 `}>
        <View
          className={`flex-row justify-between items-center px-3 bg-white   shadow-2xl`}
        >
          <View className={`px-5`}>
            <Text className={`text-red-700 font-semibold`}>
              Plan: {myStore?.my_subscription.subscriptionDetails?.name}
            </Text>
          </View>
          <View className={`flex py-2`}>
            <Text className={`text-gray-900 font-semibold `}>
              Listing available:
              <Text className={`text-red-700 font-bold `}>
                {myStore?.my_subscription.subscriptionDetails?.allowed_products}
              </Text>
            </Text>
            <Text className={`text-gray-900 font-semibold `}>
              Listing used:
              <Text className={`text-red-700 font-bold `}>
                {myStore?.products?.length}
              </Text>
            </Text>
          </View>
        </View>

        <View className={` px-1 mb-20 mt-2 flex items-center`}>
          <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
            Add Images
          </Text>
          <View className="w-full h-[75%] mb-20 ">
            <FlatList
              data={numberOfImages}
              renderItem={(item) => (
                <UploadImageBox
                  uploadedImage={handleUpload}
                  productId={productId as number}
                />
              )}
              numColumns={numberOfImages.length % 2 === 0 ? 2 : 3}
              contentContainerStyle={{ gap: 10 }}
              columnWrapperStyle={{ gap: 10, margin: 5 }}
            />
          </View>
          <View className={`w-[97%] mt-5 flex-row justify-between space-x-1`}>
            <View className="w-1/2">
              <CustomButton
                isDisabled={ready ? true : false}
                text={ready ? "Saving.." : "Save Post"}
                onPress={() => {
                  handleSubmit();
                }}
              />
            </View>
            <View className="w-1/2">
              <CustomButton
                text={"Cancel Post"}
                type="TERTIARY"
                onPress={() => cancelPost(productId as number)}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    position: "relative",
    objectFit: "cover",
    width: "100%",
    height: "100%",
    // marginHorizontal: 10,
  },
  box: {
    backgroundColor: "whitesmoke",
    borderColor: "gray",
    borderWidth: 1,
    borderStyle: "dashed",

    flex: 1,
    aspectRatio: 1,
  },
});
export default PostProductImageScreen;

type UploadImageBoxProps = {
  uploadedImage: (values: any, id: any) => void;
  productId: number;
};
type ImageValue = {
  id: null;
  file: {
    uri: string;
    name: string;
    type: string;
  };
  name: string | null;
};
const UploadImageBox = ({ uploadedImage, productId }: UploadImageBoxProps) => {
  const [image, setImage] = React.useState<boolean>(false);
  const [imageValue, setImageValue] = React.useState<ImageValue>();
  const [uploaded, setUploaded] = React.useState<string | number[]>("");
  const [uploading, setUploading] = React.useState(false);
  const [imageId, setImageId] = React.useState<number | null>(null);
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
        const imagePath = await uploadImage(manipResult.uri);
        const data: InsertTables<"product_images"> = {
          product_id: productId,
          image_url: imagePath,
        };
        insertProductImage(data, {
          onSuccess: (data, variables, context) => {
            setImageId(variables?.id as number);
            setSelectedImage(manipResult.uri);
            uploadedImage(
              { id: imageId, file: result.assets[0], name: null },
              imageId
            );
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

  const uploadImage = async (imageUri: string) => {
    if (!imageUri?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("products")
      .upload(filePath, decode(base64), { contentType });
    if (error) {
      showToast({
        header: "Error",
        messageType: "error",
        message: error.message,
      });
      return;
    }
    if (data) {
      return data.path;
    }
  };

  const deleteImage = async (uploaded: string | number[]) => {};
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
                setImage(false);
                setSelectedImage(null);
                uploadedImage(null, selectedImage);
                deleteImage(uploaded);
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
      {uploading && <LoadingScreen text="Uploading" />}
    </View>
  );
};
