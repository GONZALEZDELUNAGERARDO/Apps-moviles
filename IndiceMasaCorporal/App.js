import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState('');

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (!pesoNum || !alturaNum || pesoNum <= 0 || alturaNum <= 0) {
      setResultado('Por favor ingresa valores válidos.');
      return;
    }

    if (pesoNum > 300 || alturaNum > 2.5) {
      Alert.alert('Valores fuera de rango', 'Peso máximo: 300 kg. Altura máxima: 2.5 m.');
      return;
    }

    const imc = (pesoNum / (alturaNum * alturaNum)).toFixed(2);
    let categoria = '';

    if (imc < 18.5) categoria = 'Bajo peso';
    else if (imc < 24.9) categoria = 'Normal';
    else if (imc < 29.9) categoria = 'Sobrepeso';
    else categoria = 'Obesidad';

    setResultado(`Tu IMC es ${imc} (${categoria})`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('./fondo.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Calculadora de IMC</Text>

          <Text style={styles.label}>Peso (kg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={peso}
            onChangeText={setPeso}
            placeholder="Ej. 70"
          />

          <Text style={styles.label}>Altura (m):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={altura}
            onChangeText={setAltura}
            placeholder="Ej. 1.75"
          />

          <Button title="Calcular IMC" onPress={calcularIMC} />

          {resultado !== '' && <Text style={styles.result}>{resultado}</Text>}
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
