import React from 'react'
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { Text, TextInput, TextInputProps } from 'react-native'
import { styles } from './Input.styles'
import colors from '@/lib/theme/colors'

interface InputTextProps<T extends FieldValues = FieldValues> {
    control: Control<T>
    errors?: FieldErrors<T>
    name: Path<T>
    placeholder: string
    props: TextInputProps
}

export default function InputText<T extends FieldValues = FieldValues>({
    control, 
    errors, 
    name, 
    placeholder, 
    props
}: InputTextProps<T>) {
    return (
        <>
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.primitive.grey600}
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    {...props}
                />
            )}
        />
        {errors && errors[name] && (
            <Text style={styles.error}>
                {errors[name]?.message as string}
            </Text>
        )}
        </>
    )
}

