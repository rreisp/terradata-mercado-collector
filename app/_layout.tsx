import { Stack } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <LanguageProvider >
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="login/index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="tools/index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="loader/list/index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="loader/form/index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="dynamic/list/index"
            options={{
              headerShown: false
            }} />

          <Stack.Screen
            name="dynamic/form/index"
            options={{
              headerShown: false
            }} />

        </Stack>
      </QueryClientProvider>
    </LanguageProvider>
  );
}
