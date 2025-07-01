import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

type Movimentacao = {
  id: number;
  tipo: "entrada" | "saida";
  data: string;
  observacao: string;
};

export default function Inicio() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarMovimentacoes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
        return;
      }

      const res = await fetch("http://localhost:3000/movimentacoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMovimentacoes(data);
      } else {
        Alert.alert("Erro", data.error || "Erro ao buscar movimentações");
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const deletarMovimentacao = async (id: number) => {

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      console.log("Token não encontrado");
      return;
    }

    const res = await fetch(`http://localhost:3000/movimentacoes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Resposta da exclusão:", data);

    if (res.ok) {
      buscarMovimentacoes();
    } else {
      alert(data.error || "Erro ao excluir");
    }
  } catch (err) {
    console.error("Erro na exclusão:", err);
    alert("Erro ao excluir movimentação");
  }
};


  useFocusEffect(
    useCallback(() => {
      buscarMovimentacoes();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarMovimentacoes();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Movimentacao }) => {
    const dataFormatada = new Date(item.data).toLocaleString("pt-BR");

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.tipo}>
            {item.tipo === "entrada" ? "🔵 Entrada" : "🔴 Saída"}
          </Text>
          <TouchableOpacity
  onPress={() => deletarMovimentacao(item.id)}
  style={styles.trashButton}
>
  <FontAwesome5 name="trash" size={18} color="#900" />
</TouchableOpacity>


        </View>

        <Text style={styles.data}>{dataFormatada}</Text>
        {item.observacao ? (
          <Text style={styles.obs}>Obs: {item.observacao}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Atividades</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : movimentacoes.length === 0 ? (
        <View style={styles.semDados}>
          <Text style={styles.semTexto}>Sem registros de atividades</Text>
        </View>
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCDFE7",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tipo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  data: {
    color: "#555",
    marginBottom: 4,
  },
  obs: {
    fontStyle: "italic",
    color: "#333",
  },
  semDados: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  semTexto: {
    fontSize: 16,
    color: "#444",
  },
  trashButton: {
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#eee",
},

});
