
import {File} from "expo-file-system"
import {supabase} from "@/lib/supabase/client";


export const uploadProfileImage= async (userId: string |undefined,imageUri:string): Promise<string | undefined> => {
    try{
        const fileExtension= imageUri.split('.').pop() || "jpg";
        const fileName= `${userId}/profile.${fileExtension}}`;

        const file= new File(imageUri);

        const bytes = await file.bytes();

      const {error}=  await supabase.storage.from('profiles').upload(fileName, bytes,{
            contentType: `image/${fileExtension}`,
            upsert: true,
        });

      if(error){
          throw error;
      }

      const {data:urlData}= supabase.storage.from('profiles').getPublicUrl(fileName);

      return urlData.publicUrl

    }catch(err){
        console.error(err)
    }
}