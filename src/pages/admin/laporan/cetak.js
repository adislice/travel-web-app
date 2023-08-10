import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { getDataLaporan } from '@/services/PemesananService';
import { formatRupiah, formatTimestampLaporan } from '@/lib/helper';
import { Font } from '@react-pdf/renderer'
import { useFirebaseAuth } from '@/context/FirebaseAuthContext';
import { Image } from '@react-pdf/renderer';
import Head from 'next/head';

Font.registerHyphenationCallback(word => [word]);

function CetakLaporan() {
  const router = useRouter()
  const [loggedUser, setLoggedUser] = useState(null)
  const [authUser, authUserData] = useFirebaseAuth()
  const { tglAwal, tglAkhir, status } = router.query
  const [dataLaporan, setDataLaporan] = useState(null)
  const [totalPemasukan, setTotalPemasukan] = useState(0)

  useEffect(() => {
    console.log("cetak ", loggedUser)
    if (loggedUser != null) {
      console.log("cetak ", loggedUser)
      getDataLaporan(tglAwal, tglAkhir, status).then((data) => {
        setDataLaporan(data)
        const sum = data.reduce((acc, object) => {
          return acc + object.total_bayar
        }, 0)
        console.log(sum)
        setTotalPemasukan(sum)
      }).catch((error) => {
        console.log(error)
      })
    }

    return () => {}
 }, [loggedUser])

 useEffect(() => {
  if (authUserData) {
    setLoggedUser(authUserData)
  }
  return () => {}
}, [authUserData])
  return (<>
    {dataLaporan == null ? (
    <div>Loading...</div>
    ) : (          
    <PDFViewer className='w-full h-screen'>
      <Head>
        <title>Laporan Pemesanan Paket Wisata {formatIsoDate(tglAwal)} - {formatIsoDate(tglAkhir)}</title>
      </Head>
      <MyDocument data={dataLaporan} 
      loggedUser={loggedUser} 
      tglAwal={formatIsoDate(tglAwal)} 
      tglAkhir={formatIsoDate(tglAkhir)}
      total={totalPemasukan} />
    </PDFViewer>
    )}
    </>
  )
}

export default CetakLaporan

const styles = StyleSheet.create({
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0 
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 

    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  },
  page: {
    padding: 50
  }
});

