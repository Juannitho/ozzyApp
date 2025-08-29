import InputText from '@/components/ui/Form/InputText/inputText';
import { PhoneData } from '@/lib/validations/signupValidation';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { stepsStyle } from './Steps.style';

interface PhoneStepProps {
  control: Control<PhoneData>;
  errors: FieldErrors<PhoneData>;
}

export default function PhoneStep({ control, errors }: PhoneStepProps) {
  return (
    <View style={stepsStyle.container}>
      <Text style={stepsStyle.title}>Enter your Phone Number</Text>
      <InputText
        control={control}
        errors={errors}
        name={'phoneNumber'}
        placeholder={'0412345678'}
        props={{
          keyboardType: 'phone-pad',
          autoCapitalize: 'none',
        }}
      />
    </View>
  );
}
