import { View, Text, ScrollView } from "react-native";
import React from "react";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { useAuth } from "@/providers/AuthProvider";
import { useFocusEffect, useRouter } from "expo-router";
import { useMyStoreDetails } from "@/api/store";
import { deliveryType, priceBargain, showToast } from "@/lib/helper";
import {
  BusinessStoreProps,
  CategoryType,
  InsertPostInputsProps,
  InsertTables,
  SubCategoryType,
} from "@/types";
import CustomInput from "@/components/common/CustomInput";
import { useForm } from "react-hook-form";
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu";
import { useCategoryList, useAllSubCategories } from "@/api/general/general";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import LoadingScreen from "@/components/common/LoadingScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInsertProduct } from "@/api/store/product";

const PostDesignScreen = () => {
  const { profile } = useAuth();
  const router = useRouter();
  const { data: allCategories } = useCategoryList();
  const { data: subCategory } = useAllSubCategories();
  const [isProfileComplete, setIsProfileComplete] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const {
    data: store,
    error,
    isLoading,
  } = useMyStoreDetails(profile?.id || "");
  React.useEffect(() => {
    if (allCategories) {
      setCategories(
        allCategories.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }))
      );
    }
  }, [allCategories]);
  React.useEffect(() => {
    if (store) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);
  const getStoreStatus = React.useCallback(() => {
    if (
      !isLoading &&
      (!store?.address ||
        !store?.city_id ||
        !store?.state_id ||
        !store?.country_id)
    ) {
      showToast({
        messageType: "error",
        message: "Please fill in your profile",
        header: "Complete Profile",
      });
      return router.replace("/(business)/profile/");
    }
    setIsProfileComplete(true);
    // if (store?.subscription_history_id) {
    //   setHasSub(true);
    // }
  }, [store]);
  useFocusEffect(() => {
    getStoreStatus();

    return () => {
      setIsProfileComplete(false);
      // setHasSub(false);
    };
  });

  const {
    control,
    getValues,
    trigger,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<InsertPostInputsProps>();
  const [subCat, setSubCat] = React.useState<SubCategoryType[]>([]);
  React.useEffect(() => {
    if (getValues("category")) {
      const sub = subCategory?.filter(
        (x) => x?.category_id === getValues("category")
      );
      if (sub) {
        if (sub?.length > 0) {
          setSubCat(
            sub.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))
          );
        }
      }
    }
  }, [getValues("category")]);
  const { mutate: insertProduct, data: insertData } = useInsertProduct();
  async function postProduct(values: InsertPostInputsProps) {
    setLoad(true);
    const data: InsertTables<"products"> = {
      store_id: myStore?.id,
      category_id: values.category,
      sub_category_id: values.subCategory,
      price: parseInt(values.price),
      price_bargain: values.priceBargain,
      delivery_type: values.delivery,
      description: values.description,
      name: values.productName,
      city_id: myStore?.city_id,
      state_id: myStore?.state_id,
      country_id: myStore?.country_id,
      status: "awaiting",
      likes: 0,
      product_views: 0,
      is_deleted: false,
      is_promoted: false,
      stock: 1,
    };
    insertProduct(data, {
      onSuccess: () => {
        showToast({
          messageType: "success",
          message: "Product added successfully",
          header: "Success",
        });
      },
      onError: (error) => {
        showToast({
          messageType: "error",
          message: error.message,
          header: "Error",
        });
        setLoad(false);
      },
    });
  }

  React.useEffect(() => {
    if (insertData) {
      reset();
      setLoad(false);
      router.push({
        pathname: "/(business)/(tabs)/post-designs/post-image",
        params: {
          productId: insertData[0].id as number,
        },
      });
    }
  }, [insertData]);
  return (
    <SafeAreaView className="flex-1 ">
      <CustomHeadMenu header={"Add new design"} hasImage />
      {isProfileComplete && (
        <View className="flex-col items-center justify-center h-full">
          <ScrollView
            className=" w-full "
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
            <View>
              <View
                className={`flex-row justify-between items-center px-3 bg-white   shadow-2xl`}
              >
                <View className={`px-5 ${!myStore?.my_subscription && "py-5"}`}>
                  <Text className={`text-red-700 font-semibold`}>
                    Plan:{" "}
                    {myStore?.my_subscription?.subscriptionDetails?.name ||
                      "No Subcription"}
                  </Text>
                </View>
                {myStore?.my_subscription && (
                  <View className={`flex py-2`}>
                    <Text className={`text-gray-900 font-semibold `}>
                      Listing available:
                      <Text className={`text-red-700 font-bold `}>
                        {myStore?.my_subscription?.subscriptionDetails
                          ?.allowed_products || " N/A"}
                      </Text>
                    </Text>
                    <Text className={`text-gray-900 font-semibold `}>
                      Listing used:
                      <Text className={`text-red-700 font-bold `}>
                        {myStore?.products?.length}
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <View className={` px-2 mt-2 flex items-center`}>
                <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
                  New Product
                </Text>

                <View
                  className={`mt-3 w-full flex flex-col items-start justify-start space-y-2 mb-auto`}
                >
                  <View className={`flex flex-col w-full`}>
                    <CustomInput
                      marginVertical={0}
                      name="productName"
                      placeholder="Product name"
                      control={control}
                      rules={{
                        required: "Product name is required",
                      }}
                    />
                  </View>
                  <View className={`flex flex-col w-full`}>
                    <CustomInput
                      marginVertical={0}
                      keyboardType="numeric"
                      name="price"
                      placeholder="Product price(NGN)"
                      control={control}
                      rules={{
                        required: "Price is required",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      // marginBottom: 7,
                      borderRadius: 10,
                      width: "100%",
                    }}
                  >
                    <CustomDropdownMenu
                      data={priceBargain || []}
                      control={control}
                      rules={{
                        required: "Price bargain is required",
                      }}
                      name="priceBargain"
                      placeholder={"Price bargain.."}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "transparent",
                      marginBottom: 7,
                      borderRadius: 10,
                      width: "100%",
                    }}
                  >
                    <CustomDropdownMenu
                      data={categories || []}
                      control={control}
                      rules={{
                        required: "Category is required",
                      }}
                      name="category"
                      placeholder={"Select category.."}
                      onChangeText={(e) => {
                        if (e) {
                          setValue("category", e, { shouldValidate: true });
                        } else {
                          setValue("category", null, { shouldValidate: true });
                        }
                      }}
                    />
                  </View>

                  {getValues("category") ? (
                    <View
                      style={{
                        backgroundColor: "transparent",
                        marginBottom: 7,
                        borderRadius: 10,
                        width: "100%",
                      }}
                    >
                      <CustomDropdownMenu
                        data={subCat || []}
                        control={control}
                        rules={{
                          required: "SubCategory is required",
                        }}
                        name="subCategory"
                        placeholder={"Select sub-category.."}
                        onChangeText={(e) => {
                          if (e) {
                            setValue("subCategory", e, {
                              shouldValidate: true,
                            });
                          } else {
                            setValue("subCategory", null, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      />
                    </View>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: 10,
                      width: "100%",
                    }}
                  >
                    <CustomDropdownMenu
                      data={deliveryType}
                      control={control}
                      rules={{
                        required: "Delivery Type is required",
                      }}
                      name="delivery"
                      placeholder={"Delivery Type"}
                    />
                  </View>
                  <View className={`flex flex-col w-full`}>
                    <CustomInput
                      marginVertical={0}
                      name="description"
                      placeholder="Description"
                      control={control}
                      rules={{
                        required: "Description is required",
                      }}
                      multiline
                      numberOfLines={30}
                      style={{ height: 100 }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <FooterButtonArea>
            <View
              className={`w-[97%] mt-[-12px] flex-row justify-between space-x-1`}
            >
              <View className="w-1/2">
                {myStore?.my_subscription ? (
                  <CustomButton
                    isDisabled={load}
                    text={load ? "Saving..." : "Next"}
                    onPress={handleSubmit(postProduct)}
                  />
                ) : (
                  <CustomButton
                    text={"Subscribe to a plan"}
                    onPress={() =>
                      router.push("/(business)/subscription/subscriptions")
                    }
                  />
                )}
              </View>
              <View className="w-1/2">
                <CustomButton
                  text={"Cancel"}
                  type="TERTIARY"
                  onPress={() => {
                    reset();
                    router.back();
                  }}
                />
              </View>
            </View>
          </FooterButtonArea>
        </View>
      )}
      {load && <LoadingScreen text="Saving..." />}
    </SafeAreaView>
  );
};

export default PostDesignScreen;
