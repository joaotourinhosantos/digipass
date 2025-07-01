import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: {
          backgroundColor: "#000",
          height: 60,
        }, }}>
      <Tabs.Screen
        name="registro"
        options={{
          title: "Registrar",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="plus" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="house-user" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
