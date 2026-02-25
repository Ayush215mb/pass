
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {Image} from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"
import {supabase} from "@/lib/supabase/client";
import {uploadProfileImage} from "@/lib/supabase/storage";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "expo-router";

function Onboarding (){
    const [isLoading, setIsLoading] = useState(false);
    const[profileImage,setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const {user,updateUser} = useAuth()
    const router = useRouter()
    const pickImage=async()=>{
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(status !== "granted"){
            Alert.alert("Permission denied", "We need media permission to select a profile image.")
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect:[1,1],
            quality:0.8
        })
        if(!result.canceled && result.assets[0]){
            console.log(result.assets[0].uri)
            setProfileImage(result.assets[0].uri)

        }

    }

    const takePhoto = async()=>{
        const {status} = await ImagePicker.requestCameraPermissionsAsync()
        if(status !== "granted"){
            Alert.alert("Permission denied", "We need camera permission to capture a profile image.")
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect:[1,1],
            quality:0.8
        })
        if(!result.canceled && result.assets[0]){
            console.log(result.assets[0].uri)
            setProfileImage(result.assets[0].uri)

        }

    }

    const showImagePicker =  () => {
        Alert.alert("Select Profile Image", "Pick an option",[
            {text:"Camera", onPress: takePhoto},
            {text:"Photo Library", onPress: pickImage},
            {text:"Cancel", style:"cancel"},
        ])
    }

    const handleComplete= async()=>{
        if(!name || !username){
            Alert.alert("Please enter your name and username");
        }

        if(username.length <3){
            Alert.alert("Please enter a username greater than 3!");
        }

        setIsLoading(true)
        try{

            if(!user){
                throw new Error("User not authenticated")
            }

            const {data: existingUser} = await supabase.from("profiles").select("id").eq("username",username).neq("id", user.id).single();

            if(existingUser){
                Alert.alert("Error", "This username is already taken")
                setIsLoading(false)
                return;
            }

            let profileImageUrl: string | undefined;
            if(profileImage){
                try{
                  profileImageUrl=  await uploadProfileImage(user.id,profileImage)
                }catch (error){
                    console.error("error while uploading the image",error)
                    Alert.alert("Error while uploading the image")
                }

            }

            //update profile
            await updateUser({
                name,
                username,
                profile_Image_Url: profileImageUrl,
                onboardingComplete:true
            })

            console.log("Every thing completer as per required")

        }catch(e){
            Alert.alert("Error","Failed to complete the onboarding. Please try again.");
        }finally {
            setIsLoading(false);
        }
    }
    return (
        <SafeAreaView
            edges={["top", "bottom"]}
            className={"flex-1 justify-center mx-10 "}
        >
            <View className="mb-8">
                <Text className="font-bold text-3xl  ">Complete Your Profile</Text>
                <Text className=" text-start text-gray-500 font-semibold ">
                    Add your information to get started
                </Text>
            </View>

            <View className="items-center ">
                <TouchableOpacity className={"mb-8 relative "} onPress={showImagePicker} >
                    {profileImage ? (<Image  source={{uri:profileImage}} className={"w-[120px] h-[120px] rounded-[60px] bg-[#f5f5f5]  "}  />):(
                        <View className={"w-[120px] h-[120px] relative bg-[#f5f5f5] rounded-[60px] justify-center items-center border-2 border-[#e0e0e0] border-dashed "}>
                            <Text className={"text-[#999] text-5xl  "}>+</Text>
                        </View>
                    )}

                    <View className={" absolute bottom-0 right-0 bg-black px-3 py-2 rounded-2xl "}>
                        <Text className={"text-white text-sm font-semibold"}>Edit</Text>
                    </View>
                </TouchableOpacity>

                <TextInput
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize={"words"}
                    className="border rounded-xl px-3 w-full mb-4 "
                />
                <TextInput
                    placeholder="Username"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    className="border rounded-xl px-3 w-full mb-4 "
                />

                <TouchableOpacity
                    className="bg-black w-full rounded-lg h-12 justify-center mb-5 "
                    onPress={handleComplete}
                >
                    {isLoading ? (
                        <ActivityIndicator size={24} color={"#fff"} />
                    ) : (
                        <Text className="text-white  text-center text-lg tracking-wider">
                            Complete Setup
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
export default Onboarding;
