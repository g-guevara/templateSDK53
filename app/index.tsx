// app/index.tsx - Versión corregida sin NavigationContainer
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  View
} from "react-native";
import { User } from "./components/User";
import { diagnoseAuth, getUser, removeUser, saveUser } from "./lib/authUtils";
import TabNavigator from "./navigation/TabNavigator";
import LoginForm from "./screens/LoginForm";
import SignupForm from "./screens/SignupForm";
import { styles } from "./styles/IndexStyles";

// URL de tu API
const API_URL = "https://bhu8vgy7nht5.vercel.app";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al iniciar la app
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      console.log('[Index] Verificando autenticación...');
      const userData = await getUser();
      console.log('[Index] Datos de usuario obtenidos:', {
        hasUser: !!userData,
        email: userData?.email,
        userID: userData?.userID
      });
      
      if (userData && userData.userID && userData.email) {
        // Validar que los datos del usuario sean válidos
        if (typeof userData.userID === 'string' && userData.userID.length > 0) {
          console.log('[Index] Usuario válido encontrado:', userData.name);
          setUser(userData);
        } else {
          console.log('[Index] Datos de usuario inválidos, limpiando...');
          await removeUser();
          setUser(null);
        }
      } else {
        console.log('[Index] No se encontró usuario válido');
        if (userData) {
          await removeUser();
        }
        setUser(null);
      }
    } catch (error) {
      console.error('[Index] Error verificando autenticación:', error);
      try {
        await removeUser();
      } catch (cleanupError) {
        console.error('[Index] Error limpiando datos:', cleanupError);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData: User) => {
    try {
      console.log('[Index] Procesando login con datos:', {
        email: userData.email,
        userID: userData.userID,
        name: userData.name
      });
      
      if (!userData) {
        throw new Error('Datos de usuario vacíos');
      }
      
      if (!userData.email || !userData.name) {
        throw new Error('Datos de usuario incompletos: faltan email o nombre');
      }
      
      // Asegurar que el userData tiene userID
      if (!userData.userID && userData._id) {
        console.log('[Index] Asignando _id como userID');
        userData.userID = userData._id;
      }
      
      if (!userData.userID) {
        console.error('[Index] Error: No userID encontrado en los datos');
        throw new Error('Datos de usuario inválidos: falta identificador de usuario');
      }
      
      // Guardar usuario y actualizar estado
      console.log('[Index] Guardando datos de usuario...');
      const savedUser = await saveUser(userData);
      
      console.log('[Index] Usuario guardado exitosamente');
      setUser(savedUser);
      
      console.log('[Index] Login completado exitosamente para:', savedUser.name);
    } catch (error) {
      console.error('[Index] Error durante login:', error);
      await diagnoseAuth();
      
      Alert.alert(
        'Error de Login',
        `Hubo un problema durante el login: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      console.log('[Index] Iniciando logout...');
      
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro que quieres cerrar sesión?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Cerrar Sesión', 
            style: 'destructive',
            onPress: async () => {
              try {
                await removeUser();
                setUser(null);
                console.log('[Index] Logout completado exitosamente');
              } catch (error) {
                console.error('[Index] Error durante logout:', error);
                Alert.alert('Error', 'Hubo un problema cerrando la sesión');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('[Index] Error iniciando logout:', error);
    }
  };

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      </SafeAreaView>
    );
  }

  // Si el usuario está logueado, mostrar el tab navigator (SIN NavigationContainer)
  if (user) {
    return <TabNavigator user={user} onLogout={handleLogout} />;
  }

  // Si no está logueado, mostrar formularios de login/signup
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {isLogin ? (
            <LoginForm 
              onLogin={handleLogin}
              onSwitchToSignup={() => setIsLogin(false)}
              apiUrl={API_URL}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setIsLogin(true)}
              apiUrl={API_URL}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}