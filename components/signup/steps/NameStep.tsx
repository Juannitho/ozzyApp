import InputText from '@/components/ui/Form/InputText/inputText';
import { NameData } from '@/lib/validations/signupValidation';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { stepsStyle } from './Steps.style';

interface NameStepProps {
  control: Control<NameData>;
  errors: FieldErrors<NameData>;
}

export default function NameStep({ control, errors }: NameStepProps) {
  return (
    <View style={stepsStyle.container}>
      <Text style={stepsStyle.title}>What should we {'\n'}call you?</Text>
      <InputText
        control={control}
        errors={errors}
        name={'name'}
        placeholder={'Your First Name'}
        props={{
          keyboardType: 'default',
          autoCapitalize: 'words',
        }}
      />
    </View>
  );
}