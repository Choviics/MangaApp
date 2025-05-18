import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BannerInfoProps {
  title: string;
  colorText: string;
  backgroundColor: string;
  fontSize?: 'text-sm' | 'text-base' | 'text-lg';
  icon?: keyof typeof Ionicons.glyphMap;
  shape?: 'rounded-full' | 'rounded-lg';
}

const BannerInfo = ({
  title,
  colorText,
  backgroundColor,
  fontSize = 'text-base',
  icon,
  shape = 'rounded-full',
}: BannerInfoProps) => {
  return (
    <View className="items-start">
      <View className={`w-auto flex-row items-center ${shape} px-4 py-1`} style={{ backgroundColor: backgroundColor }}>
        {icon && (
          <Ionicons 
            name={icon}
            size={16}
            color={colorText}
            style={{ marginRight: 6 }}
          />
        )}
        <Text className={`text-left ${fontSize}`} style={{ color: colorText }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default BannerInfo;
