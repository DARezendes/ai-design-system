import express from 'express'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    console.log('API response:', JSON.stringify(data, null, 2))
    res.json(data)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Failed to generate' })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))
