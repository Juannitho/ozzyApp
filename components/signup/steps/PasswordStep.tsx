import InputText from '@/components/ui/Form/InputText/inputText';
import { FONTS } from '@/lib/customFont/fonts';
import colors from '@/lib/theme/colors';
import { PasswordData } from '@/lib/validations/signupValidation';
import React, { useState } from 'react';
import { Control, FieldErrors, useWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { stepsStyle } from './Steps.style';

interface PasswordStepProps {
  control: Control<PasswordData>;
  errors: FieldErrors<PasswordData>;
}

interface CustomInputTextProps {
  control: Control<PasswordData>;
  name: keyof PasswordData;
  placeholder: string;
  props: any;
  showErrors?: boolean;
}

export default function PasswordStep({ control, errors }: PasswordStepProps) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  // Show validation errors only after user tries to submit
  React.useEffect(() => {
    if (errors.password) {
      setShowValidationErrors(true);
    }
  }, [errors.password]);

  // Password validation criteria
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'At least one lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      text: 'At least one uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'At least one number (0-9)',
      met: /\d/.test(password),
    },
    {
      text: 'At least one special character (@$.!%*?&)',
      met: /[@$\.!%*?&]/.test(password),
    },
  ];

  return (
    <View style={stepsStyle.container}>
      <Text style={stepsStyle.title}>Create a Password</Text>
      <InputText
        control={control}
        errors={showValidationErrors ? errors : undefined}
        name={'password'}
        placeholder={'Enter a secure password'}
        props={{
          secureTextEntry: true,
        }}
      />
      
      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password requirements:</Text>
        <View style={styles.requirementsList}>
          {requirements.map((requirement, index) => (
            <Text 
              key={index} 
              style={[
                styles.requirementItem,
                requirement.met && styles.requirementMet
              ]}
            >
              • {requirement.text}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  requirementsContainer: {
    marginTop: 16,
    width: '100%',
  },
  requirementsTitle: {
    fontFamily: FONTS.SATOSHI_BOLD,
    fontSize: 16,
    color: colors.primitive.greyPurple,
    marginBottom: 8,
  },
  requirementsList: {
    gap: 4,
  },
  requirementItem: {
    fontFamily: FONTS.SATOSHI_MEDIUM,
    fontSize: 14,
    color: colors.primitive.grey600,
    lineHeight: 20,
  },
  requirementMet: {
    color: colors.primitive.greyPurple,
    textDecorationLine: 'line-through',
  },
});
