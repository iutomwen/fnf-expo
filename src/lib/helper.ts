import { Alert } from "react-native";
import Toast, {
  ToastPosition,
  ToastShowParams,
} from "react-native-toast-message";
export const primaryColor = "#373136";
export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const currencyFormat = (price: {
  toLocaleString: (
    arg0: string,
    arg1: { style: string; currency: string }
  ) => any;
}) => {
  return price?.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};

export const deleteUser = async (id: any) => {
  const user = false;
  Alert.prompt("Type 'DELETE' to remove account", "", async (text) => {
    if (text === "DELETE") {
      // const { data: user, error } = await supabase.auth.api.deleteUser(id);
      // if (user) {
      //   alert("Account Deleted");
      // }
      // if (error) {
      //   Alert.alert(error?.message);
      // }
    } else {
      Alert.alert("Failed to delete");
    }
  });
};

export const validateEmail = (email: any) => {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase());
};

type DropdownType = {
  value: string | boolean | number;
  label: string;
};

export const contactOptions: DropdownType[] = [
  {
    value: "General Enquiry",
    label: "General Enquiry",
  },
  {
    value: "Technical Issue",
    label: "Technical Issue",
  },
  {
    value: "Membership",
    label: "Membership",
  },

  {
    value: "Suggestion",
    label: "Suggestion",
  },
  {
    value: "Something else",
    label: "Something else",
  },
];
export const types: DropdownType[] = [
  {
    label: "Ready made (made to wear)",
    value: "readymade",
  },
  {
    label: "Custom make",
    value: "custom",
  },
  {
    label: "Ready made and Custom make",
    value: "both",
  },
];
export const gender: DropdownType[] = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const yearsOfExperience: DropdownType[] = [
  {
    label: "0 - 2 years",
    value: "0-2",
  },
  {
    label: "2 - 5 years",
    value: "2-5",
  },
  {
    label: "5 - 10 years",
    value: "5-10",
  },
  {
    label: "10+ years",
    value: "10+",
  },
];
export const priceBargain: DropdownType[] = [
  {
    label: "Negotiable",
    value: true,
  },
  {
    label: "Not Negotiable",
    value: false,
  },
];

export const deliveryType: DropdownType[] = [
  {
    value: "delivery",
    label: "Delivery Only",
  },
  {
    value: "pickup",
    label: "Pickup Only",
  },
  {
    value: "both",
    label: "Delivery and Pickup",
  },
];

export const readyIn: DropdownType[] = [
  {
    value: "day",
    label: "Days",
  },
  {
    value: "week",
    label: "Weeks",
  },
];

export const showToast = ({
  messageType,
  header = "",
  message,
  position = "bottom",
}: {
  messageType: ToastShowParams["type"];
  header?: string;
  message: string;
  position?: ToastPosition;
}) => {
  Toast.show({
    position,
    type: messageType,
    text1: header,
    text2: message,
  });
};

type kFormatterType = number;
export const kFormatter = (number: kFormatterType) => {
  // return Math.abs(num) > 999
  //   ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
  //   : Math.sign(num) * Math.abs(num);
  var unitlist = ["", "K", "M", "G"];
  let sign = Math.sign(number);
  let unit = 0;

  while (Math.abs(number) >= 1000) {
    unit = unit + 1;
    number = Math.floor(Math.abs(number) / 100) / 10;
  }
  return sign * Math.abs(number) + unitlist[unit];
};

export const theme = {
  colors: {
    primary: primaryColor,
    white: "#fff",
    black: "#000",
    searchIcon: "#999",
    searchText: "#444",
    searchBackground: "#f0f0f0",
    title: "#000",
    subTitle: "#555",
    storyBorder: "#00f",
    description: "#9f9f9f",
    inputBackground: "#f0f0f0",
    inputText: "#000",
    messageBackground: "#1B5583",
    danger: "#df4759",
    success: "#4b0",
    light: "#ccc",
    halfOpacitySecondary: "rgba(240, 149, 17, 0.5)",
    halfOpacityPrimary: "rgba(0, 132, 255, 0.5)",
    // storyBorder: "#00f",
  },
  fontSize: {
    title: 18,
    subTitle: 13,
    message: 15,
  },
};

export const Colors = {
  bg: primaryColor,
  active: "#fff",
  inactive: "#eee",
  transparent: "transparent",
};

export function dynamicSort(property: any) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: { [x: string]: number }, b: { [x: string]: number }) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function addDays(date: string | number | Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const blurhash = "LNOM~eV@-;ozxuj[j[a}~qozD%V@";

export const formatDate = (date: string | number | Date) => {
  let options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-GB", options);
};

export const formatTimestamp = (timestamp: Date) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};

// export const getUserCountry = ({
//   id,
//   countries,
// }: {
//   id: Id<"country">;
//   countries: Doc<"country">[];
// }) => {
//   const country = countries.find((country) => country._id === id);
//   return country;
// };

// export const getUserState = ({
//   id,
//   states,
// }: {
//   id: Id<"state">;
//   states: Doc<"state">[];
// }) => {
//   const state = states.find((state) => state._id === id);
//   return state;
// };

// export const getUserCity = ({
//   id,
//   cities,
// }: {
//   id: Id<"city">;
//   cities: Doc<"city">[];
// }) => {
//   const city = cities.find((city) => city._id === id);
//   return city;
// };

// export const getCategoryById = ({
//   id,
//   categories,
// }: {
//   id: Id<"categories">;
//   categories: Doc<"categories">[];
// }) => {
//   const category = categories.find((category) => category._id === id);
//   return category;
// };

// export const getSubCategoryById = ({
//   id,
//   subCategories,
// }: {
//   id: Id<"sub_categories">;
//   subCategories: Doc<"sub_categories">[];
// }) => {
//   const subCategory = subCategories.find(
//     (subCategory) => subCategory._id === id
//   );
//   return subCategory;
// };
