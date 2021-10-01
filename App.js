import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Button,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const App = (props) => {
  const MainButton = (props) => {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <View style={{ ...styles.buttonContainer, ...props.style }}>
          <Text style={styles.buttontxt}>{props.children}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [gameState, setGameState] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const renderIcon = (row, col) => {
    let value = gameState[row][col];
    switch (value) {
      case 1:
        return <MaterialCommunityIcons name="close" style={styles.tileX} />;
      case -1:
        return (
          <MaterialCommunityIcons name="circle-outline" style={styles.tileO} />
        );
      default:
        return <View />;
    }
  };

  const initialGame = () => {
    setGameState([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    setCurrentPlayer(1);
    // setGameState([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
  };

  // Returns 1 if Player 1 has won, -1 if Player 2 has won, or 0 if there is a tie/draw
  const getWinner = () => {
    const num_tiles = 3;
    let sum;
    let arr = gameState;

    //Check rows....
    for (let i = 0; i < num_tiles; i++) {
      sum = arr[i][0] + arr[i][1] + arr[i][2];
      if (sum === 3) {
        return 1;
      } else if (sum === -3) {
        return -1;
      }
    }

    //Check columns....
    for (let i = 0; i < num_tiles; i++) {
      sum = arr[0][i] + arr[1][i] + arr[2][i];
      if (sum === 3) {
        return 1;
      } else if (sum === -3) {
        return -1;
      }
    }

    //Check diagonals....
    sum = arr[0][0] + arr[1][1] + arr[2][2];
    if (sum === 3) {
      return 1;
    } else if (sum === -3) {
      return -1;
    }
    sum = arr[2][0] + arr[1][1] + arr[0][2];
    if (sum === 3) {
      return 1;
    } else if (sum === -3) {
      return -1;
    }

    //If there is no winner....
    return 0;
  };

  const onTilePress = (row, col) => {
    // Dont allow tiles to change...
    let value = gameState[row][col];
    if (value !== 0) {
      return;
    }
    // Grab current Player....
    let currPlayer = currentPlayer;
    let arr = gameState.slice();
    arr[row][col] = currPlayer;
    setGameState(arr);
    //Switch to other Player....
    let nextPlayer = currPlayer == 1 ? -1 : 1;
    setCurrentPlayer(nextPlayer);

    //Check for winner....
    let winner = getWinner();
    if (winner == 1) {
      Alert.alert("Player 1 has won the match !");
      initialGame();
    } else if (winner == -1) {
      Alert.alert("Player 2 has won the match !");
      initialGame();
    }
  };

  const backAction = () => {
    Alert.alert("Confirm Exit", "Are you sure you want to exit ?", [
      { text: "Cancel", onPress: () => null, style: "cancel" },
      { text: "Exit", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
  useEffect(() => {
    initialGame();
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => onTilePress(0, 0)}
          style={[styles.block, { borderLeftWidth: 0, borderTopWidth: 0 }]}
        >
          {renderIcon(0, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(0, 1)}
          style={[styles.block, { borderTopWidth: 0 }]}
        >
          {renderIcon(0, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(0, 2)}
          style={[styles.block, { borderTopWidth: 0, borderRightWidth: 0 }]}
        >
          {renderIcon(0, 2)}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => onTilePress(1, 0)}
          style={[styles.block, { borderLeftWidth: 0 }]}
        >
          {renderIcon(1, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(1, 1)}
          style={[styles.block, {}]}
        >
          {renderIcon(1, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(1, 2)}
          style={[styles.block, { borderRightWidth: 0 }]}
        >
          {renderIcon(1, 2)}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => onTilePress(2, 0)}
          style={[styles.block, { borderLeftWidth: 0, borderBottomWidth: 0 }]}
        >
          {renderIcon(2, 0)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(2, 1)}
          style={[styles.block, { borderBottomWidth: 0 }]}
        >
          {renderIcon(2, 1)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTilePress(2, 2)}
          style={[styles.block, { borderRightWidth: 0, borderBottomWidth: 0 }]}
        >
          {renderIcon(2, 2)}
        </TouchableOpacity>
      </View>
      <View>
        <MainButton style={styles.button} onPress={() => initialGame()}>
          Restart
        </MainButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#ff5733",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttontxt: {
    color: "white",
    fontSize: 18,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  block: {
    borderWidth: 5,
    borderColor: "black",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  tileX: {
    color: "#FFEE58",
    fontSize: 60,
  },
  tileO: {
    color: "green",
    fontSize: 60,
  },
  button: {
    marginTop: 50,
  },
  title: {
    fontSize: 30,
    paddingBottom: 30,
    textDecorationLine: "underline",
  },
});

export default App;
