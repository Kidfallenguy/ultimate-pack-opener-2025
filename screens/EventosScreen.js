import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native'; // Importar ScrollView
import { useNavigation } from '@react-navigation/native';

// *** ESTA LÍNEA ES CRÍTICA PARA USAR LA IMAGEN LOCAL DEL BANNER BETA ***
// *** DEBES ASEGURARTE DE QUE LA RUTA Y EL NOMBRE DEL ARCHIVO SEAN 100% CORRECTOS EN TU PROYECTO DE SNACK ***
// ** VERIFICA TU EXPLORADOR DE ARCHIVOS EN SNACK **
import betaBannerImage from '../assets/beta-banner.png'; // <--- ¡¡VERIFICA ESTA LÍNEA Y LA RUTA!!

// URL de la imagen de fondo remota (si la sigues queriendo de fondo de pantalla principal)
const BACKGROUND_IMAGE_URL = 'https://pbs.twimg.com/media/F4y5AYXXgAEX-FO.jpg';

// URL de la imagen del banner de Champions (remota)
const CHAMPIONS_BANNER_IMAGE_URL = 'https://marketing4ecommerce.net/wp-content/uploads/2018/06/champions-logo-1024x548.jpg';


const EventosScreen = () => {
    const navigation = useNavigation();

    // Función para navegar al evento Beta
    const handleBetaBannerPress = () => {
        navigation.navigate('BienvenidaBeta');
    };

    // Función para navegar al evento de Champions
    const handleChampionsBannerPress = () => {
        // Navega a la pantalla registrada como 'ChampionsLeagueEvent' en App.js
        navigation.navigate('ChampionsLeagueEvent');
    };


    return (
        // Usamos ImageBackground como contenedor principal (si quieres la imagen remota de fondo)
        <ImageBackground
            source={{ uri: BACKGROUND_IMAGE_URL }} // Fuente de la imagen remota principal
            style={styles.backgroundContainer} // Estilo para que cubra toda la pantalla
            resizeMode="cover"
        >
            {/* Usamos ScrollView para que el contenido sea desplazable si hay muchos eventos */}
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Contenido de la pantalla */}

                {/* Título */}
                <Text style={styles.title}>Eventos Activos</Text>

                {/* BIENVENIDO A LA BETA Banner - Usando IMAGEN LOCAL */}
                <TouchableOpacity
                    style={styles.bannerContainer} // Estilo para el área clickeable
                    onPress={handleBetaBannerPress}
                >
                    {/* ESTE ES EL COMPONENTE IMAGE QUE USA TU IMAGEN LOCAL */}
                    <Image
                        source={betaBannerImage} // Usa la imagen LOCAL importada (desde '../assets/beta-banner.png')
                        style={styles.bannerImage} // Estilo para que la imagen llene el contenedor
                        resizeMode="cover" // Ajusta cómo la imagen se muestra dentro del área
                    />
                    {/* Opcional: Puedes superponer texto si quieres (usa bannerTextOverlay si lo necesitas) */}
                     {/* <View style={styles.bannerTextOverlay}>
                         <Text style={styles.bannerText}>BIENVENIDO A LA BETA</Text>
                     </View> */}
                </TouchableOpacity>

                {/* *** NUEVO BANNER PARA EL EVENTO DE LA CHAMPIONS LEAGUE *** */}
                <TouchableOpacity
                    style={styles.bannerContainer} // Reutilizamos el mismo estilo de contenedor
                    onPress={handleChampionsBannerPress} // Llama a la nueva función de navegación
                >
                    {/* Usamos Image con la URL remota para el banner de Champions */}
                    <Image
                        source={{ uri: CHAMPIONS_BANNER_IMAGE_URL }} // Usa la URL REMOTA
                        style={styles.bannerImage} // Reutilizamos el mismo estilo de imagen
                        resizeMode="cover" // Ajusta cómo la imagen se muestra
                    />
                     {/* Opcional: Puedes superponer texto temático de Champions si quieres */}
                     {/* <View style={styles.bannerTextOverlay}>
                         <Text style={[styles.bannerText, styles.championsBannerText]}>¡Noche de Champions!</Text>
                     </View> */}
                </TouchableOpacity>


                {/* Add more banners here */}

            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    // Estilo para el ImageBackground (fondo de pantalla principal)
    backgroundContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        // Eliminamos alignItems y justifyContent aquí para que ScrollView maneje el layout
    },
    // Estilo para el contenido dentro del ScrollView
    scrollViewContent: {
        flexGrow: 1, // Permite que el contenido crezca y sea desplazable
        alignItems: 'center', // Centra los elementos horizontalmente dentro del ScrollView
        padding: 20, // Añade padding alrededor de los elementos
    },

    // Estilo del Título
    title: {
        fontSize: 28, // Tamaño un poco más grande
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Ajusta color para que se lea sobre el fondo
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },

    // Estilo para el contenedor clickeable del banner
    bannerContainer: {
        width: '100%', // Ocupa todo el ancho disponible en el ScrollView con padding
        height: 150, // Altura del banner
        borderRadius: 10,
        marginBottom: 15, // Espacio entre banners
        overflow: 'hidden', // Crucial para que la imagen interna respete el borde redondeado
        // Añadir sombra para un mejor efecto visual
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },

    // ESTILO PARA LA IMAGEN DENTRO DEL BANNER
    bannerImage: {
        width: '100%', // La imagen ocupa todo el ancho del contenedor padre (bannerContainer)
        height: '100%', // La imagen ocupa todo el alto del contenedor padre
    },

    // Estilo si quieres poner texto *encima* de la imagen del banner
     bannerTextOverlay: {
         position: 'absolute',
         top: 0, left: 0, right: 0, bottom: 0,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparente
     },

    // Estilo del texto dentro del banner (si usas el overlay de texto)
    bannerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    // Estilo específico para el texto del banner de Champions (opcional)
    championsBannerText: {
        color: '#ffeb3b', // Amarillo/Dorado para el texto de Champions
    }
});

export default EventosScreen;
