import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TimepickerUI } from 'timepicker-ui';

function TestTime() {
  const tmRef = useRef(null);
  // const [inputValue, setInputValue] = useState("12:00");
  const [inputValue, setInputValue] = useState({jam:'', menit: ''});


  const handleChangeJam = (e) => {
    const value = e.target.value;
    // if (/^\d{0,2}$/.test(value)) { // Validasi hanya menerima angka maksimal 2 digit
    //   if (value.charAt(0) <= 2) { // Angka pertama <= 2
    //     setInputValue(value);
    //     console.log("pertama")
    //   } else if (value.charAt(0) === '2' && value.charAt(1) <= 3) { // Angka pertama = 2, angka kedua <= 3
    //     setInputValue(value);
    //     console.log("kedua")
    //   }
    // }
    if(value <= 23) {
      setInputValue(oldValue => ({...oldValue,jam:value,}))
    }
  };
  const handleChangeMenit = (e) => {
    const value = e.target.value;
    console.log(value.charAt(0) === '2' && value.charAt(1) <= 3)
    // if (/^\d{0,2}$/.test(value)) { // Validasi hanya menerima angka maksimal 2 digit
    //   if (value.charAt(0) <= 2) { // Angka pertama <= 2
    //     setInputValue(value);
    //     console.log("pertama")
    //   } else if (value.charAt(0) === '2' && value.charAt(1) <= 3) { // Angka pertama = 2, angka kedua <= 3
    //     setInputValue(value);
    //     console.log("kedua")
    //   }
    // }
    if(value <= 59) {
      setInputValue(oldValue => ({...oldValue, menit:value}))
    }
  };

  return (
    <div>
      jam
    <input type="text" value={inputValue.jam} onChange={handleChangeJam} />
    menit
    <input type="text" value={inputValue.menit} onChange={handleChangeMenit} />
    <p>{inputValue.jam}:{inputValue.menit}</p>
    </div>
  )
}

export default TestTime