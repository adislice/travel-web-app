import { AuthProvider, AuthUserProvider } from '@/context/authContext'
import { NavigationContextProvider } from '@/context/navigationContext'
import '@/styles/globals.css'
import { Figtree, Inter, Noto_Sans, Plus_Jakarta_Sans, Poppins } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans"
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"]
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: "--font-sans"
})

const plusJkt = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: "--font-sans",
  
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"]
})

export default function App({ Component, pageProps }) {
  return <>
  <style jsx global>
  {`
    :root {
      --font-sans: ${notoSans.style.fontFamily};
      --font-heading: ${poppins.style.fontFamily};
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
