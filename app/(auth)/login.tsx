import { Button } from '@/components/ui/Button';
import InputTextLabel from '@/components/ui/Form/InputText/InputTextLabel';
import { FONTS } from '@/lib/customFont/fonts';
import { supabase } from '@/lib/supabase/supabase';
import colors from '@/lib/theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { z } from 'zod';


const LoginFormSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
    password: z.string()
        .min(1, 'Password is required')
})

type LoginFormSchemaType = z.infer<typeof LoginFormSchema>

export default function Login() {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormSchemaType>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // console.log(JSON.stringify(errors, null, 3))
    const onSubmit = async (data: LoginFormSchemaType) => {
        try {
            setLoading(true);
            setError(null);

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (loginError) throw loginError;
            console.log('User logged in successfully');

        } catch (err) {

            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error(err);

        } finally {

            setLoading(false);

        }
    }

    return (
        <LinearGradient
            colors={[colors.primitive.purpleAlpha50, colors.primitive.white]}
            style={styles.gradient}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.container}>
                    <StatusBar barStyle="dark-content" />
                    <View style={styles.header}
                    >
                        <Button
                            variant="ghost"
                            size="small"
                            iconOnly
                            leftIcon={<ArrowLeft size={32} color={colors.primitive.greyPurple} />}
                            onPress={() => router.back()}
                        />

                        <Button
                            style={styles.signUpButton}
                            title="Sign Up"
                            onPress={() => router.push('/signup')}
                            variant="text"
                            size="large"
                            fullWidth={false}
                            loading={false}
                        />
                    </View>

                    <Text style={[styles.title]}>G'day Mate, {"\n"}Welcome Back!</Text>

                    <View style={styles.form}>
                        <InputTextLabel
                            control={control}
                            errors={errors}
                            name={'email'}
                            placeholder={'Email'}
                            props={{
                                keyboardType: 'email-address',
                                autoCapitalize: 'none',
                            }}
                        />
                        <View style={styles.divider} />
                        <InputTextLabel
                            control={control}
                            errors={errors}
                            name={'password'}
                            placeholder={'Password'}
                            props={{
                                keyboardType: 'default',
                                autoCapitalize: 'none',
                                secureTextEntry: true,
                            }}
                        />
                    </View>

                    <Button
                        title="Login"
                        onPress={handleSubmit(onSubmit)}
                        variant="filled"
                        size="large"
                        fullWidth={true}
                        loading={loading}
                        disabled={loading}
                    />

                    {/* {error && Alert.alert('Error', error)} */}
                    {error && <Text style={styles.error}>{error}</Text>}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </LinearGradient>
    )
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
    error: {
        color: colors.primitive.red500,
        fontSize: 16,
        marginTop: 8,
    },
    title: {
        fontFamily: FONTS.CLASH_DISPLAY_BOLD,
        color: colors.primitive.greyPurple,
        fontSize: 32,
        lineHeight: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 56,
    },
    signUpButton: {
        paddingHorizontal: 0,
        color: colors.primitive.greyPurple,
    },
    form: {
        width: '100%',
        marginBottom: 48,
        marginTop: 24,
    },
    divider: {
        marginVertical: 8,
    }
})