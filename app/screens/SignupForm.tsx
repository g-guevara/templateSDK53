// app/screens/SignupForm.tsx - Versión corregida
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiService } from "../services/api";
import { styles } from "../styles/SignupFormStyles";
import { useToast } from '../utils/ToastContext';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  apiUrl: string;
}

interface PasswordStrength {
  score: number;
  color: string;
  width: number;
  label: string;
}

export default function SignupForm({ onSwitchToLogin, apiUrl }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    color: '#e74c3c',
    width: 0,
    label: 'Very Weak'
  });
  const { showToast } = useToast();

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    
    // Length check (at least 8 characters)
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Uppercase letter check
    if (/[A-Z]/.test(password)) score += 1;
    
    // Lowercase letter check
    if (/[a-z]/.test(password)) score += 1;
    
    // Number check
    if (/[0-9]/.test(password)) score += 1;
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // Set color and label based on score
    let color, width, label;
    switch (score) {
      case 0:
      case 1:
        color = '#e74c3c';  // Red
        width = 20;
        label = 'Very Weak';
        break;
      case 2:
        color = '#e67e22';  // Orange
        width = 40;
        label = 'Weak';
        break;
      case 3:
        color = '#f39c12';  // Yellow
        width = 60;
        label = 'Fair';
        break;
      case 4:
        color = '#2ecc71';  // Green
        width = 80;
        label = 'Good';
        break;
      case 5:
      case 6:
        color = '#27ae60';  // Dark Green
        width = 100;
        label = 'Strong';
        break;
      default:
        color = '#e74c3c';
        width = 0;
        label = 'Very Weak';
    }
    
    setPasswordStrength({ score, color, width, label });
  };

  useEffect(() => {
    calculatePasswordStrength(signupPassword);
  }, [signupPassword]);

  const validateForm = () => {
    // Verificar que todos los campos estén llenos
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword || !confirmPassword) {
      showToast('Por favor llena todos los campos', 'error');
      return false;
    }

    // Validar nombre (al menos 2 caracteres)
    if (signupName.trim().length < 2) {
      showToast('El nombre debe tener al menos 2 caracteres', 'error');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail.trim())) {
      showToast('Por favor ingresa un email válido', 'error');
      return false;
    }

    // Validar contraseña
    if (signupPassword.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return false;
    }

    if (!/[A-Z]/.test(signupPassword)) {
      showToast('La contraseña debe contener al menos una letra mayúscula', 'error');
      return false;
    }

    if (!/[a-z]/.test(signupPassword)) {
      showToast('La contraseña debe contener al menos una letra minúscula', 'error');
      return false;
    }

    // Verificar que las contraseñas coincidan
    if (signupPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
    setPasswordStrength({
      score: 0,
      color: '#e74c3c',
      width: 0,
      label: 'Very Weak'
    });
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('[Signup] Iniciando registro para email:', signupEmail.trim());
      
      const userData = {
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        language: 'en'
      };

      const response = await ApiService.signup(userData);
      
      console.log('[Signup] Registro exitoso:', {
        hasUser: !!response,
        email: userData.email
      });

      showToast('¡Cuenta creada exitosamente!', 'success');
      
      // Limpiar formulario
      clearForm();
      
      // Esperar un momento y luego cambiar a login
      setTimeout(() => {
        onSwitchToLogin();
        showToast('Ahora puedes iniciar sesión', 'success');
      }, 2000);

    } catch (error: any) {
      console.error("Error en registro:", error);
      
      let errorMessage = 'Error al crear la cuenta';
      
      if (error.message) {
        if (error.message.includes('email ya está registrado') || error.message.includes('already')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión';
        } else if (error.message.includes('Network request failed')) {
          errorMessage = 'Error de conexión. Verifica tu internet';
        } else if (error.message.includes('formato de respuesta')) {
          errorMessage = 'Error del servidor. Intenta más tarde';
        } else {
          errorMessage = error.message;
        }
      }
      
      showToast(errorMessage, 'error');
      
      // Si el email ya existe, sugerir ir al login
      if (errorMessage.includes('ya está registrado')) {
        Alert.alert(
          'Email ya registrado',
          '¿Quieres ir a la pantalla de login?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir a Login', onPress: onSwitchToLogin }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/icon.png')}
          style={styles.logo}
        />
      </View>
      
      <Text style={styles.title}>Sign Up</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={signupName}
        onChangeText={setSignupName}
        autoCapitalize="words"
        autoCorrect={false}
        textContentType="name"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signupEmail}
        onChangeText={setSignupEmail}
        keyboardType="email-address"
        autoCapitalize="none"

        autoCorrect={false}
        textContentType="emailAddress"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={signupPassword}
          onChangeText={setSignupPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
        />
        <TouchableOpacity 
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Password Strength Indicator */}
      {signupPassword.length > 0 && (
        <View style={styles.passwordStrengthContainer}>
          <View style={styles.passwordStrengthBar}>
            <View 
              style={[
                styles.passwordStrengthProgress, 
                { 
                  width: `${passwordStrength.width}%`,
                  backgroundColor: passwordStrength.color
                }
              ]} 
            />
          </View>
          <Text style={[styles.passwordStrengthLabel, { color: passwordStrength.color }]}>
            {passwordStrength.label}
          </Text>
        </View>
      )}
      
      <View style={styles.passwordRequirements}>
        <Text style={[
          styles.requirementText, 
          signupPassword.length >= 8 ? styles.requirementMet : styles.requirementNotMet
        ]}>
          • Al menos 8 caracteres
        </Text>
        <Text style={[
          styles.requirementText, 
          /[A-Z]/.test(signupPassword) ? styles.requirementMet : styles.requirementNotMet
        ]}>
          • Una letra mayúscula
        </Text>
        <Text style={[
          styles.requirementText, 
          /[a-z]/.test(signupPassword) ? styles.requirementMet : styles.requirementNotMet
        ]}>
          • Una letra minúscula
        </Text>
        <Text style={[
          styles.requirementText, 
          /[0-9]/.test(signupPassword) ? styles.requirementMet : styles.requirementNotMet
        ]}>
          • Un número (recomendado)
        </Text>
        <Text style={[
          styles.requirementText, 
          /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword) ? styles.requirementMet : styles.requirementNotMet
        ]}>
          • Un carácter especial (recomendado)
        </Text>
      </View>
      
      {/* Confirm Password Field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
        />
        <TouchableOpacity 
          style={styles.showPasswordButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Password Match Indicator */}
      {confirmPassword.length > 0 && (
        <Text style={[
          styles.passwordMatchText,
          signupPassword === confirmPassword ? styles.passwordMatch : styles.passwordNoMatch
        ]}>
          {signupPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={onSwitchToLogin}
      >
        <Text style={styles.switchButtonText}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}