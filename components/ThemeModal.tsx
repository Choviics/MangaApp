import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/themes';

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeModal = ({ visible, onClose }: ThemeModalProps) => {
  const { theme, availableThemes, setTheme } = useTheme();

  const handleThemeSelect = (themeName: string) => {
    setTheme(themeName);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center">
        {/* Overlay semi-transparente */}
        <View 
          className="absolute inset-0 bg-black/50" 
          onTouchEnd={onClose} 
        />
        
        {/* Contenido del modal centrado */}
        <View 
          className="w-[90%] max-w-md rounded-2xl p-4"
          style={{ backgroundColor: theme.card }}
        >
          <Text 
            className="text-xl font-bold mb-4 text-center"
            style={{ color: theme.text }}
          >
            Seleccionar Tema
          </Text>
          
          <ScrollView className="max-h-80">
            {availableThemes.map((availableTheme) => (
              <TouchableOpacity
                key={availableTheme.name}
                className={`p-4 rounded-xl mb-2 flex-row items-center ${
                  theme.name === availableTheme.name ? 'border-2' : ''
                }`}
                style={{
                  backgroundColor: availableTheme.card,
                  borderColor: availableTheme.primary,
                }}
                onPress={() => handleThemeSelect(availableTheme.name)}
              >
                <View 
                  className="w-8 h-8 rounded-full mr-3" 
                  style={{ backgroundColor: availableTheme.primary }} 
                />
                <Text 
                  className="flex-1 capitalize" 
                  style={{ color: availableTheme.text }}
                >
                  {availableTheme.name}
                </Text>
                {theme.name === availableTheme.name && (
                  <Ionicons name="checkmark-circle" size={24} color={availableTheme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ThemeModal;