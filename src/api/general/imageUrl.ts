import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { showToast } from "@/lib/helper";
import { DeleteImageProps, ImageUploadProps, ImageUrlProps } from "@/types";

export const useGetImageUrl = ({ file, bucket }: ImageUrlProps) => {
  return useQuery({
    queryKey: ["image", file],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(file, 60 * 15, {
          download: true,
        });
      if (error) {
        throw new Error(error.message);
      }
      return data.signedUrl;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const doImageUpload = async ({
  image,
  bucket,
  path,
}: ImageUploadProps) => {
  if (!image?.startsWith("file://")) {
    return;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: "base64",
  });
  let filePath;
  if (path) {
    filePath = `${path}/${randomUUID()}.png`;
  } else {
    filePath = `${randomUUID()}.png`;
  }
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, decode(base64), { contentType });

  if (error) {
    showToast({
      header: "Error",
      messageType: "error",
      message: error.message,
    });
    return;
  }

  return data.path;
};

export const deleteImageById = async ({
  productId,
  file,
  bucket,
}: DeleteImageProps) => {
  const { data, error } = await supabase.storage.from(bucket).remove([file]);
  if (error) {
    throw new Error(error.message);
  }
  if (data) {
    const { error, data } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId)
      .eq("image_url", file);

    return data;
  }
};
