import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type ButtonProps = {
  readonly text: string;
  readonly onPress: () => void;
  readonly backgroundColor?: string | string[];
  readonly colorText?: string;
  readonly fontSize?: string;
  readonly borderRadius?: number;
  readonly fullWidth?: boolean;
  readonly paddingItems?: number;
  readonly icon?: keyof typeof Ionicons.glyphMap;
  readonly centered?: boolean;
};

export default function ButtonCustom({
  text,
  onPress,
  backgroundColor,
  colorText,
  fontSize,
  borderRadius,
  fullWidth = true,
  paddingItems = 14,
  icon,
  centered = false,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const getColors = () => {
    if (!backgroundColor) {
      return ['#DB004C', '#FC008E'];
    }
    
    if (Array.isArray(backgroundColor)) {
      return backgroundColor;
    }
    
    return [backgroundColor, backgroundColor];
  };

  return (
    <View style={{ 
      width: fullWidth ? '100%' : 'auto',
      borderRadius: borderRadius ?? 50,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    }}
    className={`${pressed ? 'opacity-80' : ''} overflow-hidden`}
    >
      <LinearGradient
        colors={getColors() as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: paddingItems,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: fullWidth ? 14 : 24,
        }}
        >
        <Pressable 
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          style={{ 
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: centered ? 'center' : 'flex-start',
          }}
        >
          {icon && (
            <Ionicons 
              name={icon}
              size={20}
              color={colorText ?? 'white'}
              style={{ marginRight: 6 }}
            />
          )}
          <Text
            className={`${fontSize ?? 'text-xl'} font-semibold ${colorText ?? 'text-white'}`}>
            {text}
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}