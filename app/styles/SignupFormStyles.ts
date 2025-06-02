// app/styles/SignupFormStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  showPasswordButton: {
    position: "absolute",
    right: 15,
    height: 50,
    justifyContent: "center",
  },
  showPasswordText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "500",
  },
  passwordStrengthContainer: {
    width: "100%",
    marginBottom: 10,
  },
  passwordStrengthBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 5,
  },
  passwordStrengthProgress: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "right",
  },
  passwordRequirements: {
    width: "100%",
    marginBottom: 15,
  },
  requirementText: {
    fontSize: 12,
    marginBottom: 2,
  },
  requirementMet: {
    color: "#4CAF50",
  },
  requirementNotMet: {
    color: "#999",
  },
  passwordMatchText: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "right",
  },
  passwordMatch: {
    color: "#4CAF50",
  },
  passwordNoMatch: {
    color: "#f44336",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4285F4",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    marginTop: 10,
  },
  switchButtonText: {
    color: "#4285F4",
    fontSize: 16,
    textAlign: "center",
  },
});