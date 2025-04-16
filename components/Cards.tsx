import { View } from 'react-native';

export default function Cards({ rows = 1, columns = 2 }) {
  // Crear arrays para filas y columnas basados en los props
  const rowsArray = Array(rows).fill(0);

  return (
    <View className="w-full flex-shrink-0">
      {rowsArray.map(() => (
        <View key={`row-${Date.now()}-${Math.random()}`} className="flex-row py-2" style={{ gap: 12 }}>
          {Array(columns)
            .fill(0)
            .map(() => (
              <View
                key={`col-${Date.now()}-${Math.random()}`}
                className="h-36 flex-1 rounded-2xl bg-slate-700/35"
              />
            ))}
        </View>
      ))}
    </View>
  );
}
