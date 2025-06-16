import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import GameContext from '../context/GameContext';
import Card from '../components/Card';

// ¡IMPORTANTE! Asegúrate de que estas importaciones coincidan EXACTAMENTE
// con los nombres que exportas en tu data/players.js y que la ruta sea correcta.
import { playerImages, SBC_BANNER_IMAGES_MAP } from '../assets/playerImages';

const SBCScreen = () => {
    const { sbcList, playerCollection, completeSBC, getPlayerById } = useContext(GameContext);
    const [selectedSBC, setSelectedSBC] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cardsToSubmit, setCardsToSubmit] = useState([]);
    const [isCardSelectionVisible, setIsCardSelectionVisible] = useState(false);

    // --- Mensaje de funcionalidad Beta ---
    const BETA_MESSAGE = "¡Bienvenido a la fase Beta de los SBCs! 🎉 Por ahora, esta funcionalidad te permite visualizar los desafíos y las cartas que necesitas, pero aún no realiza el intercambio de jugadores ni te entrega las recompensas. Estamos trabajando para activarlo en la próxima gran actualización, ¡donde también vendrán muchísimos más jugadores! ¡Gracias por tu paciencia y por probar la app!";
    const IS_SBC_LIVE = false; // Cambia esto a true cuando la funcionalidad esté lista

    const handleSBCPress = (sbc) => {
        setSelectedSBC(sbc);
        setCardsToSubmit([]); // Limpia las cartas seleccionadas al abrir un nuevo SBC
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedSBC(null);
    };

    const handleOpenCardSelection = () => {
        setIsCardSelectionVisible(true);
    };

    const handleCardSelect = (card) => {
        if (!IS_SBC_LIVE) {
            // Permitir la selección solo para visualizar
            setCardsToSubmit(prevCards => {
                const isSelected = prevCards.some(c => c.instanceId === card.instanceId);
                if (isSelected) {
                    return prevCards.filter(c => c.instanceId !== card.instanceId);
                } else {
                    const maxSlots = selectedSBC?.requirements[0]?.slots || 0;
                    if (maxSlots > 0 && prevCards.length >= maxSlots) {
                        // En beta, no bloquear si es solo visual, pero podrías querer una alerta
                        // Alert.alert('Límite de Cartas', `Ya has seleccionado el máximo de ${maxSlots} cartas para visualizar.`);
                        return prevCards;
                    }
                    return [...prevCards, card];
                }
            });
            return; // Salir, no aplicar lógica de elegibilidad estricta si es solo visual
        }

        // --- Lógica original de selección/deselección si IS_SBC_LIVE es true ---
        setCardsToSubmit(prevCards => {
            const isSelected = prevCards.some(c => c.instanceId === card.instanceId);

            if (isSelected) {
                return prevCards.filter(c => c.instanceId !== card.instanceId);
            } else {
                if (selectedSBC && !isCardEligibleForSBC(card, selectedSBC, prevCards)) {
                    Alert.alert('Carta No Elegible', 'Esta carta no cumple los requisitos individuales para este SBC.');
                    return prevCards;
                }

                const maxSlots = selectedSBC?.requirements[0]?.slots || 0;
                if (maxSlots > 0 && prevCards.length >= maxSlots) {
                    Alert.alert('Límite de Cartas', `Ya has seleccionado el máximo de ${maxSlots} cartas para este SBC.`);
                    return prevCards;
                } else {
                    return [...prevCards, card];
                }
            }
        });
    };


    const isCardEligibleForSBC = (card, selectedSBC, cardsToSubmit) => {
        // En modo beta, esta lógica podría ser más permisiva o deshabilitada.
        // Si IS_SBC_LIVE es false, devolvemos siempre true para permitir visualización
        if (!IS_SBC_LIVE) return true;

        if (!selectedSBC || !selectedSBC.requirements || selectedSBC.requirements.length === 0) {
            return true;
        }

        const requirement = selectedSBC.requirements[0];

        if (requirement.requiredRatings && requirement.requiredRatings.length > 0) {
            const meetsAnyRequiredRating = requirement.requiredRatings.some(req => card.rating >= req.rating);
            if (!meetsAnyRequiredRating) { return false; }
        }

        if (requirement.nations && requirement.nations.length > 0) {
            if (!requirement.nations.includes(card.nation)) { return false; }
        }

        if (requirement.leagues && requirement.leagues.length > 0) {
            if (!requirement.leagues.includes(card.league)) { return false; }
        }

        if (requirement.clubs && requirement.clubs.length > 0) {
            if (!requirement.clubs.includes(card.club)) { return false; }
        }

        if (!cardsToSubmit.some(c => c.instanceId === card.instanceId)) {
            if (requirement.max_players_from_club && requirement.max_players_from_club > 0) {
                const playersFromThisClub = cardsToSubmit.filter(c => c.club === card.club).length;
                if (playersFromThisClub >= requirement.max_players_from_club) { return false; }
            }
        }
        return true;
    };

    const canSubmitSBC = () => {
        // Si la funcionalidad no está activa, el botón siempre estará deshabilitado
        if (!IS_SBC_LIVE) return false;

        if (!selectedSBC || !selectedSBC.requirements[0]) {
            return false;
        }
        const requirement = selectedSBC.requirements[0];

        if (cardsToSubmit.length !== requirement.slots) { return false; }

        if (requirement.requiredRatings) {
            const sortedSubmittedCards = [...cardsToSubmit].sort((a, b) => b.rating - a.rating);
            let cardIndex = 0;
            for (const req of requirement.requiredRatings) {
                let count = 0;
                while (cardIndex < sortedSubmittedCards.length && count < req.count) {
                    if (sortedSubmittedCards[cardIndex].rating >= req.rating) { count++; }
                    cardIndex++;
                }
                if (count < req.count) { return false; }
            }
        }

        if (requirement.nations && requirement.nationCount) {
            const matchingNations = cardsToSubmit.filter(card => requirement.nations.includes(card.nation));
            if (matchingNations.length < requirement.nationCount) { return false; }
        }

        if (requirement.leagues && requirement.leagueCount) {
            const matchingLeagues = cardsToSubmit.filter(card => requirement.leagues.includes(card.league));
            if (matchingLeagues.length < requirement.leagueCount) { return false; }
        }

        if (requirement.clubs && requirement.clubCount) {
            const matchingClubs = cardsToSubmit.filter(card => requirement.clubs.includes(card.club));
            if (matchingClubs.length < requirement.clubCount) { return false; }
        }
        return true;
    };

    const handleSubmitSBC = () => {
        if (!IS_SBC_LIVE) {
            Alert.alert(
                "SBC en Beta",
                "¡Esta funcionalidad aún no está activa! Puedes ver cómo funciona, pero los intercambios de cartas y las recompensas se habilitarán en una futura actualización. ¡Gracias por tu paciencia!",
                [{ text: "Entendido" }]
            );
            return;
        }

        if (selectedSBC && canSubmitSBC()) {
            completeSBC(selectedSBC.id, cardsToSubmit);
            handleCloseModal();
            setIsCardSelectionVisible(false);
        } else {
            Alert.alert('Error', 'No se cumplen los requisitos del SBC.');
        }
    };

    const renderRequirement = (requirement) => (
        <View key={requirement.description} style={styles.requirementGroup}>
            <Text style={styles.requirementTitle}>{requirement.description}</Text>
            {requirement.slots && <Text style={styles.requirementText}>Jugadores: {cardsToSubmit.length}/{requirement.slots}</Text>}
            {requirement.requiredRatings && requirement.requiredRatings.map((req, index) => (
                <Text key={`rating-${index}`} style={styles.requirementText}>Mínimo {req.count} Jugadores +{req.rating} GRL</Text>
            ))}
            {requirement.nations && requirement.nationCount && (
                <Text style={styles.requirementText}>Mínimo {requirement.nationCount} Jugadores de: {requirement.nations.join(', ')}</Text>
            )}
            {requirement.leagues && requirement.leagueCount && (
                <Text style={styles.requirementText}>Mínimo {requirement.leagueCount} Jugadores de liga: {requirement.leagues.join(', ')}</Text>
            )}
            {requirement.clubs && requirement.clubCount && (
                <Text style={styles.requirementText}>Mínimo {requirement.clubCount} Jugadores de club: {requirement.clubs.join(', ')}</Text>
            )}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, justifyContent: 'center' }}>
                {cardsToSubmit.map(card => (
                    <View key={card.instanceId} style={styles.submittedCard}>
                        <Text style={{ color: '#E0E0E0', fontSize: 10 }}>{card.name} ({card.rating})</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.selectCardButton} onPress={() => setIsCardSelectionVisible(true)}>
                <Text style={{ color: 'white' }}>Seleccionar Cartas</Text>
            </TouchableOpacity>
        </View>
    );

    const renderReward = (reward) => {
        return (
            <View style={styles.rewardContainer}>
                <Text style={styles.rewardTitle}>Recompensa:</Text>
                <View style={styles.rewardCardContainer}>
                    {reward.type === 'card' && Array.isArray(reward.cards) && reward.cards.length > 0 ? (
                        reward.cards.map(card => {
                            const rewardPlayerFullData = getPlayerById(card.id);
                            return rewardPlayerFullData ? (
                                <Card key={card.instanceId || rewardPlayerFullData.id} player={rewardPlayerFullData} />
                            ) : (
                                <Text key={card.id} style={{ color: '#9E9E9E', marginHorizontal: 5 }}>Carta ID: {card.id} (No encontrada)</Text>
                            );
                        })
                    ) : reward.type === 'pack' && reward.pack_type ? (
                        <Text style={{ color: '#9E9E9E' }}>Sobre: {reward.pack_type}</Text>
                    ) : reward.type === 'coins' && reward.amount !== undefined ? (
                        <Text style={{ color: '#9E9E9E' }}>Monedas: {reward.amount}</Text>
                    ) : (
                        <Text style={{ color: '#9E9E9E' }}>No hay recompensa definida.</Text>
                    )}
                </View>
            </View>
        );
    };

    const renderSBCItem = ({ item: sbc }) => {
        let sbcBannerImageSource = null;

        if (sbc.reward && sbc.reward.cards && sbc.reward.cards.length > 0) {
            const rewardPlayerFullData = getPlayerById(sbc.reward.cards[0].id);

            if (SBC_BANNER_IMAGES_MAP[`${sbc.id}_sbc.png`]) {
                sbcBannerImageSource = SBC_BANNER_IMAGES_MAP[`${sbc.id}_sbc.png`];
            } else if (rewardPlayerFullData && playerImages[rewardPlayerFullData.imageUri]) {
                sbcBannerImageSource = playerImages[rewardPlayerFullData.imageUri];
            }
        }

        return (
            <TouchableOpacity style={styles.sbcItem} onPress={() => handleSBCPress(sbc)}>
                <View style={styles.sbcImageContainer}>
                    {sbcBannerImageSource ? (
                        <Image source={sbcBannerImageSource} style={styles.sbcImage} />
                    ) : (
                        <Text style={styles.noImageText}>Imagen N/A</Text>
                    )}
                </View>
                <View style={styles.sbcDetails}>
                    <Text style={styles.sbcName}>{sbc.name}</Text>
                    <Text style={styles.sbcDescription}>{sbc.description}</Text>
                </View>
                <Text style={styles.sbcButton}>Ver SBC</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sbcList}
                keyExtractor={(item) => item.id}
                renderItem={renderSBCItem}
            />

            {/* --- PRIMER MODAL: Detalles y Requisitos del SBC --- */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {selectedSBC && (
                                <>
                                    <Text style={styles.modalTitle}>{selectedSBC.name}</Text>
                                    {selectedSBC.reward && selectedSBC.reward.cards && selectedSBC.reward.cards[0] ? (
                                        (() => {
                                            const playerReward = getPlayerById(selectedSBC.reward.cards[0].id);
                                            let modalImageSource = null;

                                            if (SBC_BANNER_IMAGES_MAP[`${selectedSBC.id}_sbc.png`]) {
                                                modalImageSource = SBC_BANNER_IMAGES_MAP[`${selectedSBC.id}_sbc.png`];
                                            } else if (playerReward && playerImages[playerReward.imageUri]) {
                                                modalImageSource = playerImages[playerReward.imageUri];
                                            }

                                            return modalImageSource ? (
                                                <Image source={modalImageSource} style={styles.modalSBCImage} />
                                            ) : (
                                                <Text style={{ color: '#9E9E9E', textAlign: 'center', marginBottom: 15 }}>Imagen de SBC no disponible</Text>
                                            );
                                        })()
                                    ) : (
                                        <Text style={{ color: '#9E9E9E', textAlign: 'center', marginBottom: 15 }}>Imagen de SBC no disponible</Text>
                                    )}

                                    {/* Mensaje Beta */}
                                    <Text style={styles.betaMessage}>{BETA_MESSAGE}</Text>

                                    <Text style={styles.sectionTitleModal}>Requisitos:</Text>
                                    {selectedSBC.requirements && selectedSBC.requirements.map(renderRequirement)}

                                    <Text style={styles.sectionTitleModal}>Cartas Seleccionadas ({cardsToSubmit.length}):</Text>
                                    <FlatList
                                        data={cardsToSubmit}
                                        keyExtractor={(item) => item.instanceId}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => handleCardSelect(item)}>
                                                <Text style={styles.selectedCardText}>{item.name} ({item.rating}) <Text style={{color: 'red'}}>X</Text></Text>
                                            </TouchableOpacity>
                                        )}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.selectedCardsScroll}
                                    />

                                    <TouchableOpacity style={styles.selectCardsButton} onPress={handleOpenCardSelection}>
                                        <Text style={styles.buttonText}>Seleccionar Jugadores</Text>
                                    </TouchableOpacity>

                                    {selectedSBC.reward && renderReward(selectedSBC.reward)}

                                    <TouchableOpacity
                                        style={[styles.submitButton, !canSubmitSBC() && styles.disabledButton]}
                                        onPress={handleSubmitSBC}
                                        disabled={!canSubmitSBC()}
                                    >
                                        <Text style={styles.buttonText}>Completar SBC</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                                        <Text style={styles.buttonText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* --- SEGUNDO MODAL: Selección de Jugadores --- */}
            <Modal
                visible={isCardSelectionVisible}
                animationType="slide"
                onRequestClose={() => setIsCardSelectionVisible(false)}
            >
                <View style={styles.cardSelectionModalContainer}>
                    <Text style={styles.modalTitle}>Seleccionar Jugadores</Text>
                    <FlatList
                        data={playerCollection}
                        keyExtractor={(item) => item.instanceId}
                        renderItem={({ item }) => {
                            const isSelected = cardsToSubmit.some(c => c.instanceId === item.instanceId);
                            // Deshabilita la carta solo si IS_SBC_LIVE es true Y no es elegible
                            const isDisabledForLiveSBC = IS_SBC_LIVE && !isCardEligibleForSBC(item, selectedSBC, cardsToSubmit) && !isSelected;
                            const maxSlots = selectedSBC?.requirements.find(req => req.slots)?.slots || Infinity;
                            const isSlotLimitReached = IS_SBC_LIVE && cardsToSubmit.length >= maxSlots && !isSelected;


                            return (
                                <TouchableOpacity
                                    onPress={() => handleCardSelect(item)}
                                    disabled={isDisabledForLiveSBC || isSlotLimitReached}
                                    style={[
                                        styles.cardSelectableItem,
                                        isSelected && styles.selectedCardSelectableItem,
                                        (isDisabledForLiveSBC || isSlotLimitReached) && styles.disabledCardSelectableItem
                                    ]}
                                >
                                    <Image source={playerImages[item.imageUri] || genericImages.placeholder_player} style={styles.cardImage} />
                                    <Text style={[styles.cardName, (isDisabledForLiveSBC || isSlotLimitReached) && styles.disabledText]}>
                                        {item.name} ({item.rating})
                                    </Text>
                                    {isSelected && (
                                        <Text style={styles.selectedIndicatorText}>Seleccionado</Text>
                                    )}
                                    {IS_SBC_LIVE && !isCardEligibleForSBC(item, selectedSBC, cardsToSubmit) && (
                                        <Text style={styles.notEligibleText}>NO CUMPLE REQUISITOS</Text>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                        numColumns={3}
                        contentContainerStyle={styles.cardListContent}
                    />
                    <TouchableOpacity style={styles.confirmSelectionButton} onPress={() => setIsCardSelectionVisible(false)}>
                        <Text style={styles.buttonText}>Confirmar Selección</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsCardSelectionVisible(false)}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#121212',
    },
    sbcItem: {
        backgroundColor: '#1E1E1E',
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sbcImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 15,
        backgroundColor: '#2C2C2C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sbcImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    noImageText: {
        color: '#9E9E9E',
        textAlign: 'center',
        fontSize: 10,
    },
    sbcDetails: {
        flex: 1,
    },
    sbcName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#E0E0E0',
    },
    sbcDescription: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    sbcButton: {
        backgroundColor: '#007bff',
        color: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        fontWeight: 'bold',
        fontSize: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#E0E0E0',
    },
    modalSBCImage: {
        width: '90%',
        height: 180,
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    betaMessage: {
        backgroundColor: '#FFEB3B', // Un color amarillo para el mensaje beta
        color: '#333',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionTitleModal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E0E0E0',
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    requirementGroup: {
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#424242',
        padding: 10,
        borderRadius: 5,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#E0E0E0',
    },
    requirementText: {
        fontSize: 12,
        marginBottom: 3,
        color: '#9E9E9E',
    },
    rewardContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#424242',
        paddingTop: 15,
        alignItems: 'center',
    },
    rewardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#E0E0E0',
    },
    rewardCardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    closeButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        alignSelf: 'center',
    },
    selectCardButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 5,
        alignSelf: 'center',
    },
    submittedCard: {
        marginRight: 5,
        marginBottom: 5,
        backgroundColor: '#333',
        padding: 5,
        borderRadius: 5,
    },
    submitButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#888',
    },
    cardSelectionModalContainer: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        alignItems: 'center',
    },
    cardListContent: {
        justifyContent: 'center',
        paddingBottom: 20,
    },
    cardSelectableItem: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        width: 100,
    },
    selectedCardSelectableItem: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    disabledCardSelectableItem: {
        opacity: 0.5,
    },
    cardImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    cardName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
    },
    disabledText: {
        color: '#aaa',
    },
    selectedIndicatorText: {
        color: 'green',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 2,
    },
    notEligibleText: {
        color: 'orange',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 2,
    },
    selectedCardsScroll: {
        maxHeight: 100,
        marginBottom: 10,
        width: '100%',
    },
    selectedCardText: {
        backgroundColor: '#444',
        color: '#fff',
        padding: 8,
        borderRadius: 5,
        marginRight: 5,
        fontSize: 14,
    },
    confirmSelectionButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
});

export default SBCScreen;