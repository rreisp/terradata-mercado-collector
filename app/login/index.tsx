import {
  Image,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView
} from 'react-native'
import { colors } from '@/core/constants/colors'
import { Input } from '@/core/components/widgets/input'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { router } from 'expo-router'
import { useDataStore } from '@/core/types/data'


const schema = z.object({
  email: z.string().min(1, { message: "O e-mail é obrigatório" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
})

type FormData = z.infer<typeof schema>

export default function Login() {

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const setPageOne = useDataStore((state: { setPageOne: any }) => state.setPageOne)


  function handleLogin(data: FormData) {
    console.log("PASSANDO DADOS DA PAGINA DE LOGIN");
    console.log(data.password);

    setPageOne({
      email: data.email,
      password: data.password
    })

    if (data.password == '12345678') {
      router.push("/choice")
    } else {
      router.push("/")
    }

  }

  return (
    <View style={styles.container}>
      {/* <Header
        step='Passo 1'
        title='LOGIN'
      /> */}
      <View style={styles.logo}>
        <Image source={require('../../assets/images/react-logo.png')} />
        <Text style={styles.title}>
          CAPTURE<Text style={{ color: colors.white }}>.WISE</Text>
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>E-mail:</Text>
        <Input
          name="email"
          control={control}
          placeholder="Digite seu e-mail..."
          error={errors.email?.message}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha:</Text>
        <Input
          name="password"
          control={control}
          placeholder="Digite a senha"
          error={errors.password?.message}
          keyboardType="default"
        />

        <Pressable style={styles.button} onPress={handleSubmit(handleLogin)}>
          <Text style={styles.buttonText}>ENVIAR</Text>
        </Pressable>

      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logo: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente    
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.blue,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.green
  },
})