import { Database } from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type ProfileRole = "personal" | "business";
export type LegalInfoForm = {
  first_name?: string;
  last_name?: string;
  gender?: string;
  age?: string;
};
export type EmailInfoForm = {
  email?: string;
};
export type PasswordInfoForm = {
  password?: string;
};
export type LocationInfoForm = {
  country?: number | null;
  state?: number | null;
  city?: number | null;
  address?: string;
};
export type BusinessInfoForm = {
  business_name?: string;
  phone?: string;
  business_number?: string;
  description?: string;
};
export type ExperienceInfoForm = {
  experience?: string;
  phone?: string;
  description?: string;
};

export type EducationFormProps = {
  details?: string;
};
export type AreaSpecialFormProps = {
  areaOfSpecial?: string;
};

export type LegalInfoProps = {
  nextStep: (data: {
    info: string;
    isBack?: boolean;
    isSubmit?: boolean;
    data?: LegalInfoForm &
      LocationInfoForm &
      EmailInfoForm &
      PasswordInfoForm &
      EducationFormProps &
      AreaSpecialFormProps &
      BusinessInfoForm;
  }) => void;
};

export type BusinessAccountProps = Tables<"profiles"> & {
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
};

export type BusinessStoreProps = Tables<"stores"> & {
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
  profile: Tables<"profiles">;
  products: Tables<"products">[] & {
    product_images: Tables<"product_images">[];
  };
  my_subscription: Tables<"subscription_history"> & {
    subscriptionDetails: Tables<"subcriptions">;
  };
};

export type PersonalAccountProps = Tables<"profiles"> & {
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
  favorite_products: Tables<"product_likes">[] & {
    product: Tables<"products">[] & {
      product_images: Tables<"product_images">[];
    };
  };
};

export type TailorAccountProps = Tables<"tailors"> & {
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
};
export type PasswordFormProps = {
  old_password: string;
  password: string;
  password_confirmation: string;
};

export type EditPersonalFormProps = {
  firstName: string;
  lastName: string;
  phone: string;
  username?: string;
  country: number | null;
  state: number | null;
  city: number | null;
  address: string;
  description: string;
  image?: string;
};

export type EditBusinessFormInput = {
  name: string;
  businessNumber?: string;
  phone: string;
  email: string;
  address: string;
  country: number | null;
  state: number | null;
  city: number | null;
  description?: string;
  image: string;
  imageType?: "";
};

export type DropdownProps =
  | Tables<"countries">
  | Tables<"states">
  | Tables<"cities">
  | Tables<"categories">
  | Tables<"sub_categories">;

export type CategoryType = {
  label: string;
  value: number;
};
export type SubCategoryType = {
  label: string;
  value: number;
};
export type CountryType = {
  label: string;
  value: number;
};
export type StateType = {
  label: string;
  value: number;
};

export type CityType = {
  label: string;
  value: number;
};

export type extraMenusProps = {
  header: string;
  icon: string;
  items: itemsProps[];
};
export type itemsProps = {
  label: string;
  icon: string;
  type: string;
  value?: boolean;
  color: string;
  option?: () => void;
};

export type BugFormInput = {
  profile_id: string;
  title: string;
  description: string;
};

export type ContactFormInputProps = {
  fullName: string;
  email: string;
  subject?: string | null;
  message: string;
};

export type SubscriptionHistoryProps = Tables<"subscription_history"> & {
  subscriptionDetails: Tables<"subcriptions">;
};

export type LikedFavoriteProductProps = Tables<"product_likes"> & {
  product: Tables<"products">[] & {
    product_images: Tables<"product_images">[];
  };
};

export type ProductProps = Tables<"products"> & {
  product_images: Tables<"product_images">[];
  category: Tables<"categories">;
  sub_category: Tables<"sub_categories">;
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
  store: Tables<"stores">;
  product_likes: Tables<"product_likes">[];
  productViews: Tables<"product_views">[];
};

export type InsertPostInputsProps = {
  productName: string;
  price: string;
  priceBargain: boolean;
  delivery: "delivery" | "pickup" | "both";
  category: number | null;
  subCategory: number | null;
  description: string;
  store: number | null;
  city: number | null;
  state: number | null;
  country: number | null;
  readyInPlaceHolder: string;
  period_taken: string;
  period: string;
};

export type UpdatePostInputsProps = {
  id?: number;
  productName: string;
  price: number | string;
  priceBargain: boolean;
  delivery: "delivery" | "pickup" | "both";
  category: number | null;
  subCategory: number | null;
  description: string;
  store?: number | null;
  city?: number | null;
  state?: number | null;
  country?: number | null;
  readyInPlaceHolder?: string;
  period_taken?: string;
  period?: string;
};

export type UserRole = "personal" | "business";

export interface ImageProps {
  assetId: string;
  uri: string;
}

export type DeleteImageProps = {
  productId: number;
  file: string;
  bucket: string;
};

export type ImageUploadProps = {
  image: string;
  bucket: string;
  path?: string;
};

export type ImageUrlProps = {
  file: string;
  bucket: string;
};

export type AvatarImageProps = {
  size?: number;
  name?: string;
  file?: string | null;
  bucket?: string;
};

export type StoreImageProps = {
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  radius?: number;
  width?: number | string;
  height?: number | string;
  file?: string;
};

export type StoreWithStateProps = Tables<"stores"> & {
  state: Tables<"states">;
};

export type SearchBarProps = {
  onSearch: (value: string) => void;
  hasFilter?: boolean;
  hasFullWidth?: boolean;
  openFilter?: (value: any) => void;
  name?: "filter" | "stores";
  type?: string;
  data?: number | [];
};

export type SearchInputProps = {
  onChangeSearch: (value: string) => void;
};
export type StoreFrontDetailsProps = Tables<"stores"> & {
  city: Tables<"cities">;
  state: Tables<"states">;
  country: Tables<"countries">;
  profile: Tables<"profiles">;
  products: Tables<"products">[] & {
    product_images: Tables<"product_images">[];
  };
  storeLikes: Tables<"store_likes">[];
};

export type ConversationMessageProps = Tables<"conversation"> & {
  messages: Tables<"messages">[];
  buyer: Tables<"profiles">;
  seller: Tables<"profiles"> & {
    stores: Tables<"stores">[];
  };
};

export type MessageDataProps = Tables<"messages"> & {
  sender: Tables<"profiles">;
  receiver: Tables<"profiles">;
};
