// app/index.tsx
import { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChargePage from './ChargePage';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowWelcome, setShouldShowWelcome] = useState(false);

  const STORAGE_KEY = `@welcome_page_seen`;

  const isWelcomePageVisited = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!storedData) {
        return false;
      }
      
      const welcomeData = JSON.parse(storedData);
      return welcomeData.isVisited === true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const hasVisited = await isWelcomePageVisited();
        
        setShouldShowWelcome(!hasVisited);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setShouldShowWelcome(true);
        setIsLoading(false);
      }
    };

    checkWelcomeStatus();
  }, []);

  if (isLoading) {
    return (
      <ChargePage/>
    );
  }

  if (shouldShowWelcome) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)/home" />;
}