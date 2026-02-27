import { supabase } from "@/lib/supabase/client";
import { createContext, ReactNode, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profile_Image_Url?: string;
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {};


  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      console.log(user);
    }
  };


  const updateUser = async (userData:Partial<User>) => {
    if(!user) return;

    try{
      const updateData: Partial<User> = {};
      if(userData.name !== undefined) updateData.name= userData.name;
      if(userData.username !== undefined) updateData.username = userData.username;
      if(userData.profile_Image_Url !== undefined) updateData.profile_Image_Url= userData.profile_Image_Url;
      if(userData.onboardingComplete !== undefined) updateData.onboardingComplete= userData.onboardingComplete;

    const {error}=  await supabase.from("profiles").update(updateData).eq("id",user.id)

      if(error) throw error;

    }catch(e){
      console.error("Error updating user data", e);
    }

  };

  return (
    <AuthContext.Provider value={{ user, signUp,updateUser }}>
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
