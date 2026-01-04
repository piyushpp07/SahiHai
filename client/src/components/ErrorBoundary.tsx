import React, { Component, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { AlertTriangle, RefreshCw, UploadCloud } from "lucide-react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          {/* <AlertTriangle size={60} color="#e74c3c" /> */}
          <Text style={styles.title}>Oops! Something went wrong.</Text>
          <Text style={styles.message}>
            We couldn&apos;t process your request. This might be due to a poor
            connection or an issue with the image.
          </Text>

          {this.props.onRetry && (
            <TouchableOpacity
              style={styles.button}
              onPress={this.props.onRetry}
            >
              {/* <RefreshCw size={20} color="white" /> */}
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => {
              /* Implement manual upload */
            }}
          >
            {/* <UploadCloud size={20} color="#3498db" /> */}
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Upload Manually
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  secondaryButtonText: {
    color: "#3498db",
  },
});

export default ErrorBoundary;
