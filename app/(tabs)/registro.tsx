import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegistroScreen() {
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [observacao, setObservacao] = useState("");

  const handleSalvar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://localhost:3000/movimentacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tipo, observacao }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Sucesso", "Registro salvo com sucesso!");
        setObservacao("");
      } else {
        Alert.alert("Erro", data.error || "Erro ao salvar registro");
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Registro</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.selectButton, tipo === "entrada" && styles.activeButton]}
          onPress={() => setTipo("entrada")}
        >
          <Text style={styles.buttonText}>Registrar Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectButton, tipo === "saida" && styles.activeButton]}
          onPress={() => setTipo("saida")}
        >
          <Text style={styles.buttonText}>Registrar Saída</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observações"
        placeholderTextColor="#999"
        multiline
        value={observacao}
        onChangeText={setObservacao}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCDFE7",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  selectButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#80ced6",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  input: {
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
