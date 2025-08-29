import InputText from '@/components/ui/Form/InputText/inputText';
import { EmailData } from '@/lib/validations/signupValidation';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { stepsStyle } from './Steps.style';

interface EmailStepProps {
  control: Control<EmailData>;
  errors: FieldErrors<EmailData>;
}

export default function EmailStep({ control, errors }: EmailStepProps) {
  return (
    <View style={stepsStyle.container}>
      <Text style={stepsStyle.title}>Enter your Email</Text>
      <InputText
        control={control}
        errors={errors}
        name={'email'}
        placeholder={'your@email.com'}
        props={{
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        }}
      />
    </View>
  );
}

