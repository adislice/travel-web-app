
import moment from "moment"
import { useEffect, useState } from "react"
import 'moment/locale/id'

function CurrentTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <>{moment(time).locale('id').format("DD MMMM YYYY, HH:mm:ss")}</>
}

export default CurrentTime
