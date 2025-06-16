import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, style, textStyle, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]} // Aplica estilos base y luego los personalizados
            onPress={onPress}
            disabled={disabled} // Para deshabilitar el botón si es necesario
            activeOpacity={0.7} // Controla la opacidad al presionar
        >
            <Text style={[styles.buttonText, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff', // Color azul por defecto (puedes cambiarlo)
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#FFFFFF', // Texto blanco por defecto
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomButton;