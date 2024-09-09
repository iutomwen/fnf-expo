import { View, Text, ScrollView } from "react-native";
import React from "react";
import {
  BusinessStoreProps,
  CategoryType,
  SubCategoryType,
  Tables,
  UpdatePostInputsProps,
} from "@/types";
import { useAllSubCategories, useCategoryList } from "@/api/general/general";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMyStoreDetails } from "@/api/store";
import { useGetProductById, useUpdateProductById } from "@/api/store/product";
import { set, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import CustomInput from "@/components/common/CustomInput";
import CustomDropdownMenu from "@/components/common/CustomDropdownMenu";
import { deliveryType, priceBargain, showToast } from "@/lib/helper";
import FooterButtonArea from "@/components/common/FooterButtonArea";
import CustomButton from "@/components/common/CustomButton";
import LoadingScreen from "@/components/common/LoadingScreen";

const EditPostScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  if (!params.productId) router.back();
  const { data: productData, isLoading } = useGetProductById(
    parseInt(params.productId as string)
  );
  const { profile } = useAuth();
  const { data: allCategories } = useCategoryList();
  const { data: subCategory } = useAllSubCategories();
  const [load, setLoad] = React.useState(false);
  const [myStore, setStore] = React.useState<BusinessStoreProps>();
  const [product, setProduct] = React.useState<Tables<"products">>();
  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const [subCat, setSubCat] = React.useState<SubCategoryType[]>([]);
  const { data: store, error } = useMyStoreDetails(profile?.id || "");
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (productData) {
      setProduct(productData as Tables<"products">);
      setLoading(false);
    }
  }, [productData]);
  React.useEffect(() => {
    if (store) {
      setStore(store as unknown as BusinessStoreProps);
    }
  }, [store]);

  const defaultValues: UpdatePostInputsProps = {
    productName: product?.name?.toString() || "",
    price: product?.price?.toString() || "",
    priceBargain: product?.price_bargain || false,
    category: product?.category_id || null,
    subCategory: product?.sub_category_id || null,
    delivery: product?.delivery_type as "delivery" | "pickup" | "both",
    description: product?.description?.toString() || "",
  };
  const {
    control,
    getValues,
    trigger,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePostInputsProps>({
    defaultValues,
  });
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
    if (product) {
      setValue("category", product?.category_id || null);
      setValue("subCategory", product?.sub_category_id);
      setValue("price", product?.price?.toString() as string);
      setValue("priceBargain", product?.price_bargain as any);
      setValue("delivery", product?.delivery_type as any);
      setValue("description", product?.description as any);
      setValue("productName", product?.name as any);
      trigger();
    }
  }, [product]);
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

  const [selectedSubCat, setSelectedSubCat] = React.useState(
    getValues("subCategory")
  );
  React.useEffect(() => {
    if (defaultValues.subCategory) {
      setSelectedSubCat(defaultValues.subCategory);
    }
  }, [defaultValues.country, defaultValues.state, defaultValues.city]);
  const { mutate: updateProductById } = useUpdateProductById();
  async function updateProduct(values: UpdatePostInputsProps) {
    setLoad(true);
    const {
      price,
      priceBargain,
      category,
      subCategory,
      delivery,
      description,
      productName,
    } = values;
    const data = {
      price: Number(price),
      price_bargain: priceBargain,
      category_id: category,
      sub_category_id: subCategory,
      delivery_type: delivery,
      description,
      name: productName,
      id: product?.id,
    };
    updateProductById(data, {
      onSuccess: () => {
        setLoad(false);
        showToast({
          header: "Success",
          message: "Product updated successfully",
          messageType: "success",
        });
        router.back();
      },
      onError: () => {
        setLoad(false);
      },
    });
  }
  if (isLoading || loading) {
    return <LoadingScreen text="Loading..." />;
  }
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "left", "right"]}>
      <CustomHeadMenu header={"Edit Post design"} hasImage innerScreen />

      <View className="flex-col flex-1 w-full space-y-2">
        <ScrollView
          className="flex-1 w-full mb-28"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className={`flex-1`}>
            <View
              className={`flex-row justify-between items-center px-3 bg-white   shadow-2xl`}
            >
              <View className={`px-5`}>
                <Text className={`text-red-700 font-semibold`}>
                  Plan:{" "}
                  {myStore?.my_subscription.subscriptionDetails?.name ||
                    "No Subcription"}
                </Text>
              </View>
              <View className={`flex py-2`}>
                <Text className={`text-gray-900 font-semibold `}>
                  Listing available:
                  <Text className={`text-red-700 font-bold `}>
                    {myStore?.my_subscription.subscriptionDetails
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
            </View>

            <View className={` px-2 mt-2 flex items-center`}>
              <Text className={`text-gray-400 text-2xl mt-2 font-bold `}>
                Edit Post {product?.name}
              </Text>
              <View
                className={`mt-3 w-full flex flex-col items-start justify-start space-y-2`}
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
          <View className={` flex-1 flex-row justify-between space-x-1`}>
            <View className="w-1/2">
              <CustomButton
                isDisabled={load}
                text={load ? "Saving..." : "Update"}
                onPress={handleSubmit(updateProduct)}
              />
            </View>
            <View className="w-1/2">
              <CustomButton
                text={"Cancel"}
                type="TERTIARY"
                onPress={() => router.back()}
              />
            </View>
          </View>
        </FooterButtonArea>
      </View>
      {load && <LoadingScreen text="Saving..." />}
    </SafeAreaView>
  );
};

export default EditPostScreen;
