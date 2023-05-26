import { AuthProvider, AuthUserProvider } from '@/context/authContext'
import { NavigationContextProvider } from '@/context/navigationContext'
import '@/styles/globals.css'
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans"
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"]
})

export default function App({ Component, pageProps }) {
  return <>
  <style jsx global>
  {`
    :root {
      --font-sans: ${poppins.style.fontFamily};
    }
  `}
  </style>
  <AuthUserProvider>
    <NavigationContextProvider>
      <Component {...pageProps} />
    </NavigationContextProvider>
  </AuthUserProvider>
  </>
}
