import { AuthProvider, AuthUserProvider } from "@/context/authContext"
import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext"
import { NavigationContextProvider } from "@/context/navigationContext"
import "@/styles/globals.css"
import {
  Figtree,
  Inter,
  Noto_Sans,
  Plus_Jakarta_Sans,
  Poppins,
} from "next/font/google"
import Modal from "react-modal"
import NextNProgress from 'nextjs-progressbar';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
})

const plusJkt = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
})

Modal.setAppElement('#__next');

export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${notoSans.style.fontFamily};
            --font-heading: ${poppins.style.fontFamily};
          }
        `}
      </style>
      <FirebaseAuthProvider>
        <NavigationContextProvider>
          <NextNProgress height={2} />
          <Component {...pageProps} />
        </NavigationContextProvider>
      </FirebaseAuthProvider>
    </>
  )
}
