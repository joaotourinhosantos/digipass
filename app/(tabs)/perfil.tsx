import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Perfil = {
  nome: string;
  email: string;
  contato: string;
};

export default function PerfilScreen() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  const buscarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado.");
        router.replace("/login");
        return;
      }

      const res = await fetch("http://localhost:3000/usuarios/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setPerfil(data);
      } else {
        Alert.alert("Erro", data.error || "Erro ao carregar perfil.");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const deslogar = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  useEffect(() => {
    buscarPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.centered}>
        <Text>Perfil não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{perfil.nome}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{perfil.email}</Text>

      <Text style={styles.label}>Contato:</Text>
      <Text style={styles.value}>{perfil.contato}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={deslogar}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4DDE2",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
