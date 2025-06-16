// screens/CartasScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import GameContext from '../context/GameContext';
import Card from  '../components/Card';
import { playerImages, genericImages } from '../assets/playerImages';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fondo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'white', // Asegura que el texto sea visible sobre el fondo
  },
  listContainer: {
    flex: 1,
  },
  emptyCollection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'white', // Asegura que el texto sea visible sobre el fondo
  },
  cardContainer: {
    marginBottom: 15,
    marginHorizontal: 5,
  },
  cardWithSell: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: 'rgba(220,53,69,0.8)', // Un rojo más oscuro y semitransparente
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'center',
  },
  sellButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const CartasScreen = () => {
  const { collection, sellCard, calculateSellValue } = useContext(GameContext);
  console.log('Contenido de la colección en CartasScreen:', collection);

    const handleSellCard = (instanceId) => { // Cambia cardId a instanceId aquí también para claridad
        const sellValue = sellCard(instanceId); // <-- ¡Aquí le pasas instanceId!
        if (sellValue > 0) {
            // El alert ya se maneja dentro de sellCard en GameContext, podrías quitarlo aquí
            // alert(`Vendiste la carta por ${sellValue} monedas.`);
        } else {
            // El alert ya se maneja dentro de sellCard en GameContext, podrías quitarlo aquí
            // alert('No se pudo vender la carta.');
        }
    };


    const renderItem = ({ item }) => (
        <View style={styles.cardContainer}>
            <View style={styles.cardWithSell}>
                <Card player={item} />
                {/* CAMBIO CLAVE AQUÍ: item.instanceId en lugar de item.id */}
                <TouchableOpacity style={styles.sellButton} onPress={() => handleSellCard(item.instanceId)}>
                    <Text style={styles.sellButtonText}>Vender ({calculateSellValue(item.rating)} 💰)</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

  const keyExtractor = (item) => item.id;

  return (
    <ImageBackground
      source={{ uri: 'https://pbs.twimg.com/media/GSzdyXMXgAEBO_y.jpg:large' }}
             style={styles.fondo}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Mi Colección de Cartas</Text>
                <View style={styles.listContainer}>
                    {collection && collection.length > 0 ? (
                        <FlatList
                            data={collection}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor} // Asegúrate de que esto use item.instanceId
                            numColumns={2}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    ) : (
                        <View style={styles.emptyCollection}>
                            <Text style={styles.emptyText}>Tu colección está vacía.</Text>
                        </View>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
};

export default CartasScreen;