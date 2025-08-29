import InputText from '@/components/ui/Form/InputText/inputText';
import { SchoolData } from '@/lib/validations/signupValidation';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { stepsStyle } from './Steps.style';

interface SchoolStepProps {
  control: Control<SchoolData>;
  errors: FieldErrors<SchoolData>;
}

export default function SchoolStep({ control, errors }: SchoolStepProps) {
  return (
    <View style={stepsStyle.container}>
      <Text style={stepsStyle.title}>What school do you attend?</Text>
      <InputText
        control={control}
        errors={errors}
        name={'school'}
        placeholder={'School Name'}
        props={{
          keyboardType: 'default',
          autoCapitalize: 'words',
        }}
      />
    </View>
  );
}
