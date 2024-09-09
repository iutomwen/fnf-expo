import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useAuth } from "@/providers/AuthProvider";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { session, isBusiness } = useAuth();
  const router = useRouter();
  if (!session) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  if (!isBusiness) {
    return <Redirect href={"/(personal)"} />;
  }
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
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push("/modal");
              }}
            >
              <FontAwesome
                name="search"
                size={25}
                color={Colors.primary}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="my-designs"
        options={{
          title: "My Designs",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="cut" color={color} />,
        }}
        listeners={() => {
          return {
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              router.push("/(business)/(tabs)/my-designs");
            },
          };
        }}
      />
      <Tabs.Screen
        name="post-designs"
        options={{
          title: "Post Designs",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="plus-square" color={color} />
          ),
        }}
        listeners={() => {
          return {
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              router.push("/(business)/(tabs)/post-designs");
            },
          };
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          headerShown: false,
          tabBarBadge: 0,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope-o" color={color} />
          ),
        }}
        listeners={() => {
          return {
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              router.push("/(business)/(tabs)/messages");
            },
          };
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="favorites"
        options={{
          // This tab will no longer show up in the tab bar.
          href: null,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="navicon" color={color} />
          ),
          // tabBarBadge: 3,
        }}
        // listeners={() => {
        //   return {
        //     tabPress: (e) => {
        //       // Prevent default action
        //       e.preventDefault();
        //       // Do something with the `navigation` object
        //       router.push("/(business)/(tabs)/more");
        //     },
        //   };
        // }}
      />
    </Tabs>
  );
}
