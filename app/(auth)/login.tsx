import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const Login = () => {
  const router = useRouter();
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
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#999"
          autoComplete="password"
          secureTextEntry
          className="border rounded-xl px-3 w-full mb-4 "
        />

        <TouchableOpacity className="bg-black w-full rounded-lg h-12 justify-center mb-5 ">
          <Text className="text-white font-bold text-center text-xl">
            Sign in
          </Text>
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
