import { format } from "date-fns"
import {id} from "date-fns/locale"

export function formatTimestampLengkap(timestamp) {
  try {
    return format(timestamp.toDate(), 'EEEE, dd MMMM yyyy, HH:mm', {locale: id})
  } catch (error) {
    return ""
  }
}

export function formatTimestamp(timestamp) {
  try {
    return format(timestamp.toDate(), 'dd MMM yyyy, HH:mm', {locale: id})
  } catch (error) {
    return ""
  }
}