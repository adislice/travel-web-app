import axios from "axios"
import path from 'path'
import fs from 'fs'

export default async function handler(req, res) {
  try {
    const { icon } = req.query
    const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`

    const response = await axios.get(imageUrl, {responseType: "arraybuffer"})
    const imageBuffer = Buffer.from(response.data, 'binary')

    const imageName = `${icon}.png`

    res.setHeader('Content-Type', 'image/jpeg');
    return res.status(200).end(imageBuffer)
    

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  


}
