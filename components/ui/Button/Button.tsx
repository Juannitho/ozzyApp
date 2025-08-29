import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

import colors from '@/theme/colors';

import { ButtonProps } from './Button.types';

import {
    baseStyles,
    iconStyles,
    sizeStyles,
    textSizeStyles,
    textVariantStyles,
    variantStyles,
} from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
    children,
    title,
    subtitle,
    variant = 'filled',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    style,
    textStyle,
    color,
    textColor,
    onPress,
    ...pressableProps
}) => {
    // Combine container styles
    const containerStyle = useMemo((): ViewStyle[] => {
        const styles: ViewStyle[] = [
            baseStyles.container,
            variantStyles[variant],
            sizeStyles[size],
        ];

        if (fullWidth) {
            styles.push(baseStyles.fullWidth);
        }

        if (iconOnly) {
            styles.push(iconStyles.iconOnly);
        }

        // Aplicar color personalizado si se proporciona
        if (color && variant === 'filled') {
            styles.push({ backgroundColor: color } as ViewStyle);
        } else if (color && variant === 'outline') {
            styles.push({ borderColor: color } as ViewStyle);
        }

        // Agregar estilo personalizado al final
        if (style) {
            styles.push(style);
        }

        return styles;
    }, [variant, size, fullWidth, iconOnly, color, style]);

    // Combinar estilos del texto
    const combinedTextStyle = useMemo((): TextStyle[] => {
        const styles: TextStyle[] = [
            textVariantStyles[variant],
            textSizeStyles[size],
        ];

        // Aplicar color de texto personalizado
        if (textColor) {
            styles.push({ color: textColor } as TextStyle);
        }

        // Agregar estilo de texto personalizado
        if (textStyle) {
            styles.push(textStyle);
        }

        return styles;
    }, [variant, size, textColor, textStyle]);

    // Determinar el color del indicador de carga
    const loadingColor = useMemo(() => {
        if (textColor) return textColor;
        return variant === 'filled' ? colors.primitive.white : colors.primitive.purple400;
    }, [variant, textColor]);

    // Renderizar contenido
    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="small" color={loadingColor} />;
        }

        return (
            <>
                {leftIcon && (
                    <View style={[iconStyles.iconContainer, iconStyles.leftIcon]}>
                        {leftIcon}
                    </View>
                )}

                {!iconOnly && (title || children) && (
                    <>
                        {typeof children === 'string' || !children ? (
                            <View style={{ alignItems: 'center' }}>
                                <Text style={combinedTextStyle}>{title || children}</Text>
                                {subtitle && (
                                    <Text style={[combinedTextStyle, baseStyles.subtitle]}>
                                        {subtitle}
                                    </Text>
                                )}
                            </View>
                        ) : (
                            children
                        )}
                    </>
                )}

                {rightIcon && (
                    <View style={[iconStyles.iconContainer, iconStyles.rightIcon]}>
                        {rightIcon}
                    </View>
                )}
            </>
        );
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                containerStyle,
                pressed && baseStyles.pressed,
                (disabled || loading) && baseStyles.disabled,
            ]}
            {...pressableProps}
        >
            {renderContent()}
        </Pressable>
    );
};