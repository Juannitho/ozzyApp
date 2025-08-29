import { supabase } from '@/lib/supabase/supabase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

// Import components
import BackArrow from '@/components/signup/BackArrow'
import NavigationButtons from '@/components/signup/NavigationButtons'
import StepIndicator from '@/components/signup/StepIndicator'
import { EmailStep, NameStep, PasswordStep, PhoneStep, SchoolStep } from '@/components/signup/steps'

import {
  FormStep,
  TOTAL_STEPS,
  useIsFirstStep,
  useIsLastStep,
  useSignupFormStore
} from '@/app/store/singupFormStore'
import colors from '@/lib/theme/colors'
import {
  stepValidationSchemas,
  type EmailData,
  type NameData,
  type PasswordData,
  type PhoneData,
  type SchoolData
} from '@/lib/validations/signupValidation'
import { LinearGradient } from 'expo-linear-gradient'

// Step component types
type StepFormData = NameData | EmailData | PasswordData | SchoolData | PhoneData;

export default function SingUp() {
  const router = useRouter();

  const {
    currentStep,
    formData,
    nextStep,
    previousStep,
    updateFormData,
    resetForm,
    getAllFormData
  } = useSignupFormStore();

  const isFirstStep = useIsFirstStep();
  const isLastStep = useIsLastStep();

  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const handleBackArrow = () => {
    if (isFirstStep) {
      // Navigate back to login or previous screen
      router.back();
    } else {
      // Go to previous step
      previousStep();
    }
  };

  // Get current step schema for validation
  const currentSchema = stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];

  // Set up form for current step with conditional validation mode
  const { control, handleSubmit, formState: { errors }, setValue, trigger, clearErrors } = useForm({
    resolver: zodResolver(currentSchema),
    mode: currentStep === FormStep.PASSWORD ? 'onSubmit' : 'onChange'
  });

  // Clear password errors when first entering password step
  useEffect(() => {
    if (currentStep === FormStep.PASSWORD) {
      clearErrors('password');
    }
  }, [currentStep, clearErrors]);

  // Update form values when step changes
  useEffect(() => {
    switch (currentStep) {
      case FormStep.NAME:
        setValue('name', formData.name);
        break;
      case FormStep.EMAIL:
        setValue('email', formData.email);
        break;
      case FormStep.PASSWORD:
        setValue('password', formData.password);
        break;
      case FormStep.SCHOOL:
        setValue('school', formData.school);
        break;
      case FormStep.PHONE:
        setValue('phoneNumber', formData.phoneNumber);
        break;
    }
  }, [currentStep, formData, setValue]);

  const handleNext = async (data: StepFormData) => {
    // Update store with current step data
    updateFormData(data);

    if (isLastStep) {
      // Submit form
      await handleFinalSubmit();
    } else {
      // Go to next step
      nextStep();
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      const finalData = getAllFormData();

      const { error: signUpError } = await supabase.auth.signUp({
        email: finalData.email,
        password: finalData.password,
        options: {
          data: {
            name: finalData.name,
            school: finalData.school,
            phoneNumber: finalData.phoneNumber,
          },
        },
      });

      if (signUpError) throw signUpError;
      console.log('User created successfully');

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: finalData.email,
        password: finalData.password,
      });

      if (loginError) throw loginError;
      console.log('User logged in successfully');

      // Clear signup form cache after successful registration
      resetForm();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case FormStep.NAME:
        return <NameStep control={control as any} errors={errors as any} />;
      case FormStep.EMAIL:
        return <EmailStep control={control as any} errors={errors as any} />;
      case FormStep.PASSWORD:
        return <PasswordStep control={control as any} errors={errors as any} />;
      case FormStep.SCHOOL:
        return <SchoolStep control={control as any} errors={errors as any} />;
      case FormStep.PHONE:
        return <PhoneStep control={control as any} errors={errors as any} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={[colors.primitive.purpleAlpha50, colors.primitive.white]}
      style={styles.gradient}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.5, y: 0.5 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          {/* Back Arrow */}
          <View style={styles.header}>
            <BackArrow onPress={handleBackArrow} />
          </View>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          {/* Step Content */}
          <View style={styles.stepContent}>
            {renderStepContent()}
          </View>

          {/* Navigation Buttons */}
          <KeyboardAvoidingView behavior="padding">
            <NavigationButtons
              isLastStep={isLastStep}
              loading={loading}
              onNext={handleSubmit(handleNext)}
            />
          </KeyboardAvoidingView>

          {error && <Text style={styles.error}>{error}</Text>}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 24,
    marginRight: 24,
  },
  gradient: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 56,
  },
  stepContent: {
    flex: 1,
    width: '100%',
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
})