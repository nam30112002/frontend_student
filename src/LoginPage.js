import React, { useState } from 'react'
import { TextInput, TouchableOpacity, View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { storeData, getData } from './Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {HOST} from '@env'; 

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const signIn = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const client_id = "graduation_thesis_ver2";
    const client_secret = "Tj5zNU17UX9Ak1d4lLulx9VcXSSdHJwC";
    const urlencoded = `grant_type=password&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}`;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };
    console.log(`${HOST}:9000/realms/nam30112002/protocol/openid-connect/token`);
    fetch(`${HOST}:9000/realms/nam30112002/protocol/openid-connect/token`, requestOptions)
      .then((response) => {
        console.log('is fetching');
        console.log('status:', response.status);
        if (!response.ok) {
          console.error('Error:', response.statusText);
          throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        return response.json();
      })
      .then(async (data) => {
        console.log('Data:', data.access_token);
        console.log(typeof(data.access_token));
        if (!data.access_token) {
          console.error('Missing access token in response');
          throw new Error('Missing access token');
        }
        try {
          await AsyncStorage.setItem('test', '1');
        } catch (e) {
          console.error('error: ' + e);
        }
        await AsyncStorage.setItem('accessToken', data.access_token);
        console.log('da luu xong');
        await navigation.navigate('Main');
      })
      .then(() => {
        // Navigate to Main page only if access token is valid
        navigation.navigate('Main');
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoZone}>
        <Text style={styles.logoText}>Welcome</Text>
      </View>
      <View style={styles.signInZone}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.textInput} placeholder="Your Email" onChangeText={(val) => setUsername(val)} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.textInput} placeholder="Password" secureTextEntry={true} onChangeText={(val) => setPassword(val)} />
        </View>
      </View>
      <View style={styles.bottomZone}>
        <View style={styles.row1Bot}>
          <View style={styles.nothing}></View>
          <View style={styles.signInButtonView}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => signIn()}>
              <Text style={styles.arrowText}>&rarr;</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row2Bot}>
          <TouchableOpacity style={styles.signUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nothing1}></TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.signUpText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FEABAE",
        alignItems: "center",
        justifyContent: "center",
    },
    logoZone: {
        flex: 396,
        justifyContent: "center",
        width: '80%',
        paddingLeft: 10,
    },
    logoText: {
        color: "#FFFFFF",
        fontSize: 50,
        fontWeight: "bold",
        fontFamily: "Futura Hv Bt",
    },
    signInZone: {
        flex: 140,
        justifyContent: "center",
        width: '80%',
        display: 'flex',
        justifyContent: 'space-between',
        padding : 10
    },
    inputSignIn: {
        margin: '0 10px 0 0'
    },
    textInput : {
        height: 60,
        width: 303,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    bottomZone: {
        flex: 336,
        justifyContent: "center",
        //backgroundColor: "#4C525C",
        width: '80%'
    },
    row1Bot: {
        flex: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 50
    },
    row2Bot: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        //
    },
    nothing: {
        flex: 239,
    },
    signInButtonView: {
        flex: 64,
        borderRadius: 20,
        marginRight: 10
    },
    arrowButton: {
        width: 64,
        height: 64,
        borderRadius: 64,
        backgroundColor: '#8A4C7D',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    arrowText: {
        fontSize: 40,
        color: '#fff',
        position: 'absolute', top: -2, left: 12, right: 0, bottom: 20
    },
    signUp: {
        flex: 68,
        // backgroundColor: "#E4DB7C",
        alignItems: 'center',
        justifyContent: 'center',
    },
    nothing1: {
        flex: 75,
    },
    forgotPassword: {
        flex: 151,
        //backgroundColor: "#E4DB7C",
        alignItems: 'center',
        justifyContent: 'center'
    },
    signUpText: {
        color: "#000000",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Futura Hv Bt",
    },
});
