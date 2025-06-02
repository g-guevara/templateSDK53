// app/lib/authUtils.ts - Versión corregida
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'current_user';
const DEBUG = true; // Cambiar a false en producción

// Función para logs de depuración
const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[Auth] ${message}`, data || '');
  }
};

export const saveUser = async (userData: any) => {
  try {
    if (!userData) {
      log('Error: Intentando guardar userData null o undefined');
      throw new Error('No se pueden guardar datos de usuario vacíos');
    }
    
    // Validar que userData tenga las propiedades esenciales
    if (!userData.email) {
      log('Error: userData no tiene email', userData);
      throw new Error('Los datos de usuario deben incluir un email');
    }
    
    // Asegurar que userID existe
    if (!userData.userID) {
      log('Advertencia: userData no tiene userID', userData);
      // Si tu backend devuelve _id en lugar de userID, asignarlo aquí
      if (userData._id) {
        userData.userID = userData._id;
        log('Asignado _id a userID', userData.userID);
      } else {
        log('Error: No se puede determinar userID');
        throw new Error('Los datos de usuario deben incluir un userID válido');
      }
    }
    
    // Crear objeto limpio para guardar
    const userToSave = {
      _id: userData._id || userData.userID,
      userID: userData.userID,
      name: userData.name,
      email: userData.email,
      language: userData.language || 'en',
      trialPeriodDays: userData.trialPeriodDays || 5,
      authProvider: userData.authProvider || 'local',
      googleId: userData.googleId || null,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString()
    };
    
    // Guardar como JSON string
    const jsonValue = JSON.stringify(userToSave);
    log('Guardando usuario:', userToSave);
    
    await SecureStore.setItemAsync(USER_KEY, jsonValue);
    log('Usuario guardado exitosamente');
    
    return userToSave;
  } catch (error) {
    console.error('Error guardando datos de usuario:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    log('Recuperando datos de usuario...');
    const userData = await SecureStore.getItemAsync(USER_KEY);
    
    if (!userData) {
      log('No se encontraron datos de usuario');
      return null;
    }
    
    try {
      const parsedData = JSON.parse(userData);
      log('Datos de usuario recuperados exitosamente:', {
        email: parsedData.email,
        userID: parsedData.userID,
        name: parsedData.name
      });
      
      // Validar que los datos recuperados sean válidos
      if (!parsedData.email || !parsedData.userID) {
        log('Error: Datos de usuario corruptos, eliminando...');
        await removeUser();
        return null;
      }
      
      return parsedData;
    } catch (parseError) {
      log('Error parseando datos de usuario, eliminando datos corruptos...');
      await removeUser();
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo datos de usuario:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    log('Eliminando datos de usuario');
    await SecureStore.deleteItemAsync(USER_KEY);
    log('Datos de usuario eliminados exitosamente');
  } catch (error) {
    console.error('Error eliminando datos de usuario:', error);
    throw error;
  }
};

export const getUserId = async (): Promise<string | null> => {
  try {
    const userData = await getUser();
    
    // Si no hay datos, retornar null
    if (!userData) {
      log('No hay datos de usuario para obtener ID');
      return null;
    }
    
    // Verificar si userID existe
    if (userData.userID) {
      log('ID de usuario obtenido:', userData.userID);
      return userData.userID;
    }
    
    // Verificar si hay un _id que podemos usar
    if (userData._id) {
      log('Usando _id como userID:', userData._id);
      return userData._id;
    }
    
    // Si llegamos aquí, no hay ID válido
    log('No se encontró userID ni _id en los datos de usuario', userData);
    return null;
  } catch (error) {
    console.error('Error obteniendo ID de usuario:', error);
    return null;
  }
};

export const updateUser = async (updates: Partial<any>) => {
  try {
    const currentUser = await getUser();
    if (!currentUser) {
      throw new Error('No hay usuario logueado para actualizar');
    }
    
    const updatedUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await saveUser(updatedUser);
    log('Usuario actualizado exitosamente');
    return updatedUser;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    throw error;
  }
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  try {
    const userData = await getUser();
    const isLoggedIn = !!(userData && userData.userID && userData.email);
    log('Estado de login:', isLoggedIn);
    return isLoggedIn;
  } catch (error) {
    console.error('Error verificando estado de login:', error);
    return false;
  }
};

// Función de utilidad para diagnóstico
export const diagnoseAuth = async () => {
  console.log('======== DIAGNÓSTICO DE AUTENTICACIÓN ========');
  try {
    const isLoggedIn = await isUserLoggedIn();
    const userData = await getUser();
    const userId = await getUserId();
    
    console.log('Estado de login:', isLoggedIn);
    console.log('Datos de usuario:', userData ? 'Presentes' : 'Ausentes');
    console.log('User ID:', userId || 'No disponible');
    
    if (userData) {
      console.log('Detalles del usuario:', {
        email: userData.email,
        name: userData.name,
        userID: userData.userID,
        _id: userData._id
      });
    }
    
    console.log('======== FIN DIAGNÓSTICO ========');
  } catch (error) {
    console.error('Error en diagnóstico de autenticación:', error);
  }
};