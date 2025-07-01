
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const limparCampos = () => {
    if (email !== "" || password !== "") {
      setEmail("");
      setPassword("");
    } else {
      Alert.alert("Os campos já estão vazios!");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert("Login OK");
        router.replace("/(tabs)/inicio");
      } else {
        Alert.alert("Erro", data.error || "Usuário ou senha inválidos");
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CardPass</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cleanButton} onPress={limparCampos}>
          <FontAwesome5 name="broom" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.or}>ou</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar com a digital cadastrada</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.registroButton}
  onPress={() => router.push("/registro")}
>
  <Text style={styles.buttonText}>Registrar novo usuário</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4DDE2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
  },
  cleanButton: {
    flex: 0.15,
    height: 45,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  loginButton: {
    flex: 0.83,
    height: 45,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  or: {
    marginTop: 12,
    color: "#555",
  },
  registroButton: {
  width: "100%",
  height: 45,
  backgroundColor: "#007aff",
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 12,
},

});
