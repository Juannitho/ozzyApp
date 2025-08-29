import { decode } from 'base64-arraybuffer';
import { supabase } from './supabase';

// TYPES FOR STORAGE

export interface UploadResult {
    url: string | null;
    error: string | null;
}

export interface ImageFile {
    uri: string;
    type: string;
    name: string;
    size?: number;
}

/**
* Uploads an avatar for the current user
* @param userId - User ID
* @param file - Image file from ImagePicker
*/

export async function uploadAvatar(
    userId: string,
    file: ImageFile
): Promise<UploadResult> {
    try {
        // 1. Convert URI to base64 (React Native)
        const base64 = await uriToBase64(file.uri);

        // 2. Unique file name
        const fileName = `${userId}/avatar-${Date.now()}.${getExtension(file.type)}`;

        // 3. Upload to Supabase
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, decode(base64), {
                contentType: file.type,
                upsert: true  // Replace if exists
            });

        if (error) throw error;

        // 4. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.path);

        // 5. Update profile with new URL
        await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userId);

        return { url: publicUrl, error: null };

    } catch (error) {
        console.error('Error uploading avatar:', error);
        return {
            url: null,
            error: error instanceof Error ? error.message : 'Error uploading avatar'
        };
    }
}

// Delete the avatar of the user
export async function deleteAvatar(userId: string): Promise<boolean> {
    try {
        // 1. Get list of files of the user
        const { data: files } = await supabase.storage
            .from('avatars')
            .list(userId);

        if (!files || files.length === 0) return true;

        // 2. Delete all files
        const filesToDelete = files.map(file => `${userId}/${file.name}`);
        const { error } = await supabase.storage
            .from('avatars')
            .remove(filesToDelete);

        if (error) throw error;

        // 3. Clean URL in the profile
        await supabase
            .from('profiles')
            .update({ avatar_url: null })
            .eq('id', userId);

        return true;

    } catch (error) {
        console.error('Error deleting avatar:', error);
        return false;
    }
}

// FUNCTIONS FOR JAM IMAGES
export async function uploadJamImage(
    jamId: string,
    file: ImageFile
): Promise<UploadResult> {
    try {
        // 1. Convert to base64
        const base64 = await uriToBase64(file.uri);

        // 2. File name
        const fileName = `${jamId}/main-${Date.now()}.${getExtension(file.type)}`;

        // 3. Upload image
        const { data, error } = await supabase.storage
            .from('jam-images')
            .upload(fileName, decode(base64), {
                contentType: file.type,
                upsert: true
            });

        if (error) throw error;

        // 4. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('jam-images')
            .getPublicUrl(data.path);

        // 5. Update Jam with the URL
        await supabase
            .from('jams')
            .update({ image_url: publicUrl })
            .eq('id', jamId);

        return { url: publicUrl, error: null };

    } catch (error) {
        console.error('Error uploading jam image:', error);
        return {
            url: null,
            error: error instanceof Error ? error.message : 'Error uploading jam image'
        };
    }
}


// Delete all images of a Jam

export async function deleteJamImages(jamId: string): Promise<boolean> {
    try {
        const { data: files } = await supabase.storage
            .from('jam-images')
            .list(jamId);

        if (!files || files.length === 0) return true;

        const filesToDelete = files.map(file => `${jamId}/${file.name}`);
        const { error } = await supabase.storage
            .from('jam-images')
            .remove(filesToDelete);

        return !error;

    } catch (error) {
        console.error('Error deleting jam images:', error);
        return false;
    }
}

// UTILIDADES HELPER
// Convert URI to base64
async function uriToBase64(uri: string): Promise<string> {
    // In React Native with Expo
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove the prefix 'data:image/jpeg;base64,'
            resolve(base64.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Get the extension of the file according to the MIME type
function getExtension(mimeType: string): string {
    const extensions: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
    };
    return extensions[mimeType] || 'jpg';
}

// Generate a temporary URL for preview (before uploading)
export function getPreviewUrl(file: ImageFile): string {
    return file.uri;
}

// Validate the file size
export function validateFileSize(
    file: ImageFile, 
    maxSizeMB: number = 5
  ): boolean {
    if (!file.size) return true;
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
  }
  
  // Validate the file type
  export function validateFileType(file: ImageFile): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  }