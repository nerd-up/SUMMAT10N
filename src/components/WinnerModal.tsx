import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal"; // Install with `yarn add react-native-modal`
import Colors from "../theme/ScholarColors";

const WinnersModal = ({ monthlyWinner, yearlyWinner, isVisible, onClose }:any) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Winners</Text>

        {/* Monthly Winner */}
        <View style={styles.winnerSection}>
          <Text style={styles.sectionHeader}>Monthly Winner</Text>
          {monthlyWinner ? (
            <View style={styles.winnerCard}>
              <Image
                source={require('../assets/icons/trophy.png')}
                style={styles.profilePic}
              />
              <Text style={styles.winnerName}>{monthlyWinner.userProfile.usrName}</Text>
              <Text style={styles.winnerText}>Topic: {monthlyWinner.topic}</Text>
              <Text style={styles.winnerText}>Likes: {monthlyWinner.likes}</Text>
              <Text style={styles.winnerText}>Post: {monthlyWinner.text}</Text>
              <Text style={styles.winnerText}>Residency: {monthlyWinner.userProfile.residency}</Text>
              <Text style={styles.winnerDate}>Date: {new Date(monthlyWinner.time).toDateString()}</Text>
            </View>
          ) : (
            <Text style={styles.noWinnerText}>No winner for this month.</Text>
          )}
        </View>

        {/* Yearly Winner */}
        <View style={styles.winnerSection}>
          <Text style={styles.sectionHeader}>Yearly Winner</Text>
          {yearlyWinner ? (
            <View style={styles.winnerCard}>
              <Image
                source={require('../assets/icons/trophy.png')}
                style={styles.profilePic}
              />
              <Text style={styles.winnerName}>{yearlyWinner.userProfile.usrName}</Text>
              <Text style={styles.winnerText}>Topic: {yearlyWinner.topic}</Text>
              <Text style={styles.winnerText}>Likes: {yearlyWinner.likes}</Text>
              <Text style={styles.winnerText}>Post: {yearlyWinner.text}</Text>
              <Text style={styles.winnerText}>Residency: {yearlyWinner.userProfile.residency}</Text>
              <Text style={styles.winnerDate}>Date: {new Date(yearlyWinner.time).toDateString()}</Text>
            </View>
          ) : (
            <Text style={styles.noWinnerText}>No winner for this year.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default WinnersModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  winnerSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  winnerCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  profilePic: {
    width: 80,
    height: 80,
    
    marginBottom: 10,
  },
  winnerName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  winnerText: {
    fontSize: 14,
    marginBottom: 3,
    textAlign: "center",
  },
  winnerDate: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
  },
  noWinnerText: {
    fontSize: 14,
    color: "#6c757d",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
