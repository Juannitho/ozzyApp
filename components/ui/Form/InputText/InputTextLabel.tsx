import colors from '@/lib/theme/colors'
import React from 'react'
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { Text, TextInput, TextInputProps, View } from 'react-native'
import { styles } from './Input.styles'

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
                    <View style={styles.container}>
                        <Text style={styles.label}>{placeholder}</Text>
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor={colors.primitive.grey600}
                            style={styles.inputLabel}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            {...props}
                        />
                    </View>
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
