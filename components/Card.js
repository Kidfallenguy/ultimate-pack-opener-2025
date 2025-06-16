import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Importa el mapa centralizado de imágenes y las genéricas
// Asegúrate de que la ruta '../assets/playerImages' sea correcta
import { playerImages, genericImages } from '../assets/playerImages';

// El componente Card ahora recibe 'showPrice' como una prop adicional
const Card = ({ player, showPrice }) => {
  // *** DEBUG LOGS ***
  // Puedes dejar estos logs durante el desarrollo y quitarlos en producción
  console.log('DEBUG_CARD: Componente Card renderizado');
  console.log('DEBUG_CARD: Player prop recibido:', player);
  console.log('DEBUG_CARD: Player ID base (imageUri) usado para buscar (debería ser player.id):', player?.imageUri);
  console.log('DEBUG_CARD: Player Instance ID (para la colección):', player?.id);

  console.log('DEBUG_CARD: playerImages definido:', !!playerImages);
  console.log('DEBUG_CARD: genericImages definido:', !!genericImages);
  console.log('DEBUG_CARD: genericImages.placeholder_player definido:', !!genericImages?.placeholder_player);

  let imageSource;
  // CORRECCIÓN CLAVE: Usar player?.imageUri para buscar la imagen en playerImages
  // El 'imageUri' del objeto player es la clave correcta en playerImages.js
  if (player?.imageUri && playerImages && playerImages[player.imageUri]) { // <<< CAMBIO CLAVE AQUÍ
    imageSource = playerImages[player.imageUri]; // <<< CAMBIO CLAVE AQUÍ
    console.log('DEBUG_CARD: Usando imagen específica para Image ID:', player.imageUri); // Puedes mantener este log para depurar
  } else if (genericImages?.placeholder_player) {
    imageSource = genericImages.placeholder_player;
    console.log('DEBUG_CARD: Usando imagen placeholder.'); // Puedes mantener este log
  } else {
    imageSource = null;
    console.log('DEBUG_CARD: No hay imagen específica ni placeholder disponible para Image ID:', player?.imageUri); // Puedes mantener este log
  }

  console.log('DEBUG_CARD: imageSource final:', imageSource);

  if (!player) {
    console.warn("Card component received no player data.");
    return <View style={styles.card}><Text>Sin datos de jugador</Text></View>;
  }

  return (
    <View style={styles.card}>
      {/* Asegúrate de que imageSource no es null/undefined antes de intentar renderizar la imagen */}
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.image}
          // Maneja errores de carga de imagen (útil para depuración de rutas en playerImages.js)
          onError={(error) => console.error('DEBUG_CARD: Error cargando imagen para ID:', player?.id, 'Source:', imageSource, 'Error:', error.nativeEvent.error)}
        />
      )}
      {/* Si no hay imagen (ni específica ni placeholder), muestra un recuadro gris */}
      {!imageSource && (
        <View style={[styles.image, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 10, textAlign: 'center', color: '#666' }}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{player?.name || 'Desconocido'}</Text>
        <Text style={styles.rating}>{player?.rating || ''} GRL</Text>
        {/* Muestra el precio SOLO si showPrice es true y el precio existe */}
        {showPrice && player?.precio !== undefined && (
          <Text style={styles.priceText}>{player.precio} 💰</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Para que la imagen y la info estén en la misma fila
    alignItems: 'center', // Para alinear verticalmente
    backgroundColor: '#fff', // Fondo blanco para la carta
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000', // Sombra para un efecto más flotante
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: 'auto', // Ajusta el ancho automáticamente al contenido
    // Quitamos el ancho fijo '100%' de aquí, ya que el contenedor padre (jugadorContainer) lo maneja
  },
  image: {
    width: 70, // Tamaño de la imagen
    height: 70,
    borderRadius: 35, // Para imágenes redondas si quieres
    marginRight: 10,
    resizeMode: 'cover', // Ajusta el modo de redimensionamiento según tus imágenes
    borderColor: '#eee', // Borde ligero alrededor de la imagen
    borderWidth: 1,
  },
  info: {
    flex: 1, // Para que la información ocupe el espacio restante
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#555',
  },
  priceText: { // Estilo para el precio
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFD700', // Dorado para las monedas, o el color que prefieras
    marginTop: 5,
  },
});

export default Card;