import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomHeadMenu from "@/components/common/CustomHeadMenu";
import { blurhash } from "@/lib/helper";
import { Image } from "expo-image";
import { appLogo } from "@/lib/images";
export default function PostImageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fileUrl = params.fileUrl as string | undefined;
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <CustomHeadMenu header="Post Image" innerScreen />
      <Image
        source={fileUrl ? { uri: fileUrl } : appLogo}
        placeholder={blurhash}
        cachePolicy={"memory-disk"}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f3f4f6",
        }}
        contentFit="contain"
        transition={1000}
      />
    </SafeAreaView>
  );
}
