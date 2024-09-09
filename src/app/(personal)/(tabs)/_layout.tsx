import CustomHeader from "@/components/common/CustomHeader";
import Colors from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import { Id } from 'convex/dist/cjs-types/values/value';
import { Tabs, useRouter } from "expo-router";
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};
// import Colors from '../../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}
export default function PersonalTabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: true,
          header: () => <CustomHeader />,
        }}
      />

      <Tabs.Screen
        name="stores"
        options={{
          title: "Stores",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="store" color={color} />,
          href: "/(personal)/stores",
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope" color={color} />
          ),
          tabBarBadge: 0,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => <TabBarIcon name="bars" color={color} />,
        }}
      />
    </Tabs>
  );
}
