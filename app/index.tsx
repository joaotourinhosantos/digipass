import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/(tabs)/inicio"); 
        } else {
          router.replace("/login");
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return null;
}