const MyDocument = ({data, loggedUser, tglAwal, tglAkhir, total}) => (
  <Document title='Laporan Pemesanan'>
    <Page size="A4" style={styles.page} orientation="landscape">
    <View style={{flexDirection: "row", marginBottom: "5"}}>
    <Image src={"https://kencana-admin.vercel.app/logo-kencana.png"}
      style={{width: "55", height: "55", marginRight: 10}}/>
      <View style={{flexDirection: "column", marginBottom: "5"}}>
        <Text style={{fontSize: "14"}}>Biro Perjalanan Wisata</Text>
        <Text style={{fontSize: "20", fontWeight: "700"}}>Kencana Wisata</Text>
        <Text style={{fontSize: "14"}}>Jl. Dr. Sutomo Komplek Dupan Square Blok C8 Pekalongan</Text>
        
      </View>
    </View>
      
      <View style={{width: "100%", borderBottom: "2", borderBottomColor: "#000", marginBottom: "5"}}>
        
      </View>
      <View style={{flexDirection: "column", marginBottom: "8", marginTop: "8"}}>
        <Text style={{fontSize: "16", textAlign: "center", fontWeight: "bold"}}>Laporan Pemesanan Paket Wisata</Text>
        <Text style={{fontSize: "14", textAlign: "center"}}>Periode {tglAwal} - {tglAkhir}</Text>
      </View>
    <View style={tableStyle}> 
    <View style={tableRowStyle}>

        <View style={firstTableColHeaderStyle}>
          <Text style={tableCellHeaderStyle}>No.</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "12%"}]}>
          <Text style={tableCellHeaderStyle}>Tanggal</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "14%"}]}>
          <Text style={tableCellHeaderStyle}>Nama Pemesan</Text>
        </View>
        
        <View style={[tableColHeaderStyle, {width: "20%"}]}>
          <Text style={tableCellHeaderStyle}>Paket Wisata</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "14%"}]}>
          <Text style={tableCellHeaderStyle}>Kendaraan</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "12%"}]}>
          <Text style={tableCellHeaderStyle}>Total Bayar</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "12%"}]}>
          <Text style={tableCellHeaderStyle}>Status</Text>
        </View>

        <View style={[tableColHeaderStyle, {width: "14%"}]}>
          <Text style={tableCellHeaderStyle}>Tanggal Bayar</Text>
        </View>

      </View>

      {data.map((item, index) => (
      <View style={tableRowStyle}>

        <View style={firstTableColStyle}>
          <Text style={tableCellStyle}>{index+1}</Text>
        </View>

        <View style={[tableColStyle, {width: "12%"}]}>
          <Text style={tableCellStyle}>{formatTimestampLaporan(item.created_at)}</Text>
        </View>

        <View style={[tableColStyle, {width: "14%"}]}>
          <Text style={tableCellStyle}>{item.user_nama}</Text>
        </View>

        <View style={[tableColStyle, {width: "20%"}]}>
          <Text style={tableCellStyle}>{item.paket_wisata_nama}</Text>
        </View>

        <View style={[tableColStyle, {width: "14%"}]}>
          <Text style={tableCellStyle}>{item.jenis_kendaraan_nama} ({item.jenis_kendaraan_jumlah_seat} seat)</Text>
        </View>

        <View style={[tableColStyle, {width: "12%"}]}>
          <Text style={tableCellStyle}>{formatRupiah(item.total_bayar)}</Text>
        </View>
        <View style={[tableColStyle, {width: "12%"}]}>
          <Text style={tableCellStyle}>{item.status}</Text>
        </View>
        <View style={[tableColStyle, {width: "14%"}]}>
          <Text style={tableCellStyle}>{formatTimestampLaporan(item.tanggal_bayar)}</Text>
        </View>

      </View>
      ))}
      <View style={{width: "100%", marginBottom: "5", marginTop:"8"}}>
      <Text style={{fontSize: "14", textAlign: "left", marginBottom: "10", fontWeight: "bold"}}>Total : {formatRupiah(total)}</Text>
      </View>

      <View style={{width: "100%", marginBottom: "5", marginTop:"10"}}>
      <Text style={{fontSize: "14", textAlign: "right", marginBottom: "10"}}>Dicetak pada : {getCurrentDateTime()}</Text>
      <View style={{width: "30%",alignSelf: "flex-end", flexDirection: "column", justifyContent: "flex-end"}}>
      <Text style={{fontSize: "14", textAlign: "center", }}>Oleh</Text>
      <Text style={{fontSize: "14", textAlign: "center", marginTop:"50" }}>{loggedUser?.nama}</Text>
      </View>
      
      </View>
      </View>
    </Page>
  </Document>
);



const tableStyle = {
  display: "table",
  width: "auto"
};

const tableRowStyle = {
  flexDirection: "row"
};

const firstTableColHeaderStyle = {
  width: "5%",
  borderStyle: "solid",
  borderColor: "#000",
  borderBottomColor: "#000",
  borderWidth: 1,
  backgroundColor: "#e6e6e6"
};

const tableColHeaderStyle = {

  borderStyle: "solid",
  borderColor: "#000",
  borderBottomColor: "#000",
  borderWidth: 1,
  borderLeftWidth: 0,
  backgroundColor: "#e6e6e6"
};

const firstTableColStyle = {
  width: "5%",
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 1,
  borderTopWidth: 0
};

const tableColStyle = {
  
  borderStyle: "solid",
  borderColor: "#000",
  borderWidth: 1,
  borderLeftWidth: 0,
  borderTopWidth: 0
};

const tableCellHeaderStyle = {
  textAlign: "center",
  margin: 4,
  fontSize: 12,
  fontWeight: "bold"
};

const tableCellStyle = {
  textAlign: "left",
  margin: 5,
  fontSize: 12
};

function formatIsoDate(isoDateString) {
  const date = new Date(isoDateString);

  const day = date.getDate();
  const month = date.toLocaleDateString('id-ID', { month: 'long' });
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year}`;
}

function getCurrentDateTime() {
  const now = new Date();

  const day = now.getDate();
  const month = now.toLocaleDateString('id-ID', { month: 'long' });
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
