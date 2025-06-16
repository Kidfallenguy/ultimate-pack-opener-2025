import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ImageBackground, // <--- Importamos ImageBackground
} from 'react-native';
// No necesitas useNavigation si solo controlas con estado aquí
// import { useNavigation } from '@react-navigation/native';

// Importamos los componentes que se renderizarán directamente
import PenalesLocosScreen from './PenalesLocos'; // <--- Importa el componente
import VsBotsMinigame from './VsBotsMinigame'; // <--- Importa el componente (si es Modal o componente hijo)
import FutDraftScreen from './FutDraftScreen'; // <--- Importa FutDraftScreen para renderizarlo directamente

// URL de la imagen de fondo
const BACKGROUND_MINIJUEGOS_URL = 'https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-19/images/2018/11/fifa19-hero-medium-worldtour-7x2-xl.png.adapt.crop3x5.320w.png';

const styles = StyleSheet.create({
    // Modificamos el container principal para que sea el estilo del ImageBackground
    backgroundContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center', // Centra el contenido verticalmente
        alignItems: 'center', // Centra el contenido horizontalmente
        // Eliminamos backgroundColor ya que usaremos una imagen de fondo
        // backgroundColor: '#222',
    },
    // Añadimos un contenedor interno para los botones si quieres que tengan un fondo semi-transparente sobre la imagen
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 28, // Quizás un poco más grande para que destaque
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30, // Más espacio debajo del título
        textShadowColor: '#000', // Sombra de texto para mejor legibilidad sobre la imagen
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    gameButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 8, // Ajustado ligeramente el margen
        width: 250, // Ancho fijo para consistencia
        alignItems: 'center',
        shadowColor: "#000", // Sombra para los botones
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    gameButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default function MinijuegosScreen() {
    // No necesitas useNavigation aquí
    // const navigation = useNavigation();

    // Usamos estado para manejar qué minijuego se muestra directamente en esta pantalla
    // Los valores pueden ser: null (menú principal), 'penales', 'vs_bot', 'fut_draft'
    const [currentGame, setCurrentGame] = useState(null);
    // Los modals pueden tener su propio estado de visibilidad, separado de currentGame
    const [isVsBotsVisible, setIsVsBotsVisible] = useState(false);
    // Mantenemos isFutDraftVisible para manejarlo como un modal o componente hijo si es necesario
    // PERO para este ejemplo, FutDraft lo manejaremos con currentGame igual que Penales Locos
    // const [isFutDraftVisible, setIsFutDraftVisible] = useState(false);


    // Función para regresar al menú principal de minijuegos
    const goBackToMinijuegosMenu = () => {
        setCurrentGame(null); // Establecer currentGame a null renderizará el menú principal
        // Asegúrate de cerrar también cualquier modal si estuvieran abiertos al salir de un juego
        setIsVsBotsVisible(false);
        // setIsFutDraftVisible(false); // Si FutDraft no es modal y se maneja con currentGame, no necesitas esto aquí
    };


    // Función para abrir el modal VS Bots
    const openVsBots = () => {
        setIsVsBotsVisible(true);
        setCurrentGame(null); // Asegura que no se esté mostrando Penales Locos o FutDraft
        // setIsFutDraftVisible(false); // Si FutDraft no es modal, no necesitas esto
    };

    // Función para cerrar el modal VS Bots
    const closeVsBots = () => {
        setIsVsBotsVisible(false);
        // Opcional: si quieres volver al menú principal al cerrar el modal, llama a goBackToMinijuegosMenu()
        // goBackToMinijuegosMenu();
    };

    // *** Función para lanzar FUT Draft - la manejaremos con currentGame ***
    const launchFutDraft = () => {
        setCurrentGame('fut_draft'); // Establece el estado para mostrar FutDraftScreen
        setIsVsBotsVisible(false); // Asegura que el modal VS Bots esté cerrado
        // setIsFutDraftVisible(false); // Si FutDraft no es modal, no necesitas esto
    };


    // *** Renderizado Condicional: Decide qué mostrar en esta pantalla ***

    // Si currentGame es 'penales', muestra PenalesLocosScreen
    if (currentGame === 'penales') {
        // Renderiza PenalesLocosScreen y le pasa la función goBackToMinijuegosMenu como prop 'onExit'
        return <PenalesLocosScreen onExit={goBackToMinijuegosMenu} />;
    }

    // Si currentGame es 'fut_draft', muestra FutDraftScreen
    if (currentGame === 'fut_draft') {
        // Renderiza FutDraftScreen. Asumimos que FutDraftScreen también necesitará una prop onExit si tiene un botón de salir interno.
        // Deberías modificar FutDraftScreen de forma similar a PenalesLocosScreen para aceptar y usar onExit.
        return <FutDraftScreen onExit={goBackToMinijuegosMenu} />; // <--- Pasa la callback onExit también aquí
    }

    // *** Si ningún juego está activo, muestra el menú principal ***
    return (
        // Usamos ImageBackground como contenedor principal
        <ImageBackground
            source={{ uri: BACKGROUND_MINIJUEGOS_URL }} // <--- La URL de la imagen
            style={styles.backgroundContainer} // <--- Aplicamos el estilo para cubrir y centrar
            resizeMode="cover" // Asegura que la imagen cubra el área sin distorsión
        >
            {/* Contenedor para el contenido (título y botones) con fondo semi-transparente */}
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Minijuegos</Text>

                {/* Botón para lanzar Penales Locos */}
                <TouchableOpacity
                    style={styles.gameButton}
                    onPress={() => setCurrentGame('penales')} // <-- Cambia el estado para mostrar Penales Locos
                >
                    <Text style={styles.gameButtonText}>Jugar Penales Locos</Text>
                </TouchableOpacity>

                {/* Botón para lanzar VS Bot - Abre un modal */}
                <TouchableOpacity style={styles.gameButton} onPress={openVsBots}>
                    <Text style={styles.gameButtonText}>Modo VS Bot</Text>
                </TouchableOpacity>

                {/* Botón para lanzar FUT Draft - Llama a la nueva función launchFutDraft */}
                <TouchableOpacity style={styles.gameButton} onPress={launchFutDraft}> //
                    <Text style={styles.gameButtonText}>FUT Draft</Text>
                </TouchableOpacity>
            </View>


            {/* Modal para VS Bot (Basado en tu código anterior) */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={isVsBotsVisible}
                onRequestClose={closeVsBots} // <-- Asegúrate de que onClose cierre el modal
            >
                <VsBotsMinigame onClose={closeVsBots} /> {/* Pasa la prop onClose al modal */}
            </Modal>

             {/* Si FutDraft fuera un modal, su Modal iría aquí también en lugar del renderizado condicional con currentGame */}
        </ImageBackground>
    );
}