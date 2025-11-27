import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>📷 Necesitas permitir acceso a la cámara</Text>
        <TouchableOpacity style={styles.buttonPrimary} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  const sharePhoto = async () => {
    if (photo) {
      await Sharing.shareAsync(photo);
    }
  };

  const handleLogin = () => {
    alert(`Usuario: ${username}\nContraseña: ${password}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>✨ Iniciar sesión</Text>

        {photo ? (
          <>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity style={styles.buttonSecondary} onPress={() => setPhoto(null)}>
              <Text style={styles.buttonText}>Tomar otra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonPrimary} onPress={sharePhoto}>
              <Text style={styles.buttonText}>Compartir foto</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <CameraView ref={cameraRef} style={styles.camera} />
            <TouchableOpacity style={styles.buttonPrimary} onPress={takePhoto}>
              <Text style={styles.buttonText}>Tomar foto</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>👤 Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>🔒 Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfd', // fondo claro elegante
  },
  scroll: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbfd',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  camera: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  photo: {
    height: 220,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#2980b9',
  },
  inputWrapper: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: '#2980b9', // azul moderno
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#7f8c8d', // gris elegante
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
