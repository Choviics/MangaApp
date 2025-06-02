import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '~/utils/themes';
import { useCallback, useState } from 'react';
import ThemeModal from '~/components/ThemeModal';
import ModalPer from '~/components/Modal';
import { useSavedMangas } from '~/api/mangaStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerPage from '~/components/BannerPage';
import ModalInfo from '~/components/ModalInfo';
import { infoAppMsg } from '~/utils/messages';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);
  const [cacheModalVisible, setCacheModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const { removeAllMangas } = useSavedMangas();

  const removeAllReads = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const mangaKeys = allKeys.filter((key) => key.startsWith(`@manga_read_chapters`));

      // Eliminar todas las claves de manga
      await AsyncStorage.multiRemove(mangaKeys);
    } catch (error) {
      console.error('Error removing all manga reads:', error);
    }
  }, []);

  const cacheOptions: {
    name: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      name: 'Borrar guardados',
      onPress: () => {
        removeAllMangas();
        setCacheModalVisible(false);
      },
      icon: 'heart',
    },
    {
      name: 'Borrar leidos',
      onPress: () => {
        removeAllReads();
        setCacheModalVisible(false);
      },
      icon: 'eye',
    },
    {
      name: 'Borrar todo',
      onPress: () => {
        removeAllMangas();
        removeAllReads();
        setCacheModalVisible(false);
      },
      icon: 'close-circle',
    },
  ];

  const contactOptions: {
    name: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      name: 'Email',
      onPress: () => {
        const emailUrl = 'mailto:vgcordovacastillo@gmail.com';
        Linking.openURL(emailUrl);
      },
      icon: 'mail',
    },
    {
      name: 'Discord',
      onPress: () => {
        const discordUrl = 'https://discord.com/users/Chovii';
        Linking.openURL(discordUrl);
      },
      icon: 'logo-discord',
    },
    {
      name: 'Twitter',
      onPress: () => {
        const twitterUrl = 'https://x.com/TlsChovii';
        Linking.openURL(twitterUrl);
      },
      icon: 'logo-twitter',
    },
    {
      name: 'GitHub',
      onPress: () => {
        const githubUrl = 'https://github.com/Choviics';
        Linking.openURL(githubUrl);
      },
      icon: 'logo-github',
    },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: theme.background }}>
      <BannerPage title="Configuraciones" icon="settings" />
      <View className="flex-1 p-4">
        <Text className="mt-10 text-2xl font-bold" style={{ color: theme.text }}>
          Aplicación
        </Text>

        {/* Opciones del perfil */}
        <View className="mt-4 overflow-hidden rounded-xl" style={{ backgroundColor: theme.card }}>
          <TouchableOpacity
            className="flex-row items-center border-b p-4"
            style={{ borderColor: theme.border }}
            onPress={() => setCacheModalVisible(true)}>
            <Ionicons name="trash-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Limpiar Cache
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b p-4"
            onPress={() => setIsThemeModalVisible(true)}>
            <Ionicons name="moon-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Tema
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
        </View>

        <Text className="mt-10 text-2xl font-bold" style={{ color: theme.text }}>
          Más
        </Text>

        <View className="mt-4 overflow-hidden rounded-xl" style={{ backgroundColor: theme.card }}>
          <TouchableOpacity
            className="flex-row items-center border-b p-4"
            style={{ borderColor: theme.border }}
            onPress={() => setContactModalVisible(true)}>
            <Ionicons name="mail-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Contactanos
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4"
            onPress={() => setInfoModalVisible(true)}>
            <Ionicons name="help-circle-outline" size={24} color={theme.primary} className="mr-3" />
            <Text className="flex-1" style={{ color: theme.text }}>
              Información
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
          </TouchableOpacity>
        </View>

        {/* Usar el componente ThemeModal */}
        <ThemeModal visible={isThemeModalVisible} onClose={() => setIsThemeModalVisible(false)} />
        <ModalPer
          visible={cacheModalVisible}
          close={() => setCacheModalVisible(false)}
          options={cacheOptions}
          title="Caché de la aplicación"
        />
        <ModalPer
          visible={contactModalVisible}
          close={() => setContactModalVisible(false)}
          options={contactOptions}
          title="Redes de contacto"
        />
        <ModalInfo
          visible={infoModalVisible}
          close={() => setInfoModalVisible(false)}
          text={infoAppMsg()}
          title="Información de la aplicación"
        />
      </View>
    </SafeAreaView>
  );
}
