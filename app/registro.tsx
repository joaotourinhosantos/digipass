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

export default function RegistroScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");

  const registrar = async () => {
    if (!email || !senha || !nome || !contato) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha,
          nome,
          contato,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Sucesso", "Usuário registrado com sucesso!");
        router.replace("/login");
      } else {
        Alert.alert("Erro", data.error || "Não foi possível registrar");
      }
    } catch (err) {
      Alert.alert("Erro", "Erro ao conectar ao servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Novo Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Contato (DDD + número)"
        value={contato}
        onChangeText={setContato}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Voltar para login</Text>
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
    marginBottom: 20,
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
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    color: "#007aff",
    marginTop: 8,
  },
});
