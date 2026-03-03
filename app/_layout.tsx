// import {AuthProvider, useAuth} from "@/context/AuthContext";
// import {Slot, useRouter, useSegments} from "expo-router";
// import "../global.css";
// import {useEffect} from "react";
// import {ActivityIndicator, View} from "react-native";
//
//
// function RouteGuard(){
//     const router = useRouter();
//     const {user,isloading}= useAuth()
//
//     console.log(user,isloading)
//
//     const segments = useSegments()
//
//     const inAuthGroup= segments[0] ==="(auth)"
//     const inTabGroup= segments[0] ==="(tabs)"
//
//     useEffect(() => {
//         if (isloading) return;
//
//        if(!user){
//             if(!inAuthGroup){
//                 router.replace("/(auth)/login");
//             }
//         }else if (!user.onboarding_completed){
//            if (segments.join("/") !== "(auth)/onboarding") {
//                router.replace("/(auth)/onboarding");
//            }
//        } else{
//             if (!inTabGroup){
//                 router.replace("/(tabs)/profile")
//             }
//         }
//
//     }, [user, isloading, segments, router, inAuthGroup, inTabGroup]);
//
//
//     return (
//         <>
//           <Stack>
//               <Stack.Screen name={}  />
//           </Stack>
//             {isloading && (
//                 <View
//                     style={{
//                         position: "absolute",
//                         flex: 1,
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         justifyContent: "center",
//                         alignItems: "center",
//                         backgroundColor: "white",
//                     }}
//                 >
//                     <ActivityIndicator size="large" />
//                 </View>
//             )}
//         </>
//     );
// }
//
// export default function RootLayout() {
//   return (
//       <AuthProvider>
//          <RouteGuard/>
//       </AuthProvider>
//   );
// }

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RouteGuard() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const segments = useSegments();

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    useEffect(() => {
        if (isLoading) return;
        if (!user) {
            if (!inAuthGroup) {
                router.replace("/(auth)/login");
            }
        } else if (!user.onboarding_completed) {
            if (segments.join("/") !== "(auth)/onboarding") {
                router.replace("/(auth)/onboarding");
            }
        } else {
            if (!inTabsGroup) {
                router.replace("/(tabs)/home");
            }
        }
    }, [user, segments, router, isLoading, inAuthGroup, inTabsGroup]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
        </Stack>
    );
}
export default function RootLayout() {
    return (
        <AuthProvider>
            <RouteGuard />
        </AuthProvider>
    );
}