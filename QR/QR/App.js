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


  const logout = () => {
    setUsername('');
    setPassword('');
    setPhoto(null);
    setQrData(null);
    setScanning(false);
    Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Inicio de Sesión</Text>

        {}
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

        {}
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

        {}
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

            {}
            <Button title="Cerrar Sesión" onPress={logout} color="#D00000" />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
