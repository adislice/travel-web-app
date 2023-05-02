import { AuthProvider, AuthUserProvider } from '@/context/authContext'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans"
})

export default function App({ Component, pageProps }) {
  return <>
  <style jsx global>
  {`
    :root {
      --font-sans: ${inter.style.fontFamily};
    }
  `}
  </style>
  <AuthUserProvider>
    <Component {...pageProps} />
  </AuthUserProvider>
  </>
}
