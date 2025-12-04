import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Button,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Necesitas permitir acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    // Evita múltiples lecturas
    if (!scanning) return;
    setScanning(false);
    setQrData(data);
    Alert.alert("QR detectado", `Contenido: ${data}`);
  };

  const isUrl = (text) => {
    return text.startsWith('http://') || text.startsWith('https://');
  };

  const openLink = async () => {
    if (isUrl(qrData)) {
      try {
        await Linking.openURL(qrData);
      } catch (error) {
        Alert.alert("Error", "No se pudo abrir el enlace.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Inicio de Sesión</Text>

        {/* Cámara o foto */}
        {scanning ? (
          <CameraView
            ref={cameraRef}
            style={styles.cameraQR}
            onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
        ) : !photo ? (
          <View style={styles.profileContainer}>
            <CameraView ref={cameraRef} style={styles.camera} />
          </View>
        ) : (
          <Image source={{ uri: photo }} style={styles.profileImage} />
        )}

        {!scanning && (
          <View style={styles.buttonContainer}>
            <Button title="Tomar una Foto" onPress={takePhoto} color="#4C6EF5" />
            <Button title="Compartir" onPress={() => {}} color="#4C6EF5" />
            <Button
              title="Escanear QR"
              onPress={() => {
                setScanning(true);
                setQrData(null);
              }}
              color="#0A9396"
            />
          </View>
        )}

        {/* Resultado del QR */}
        {qrData && (
          <View style={{ marginBottom: 15, alignItems: "center" }}>
            <Text style={{ color: "#333", marginBottom: 10 }}>
              QR leído: {qrData}
            </Text>

            {isUrl(qrData) && (
              <Button title="Abrir enlace" onPress={openLink} color="#0077B6" />
            )}
          </View>
        )}

        {/* Inputs si no está escaneando */}
        {!scanning && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Aceptar" onPress={() => {}} color="#4C6EF5" />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    color: '#00E5FF', // Azul neón
    fontWeight: 'bold',
    marginBottom: 25,
    textShadowColor: '#00E5FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  profileContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  camera: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cameraQR: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  buttonContainer: {
    marginBottom: 25,
    gap: 12,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#00E5FF',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 12,
    color: '#212121',
    backgroundColor: '#FFF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
});
