// app/_layout.tsx - Versión optimizada
import { Stack } from "expo-router";
import { ToastProvider } from './utils/ToastContext';
import { AuthProvider } from './utils/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Stack
          screenOptions={{
            headerShown: false,  // Esto ocultará el header en todas las pantallas
          }}
        />
      </ToastProvider>
    </AuthProvider>
  );
}