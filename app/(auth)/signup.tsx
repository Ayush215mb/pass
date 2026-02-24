import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, {useEffect, useState} from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  useEffect(() => {
    router.push("/(auth)/onboarding")
  }, []);


  const handleSignUp = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the details");
    }

    if(password.length < 3){
      Alert.alert("Password must be at least 3 characters long")
    }
    try {
      await signUp(email, password);
    } catch (err) {
      Alert.alert("Error", "Failed to sign up");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className={"flex-1 justify-center mx-10 "}
    >
      <View className="mb-8">
        <Text className="font-bold text-3xl  ">Welcome</Text>
        <Text className="text-lg font-semibold text-start">
          Create your account to continue
        </Text>
      </View>

      <View className=" items-center">
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          className="border rounded-xl px-3 w-full mb-4 "
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="border rounded-xl px-3 w-full mb-4 "
        />

        <TouchableOpacity
          className="bg-black w-full rounded-lg h-12 justify-center mb-5 "
          onPress={handleSignUp}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color={"#fff"} />
          ) : (
            <Text className="text-white font-bold text-center text-xl">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/(auth)/login");
          }}
        >
          <Text className="text-md tracking-wider">
            Already have an account? <Text className="font-bold">Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Signup;
