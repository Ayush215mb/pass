import { supabase } from "@/lib/supabase/client";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {Alert} from "react-native";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_image_url?: string;
  onboarding_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkSession()
  },[]);

  const checkSession= async()=>{
    try{
      setIsLoading(true);
      const {data:{session}}= await supabase.auth.getSession();

      if(session?.user){
        const profile= await fetchUserProfile(session.user.id)
        setUser(profile);
      }else{
        return null
      }

    }catch(e){
      console.error("Error while fetching user session",e)
      setUser(null)
    }finally {
      setIsLoading(false);
    }
  }

  const fetchUserProfile=async(userID:string) :Promise< User | null>=>{
    try{
      const{ data,error}= await supabase.from("profiles").select("*").eq("id",userID).single();

      if(!data){
        console.error("No profile data returned")
        return null
      }

      if(error){
        console.error("Error fetching profile data",error)
        return null
      }

      const authUser= await supabase.auth.getUser()

      if(!authUser.data.user){
        console.error("No user data found")
        return null
      }


      return{
        id:data.id,
        name:data.name,
        username:data.username,
        email: authUser.data.user.email || "",
        profile_image_url: data.profile_image_url,
        onboarding_completed: data.onboarding_completed
      }
    }catch(e){
      console.error("error while fetching user profile",e)
      return null
    }
  }

  const signIn = async (email: string, password: string) => {

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile= await fetchUserProfile(data.user.id);
        setUser(profile)
      }


  };

  const signUp = async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile= await fetchUserProfile(data.user.id);
        setUser(profile)
      }
  };

  const updateUser = async (userData:Partial<User>) => {
    if(!user) return;

      const updateData: Partial<User> = {};
      if(userData.name !== undefined) updateData.name= userData.name;
      if(userData.username !== undefined) updateData.username = userData.username;
      if(userData.profile_image_url !== undefined) updateData.profile_image_url= userData.profile_image_url;
      if(userData.onboarding_completed !== undefined) updateData.onboarding_completed= userData.onboarding_completed;

    const {error}=  await supabase.from("profiles").update(updateData).eq("id",user.id)

      if(error) throw error;

  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("must be inside the provider");
  }
  return context;
};
