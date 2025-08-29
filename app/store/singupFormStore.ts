import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface SignupFormData {
    name: string;
    email: string;
    password: string;
    school: string;
    phoneNumber: string;
}

// Enum to identify each form step
export enum FormStep {
    NAME = 1,
    EMAIL = 2,
    PASSWORD = 3,
    SCHOOL = 4,
    PHONE = 5,
}

// DEFINE THE COMPLETE STORE SHAPE
interface SignupFormState {

    // Which screen we are on (1, 2, 3, 4, or 5)
    currentStep: FormStep;

    // All form data
    formData: SignupFormData;

    // === FUNCTIONS TO CHANGE THAT DATA ===

    // Change to a specific step
    setCurrentStep: (step: FormStep) => void;

    // Go to next step (1->2, 2->3, etc)
    nextStep: () => void;

    // Go to previous step (2->1, 3->2, etc)
    previousStep: () => void;

    // Update any form field
    updateFormData: (data: Partial<SignupFormData>) => void;
    // Partial means you don't need to pass all fields, only the ones you want to change

    // Clear everything and start over
    resetForm: () => void;

    // Get all data to send to server
    getAllFormData: () => SignupFormData;
}

// Initial values
const initialState = {
    currentStep: FormStep.NAME,
    formData: {
        name: '',
        email: '',
        password: '',
        school: '',
        phoneNumber: '',
    },
};

// Create the store
export const useSignupFormStore = create<SignupFormState>()(
    devtools(
        // persist saves data on the device
        persist(
            (set, get) => ({
                // Add initial state
                ...initialState, 

                // Change to a specific step
                setCurrentStep: (step) => {
                    set({
                        currentStep: step
                    });
                },

                // Go to next step
                nextStep: () => {
                    set((state) => {
                        const nextStep = Math.min(state.currentStep + 1, FormStep.PHONE);
                        return { currentStep: nextStep as FormStep };
                    });
                },

                // Go to previous step
                previousStep: () => {
                    set((state) => {
                        const prevStep = Math.max(state.currentStep - 1, FormStep.NAME);
                        return { currentStep: prevStep as FormStep };
                    });
                },

                // Update form data
                updateFormData: (data) => {
                    set((state) => ({
                        formData: {
                            ...state.formData, 
                            ...data           
                        }
                    }));
                },

                // Reset the entire form
                resetForm: () => {
                    set(initialState);
                },

                // Get all data
                getAllFormData: () => {
                    const state = get(); 
                    return state.formData; 
                },
            }),

            // Persistence configuration
            {
                name: 'signup-form-storage',
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);

// Export constants useful
export const TOTAL_STEPS = 5; 

// Useful functions that use the store

// Are we on the last step?
export const useIsLastStep = () => {
  const currentStep = useSignupFormStore((state) => state.currentStep);
  return currentStep === FormStep.PHONE;
};

// Are we on the first step?
export const useIsFirstStep = () => {
  const currentStep = useSignupFormStore((state) => state.currentStep);
  return currentStep === FormStep.NAME;
};