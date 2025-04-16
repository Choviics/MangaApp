import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

type ButtonProps = {
  readonly text: string;
  readonly onPress: () => void;
  readonly backgroundColor?: string | string[];  // Cambiado a string[] simple
  readonly colorText?: string;
  readonly fontSize?: string;
  readonly borderRadius?: number;
};

export default function ButtonCustom({
  text,
  onPress,
  backgroundColor,
  colorText,
  fontSize,
  borderRadius,
}: ButtonProps) {

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
    <View style={{ width: '100%', borderRadius: borderRadius ?? 50, overflow: 'hidden' }}>
      <LinearGradient
        colors={getColors() as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 14,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
        <Pressable 
          onPress={onPress}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Text
            className={`${fontSize ?? 'text-xl'} font-semibold ${colorText ?? 'text-white'}`}>
            {text}
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}