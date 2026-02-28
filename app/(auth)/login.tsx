import { useRouter } from "expo-router";
import React, {useState} from "react";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useAuth} from "@/context/AuthContext";


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {signIn} = useAuth()

  const handleLogIn = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill all the details");
    }

    try {
      await signIn(email, password);
      router.push("/(tabs)/profile");
    } catch (err) {
      Alert.alert("Error", "Failed to sign in");
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
        <Text className="font-bold text-3xl  ">Welcome Back</Text>
        <Text className="text-xl font-semibold text-start">
          Sign in to continue
        </Text>
      </View>

      <View className=" items-center">
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          autoComplete="email"
          className="border rounded-xl px-3 w-full mb-4 "
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          autoComplete="password"
          secureTextEntry
          className="border rounded-xl px-3 w-full mb-4 "
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="bg-black w-full rounded-lg h-12 justify-center mb-5 " onPress={handleLogIn}>
          {isLoading ? (
              <ActivityIndicator size={24} color={"#fff"} />
          ) : (
              <Text className="text-white font-bold text-center text-xl">
                Sign in
              </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/(auth)/signup");
          }}
        >
          <Text className="text-md tracking-wider">
            Don&apos;t have an account?{" "}
            <Text className="font-bold">Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Login;
