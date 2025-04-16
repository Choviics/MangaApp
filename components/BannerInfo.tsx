import React from 'react';
import { View, Text } from 'react-native';

interface BannerInfoProps {
  title: string;
  colorText: string;
  backgroundColor: string;
  fontSize?: 'text-sm' | 'text-base' | 'text-lg';
}

const BannerInfo = ({
  title,
  colorText,
  backgroundColor,
  fontSize = 'text-base',
}: BannerInfoProps) => {
  return (
    <View className="items-center">
      <View className="w-auto rounded-full px-4 py-1" style={{ backgroundColor: backgroundColor }}>
        <Text className={`text-center ${fontSize}`} style={{ color: colorText }}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default BannerInfo;
