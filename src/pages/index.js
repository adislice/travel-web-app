import Image from "next/image"
import { Inter, Lexend_Deca } from "next/font/google"
import { LinkButton } from "@/components/Button"
import { ArrowDown } from "lucide-react"
import Head from "next/head"
import { SearchCheckIcon } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })
const lexendDeca = Lexend_Deca({ subsets: ["latin"] })
import shapedivider from './index.module.css'
import { ArrowDownToLineIcon } from "lucide-react"
import { ShieldIcon } from "lucide-react"

export default function Home() {
  return (
    <div className={` ${lexendDeca.className}`}>
      <Head>
        <title>Kencana Wisata</title>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </Head>
      <nav className="h-16 bg-white flex flex-row lg:px-10 items-center sticky top-0 z-[999]">
        <div className="h-full flex items-center">
          <img src="/logo-kencana-transparent.png" alt="logo" className="h-full" />
          <h5 className="font-bold text-lg">Kencana Wisata</h5>
        </div>
        <div className="ml-auto">
          <LinkButton href="/login"><ShieldIcon className="h-4 w-4" />Admin Area</LinkButton>
        </div>

      </nav>

      <section className="bg-gradient-to-bl from-blue-400 via-indigo-200 to-red-100">
        <div className="flex flex-col-reverse gap-y-8 lg:flex-row max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16">
          <div className="w-full py-5 lg:w-1/2 text-center lg:text-start flex justify-center items-start flex-col">
            <h1 className="mb-4 text-3xl font-extrabold lg:self-start self-center leading-none md:text-4xl xl:text-5xl text-gray-800">
              Kencana Wisata Mobile App
            </h1>
            <p className="mb-4 font-light  lg:mb-6 md:text-lg lg:text-xl text-gray-700">
              Pesan paket wisata dengan mudah dari mana saja dan kapan saja melalui smartphone Anda. Download sekarang!
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center lg:self-start self-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700/80 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              <ArrowDownToLineIcon className="mr-2 -ml-1 h-5 w-5" />
              Download
            </a>
          </div>
          <div className="w-full lg:w-1/2 lg:mt-0 lg:col-span-5 flex relative items-center justify-center">
            <div className="w-48 shadow-xl -mr-16 scale-[.8] outline-white rounded-xl overflow-clip">
              <img
                src="/ss-mobile-2.png"
                alt="mockup"
                className="z-[1] w-full h-auto "
              />
            </div>
            <div className="w-48 shadow-2xl z-[2] outline-white rounded-xl overflow-clip">
              <img
                src="/ss-mobile-1-new.png"
                alt="mockup"
                className="z-[1] w-full h-auto "
              />
            </div>
            <div className="w-48 shadow-xl -ml-16 scale-[.8] outline-white rounded-xl overflow-clip">
              <img
                src="/ss-mobile-3.png"
                alt="mockup"
                className="z-[1] h-auto w-48 shadow-xl outline-white "
              />
            </div>




            {/* <img src="blob (2).svg" alt="" className="absolute" /> */}
          </div>
        </div>
      </section>
      <section className="p-16 flex flex-col">
        {/* <h2 className="text-xl text-center">Fitur Yang Kami Tawarkan</h2> */}
        <div className="flex flex-row w-full">
          <div className="w-1/3 flex flex-col items-center p-2">
            <i className='bx bxs-badge-check text-4xl p-5 bg-primary-100 text-primary-500 rounded-lg mb-2'></i>
            <h5 className="text-center text-xl font-bold text-gray-800">Mudah</h5>
            <p className="text-gray-700 text-center">Temukan berbagai macam paket wisata dan pesan paket wisata dengan mudah</p>
          </div>
          <div className="w-1/3 flex flex-col items-center p-2">
            <i className='bx bxs-hot text-4xl p-5 bg-primary-100 text-primary-500 rounded-lg mb-2'></i>
            <h5 className="text-center text-xl font-bold text-gray-800">Praktis</h5>
            <p className="text-gray-700 text-center">Pesan paket wisata dari mana saja dan kapan saja hanya dari genggaman tangan</p>
          </div>
          <div className="w-1/3 flex flex-col items-center p-2">
            <i className='bx bxs-sun text-4xl p-5 bg-primary-100 text-primary-500 rounded-lg mb-2'></i>
            <h5 className="text-center text-xl font-bold text-gray-800">Prakiraan Cuaca</h5>
            <p className="text-gray-700 text-center">Ketahui informasi prakiraan cuaca sebelum perjalanan wisata agar lebih siap</p>
          </div>
        </div>
      </section>

      <section className="relative h-20">
        <div className={shapedivider.shape_wave}>
          <svg className={shapedivider.shape_wave__svg} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className={shapedivider.shape_wave__shape_fill}></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className={shapedivider.shape_wave__shape_fill}></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className={shapedivider.shape_wave__shape_fill}></path>
          </svg>
        </div>
      </section>
      <section className="bg-primary-400 px-16 py-4 text-white">
        <p className="text-center">Copyright © 2022 Kencana Wisata</p>
      </section>


    </div>
  )
}
