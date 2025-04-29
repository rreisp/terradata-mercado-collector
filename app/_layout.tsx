import { Stack } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
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
          name="choice/index"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="step/index"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="create/index"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="tools/index"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="loader/index"
          options={{
            headerShown: false
          }} />

        <Stack.Screen
          name="dynamic/index"
          options={{
            headerShown: false
          }} />

      </Stack>
    </QueryClientProvider>
  );
}
