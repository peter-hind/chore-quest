import express from 'express'
import * as db from '../db/functions/prizes'

const router = express.Router()

// GET /api/v1/prizes
router.get('/:id', async (req, res) => {
  try {
    const prizes = await db.getAllPrizes(id)
  } catch (error) {
    res.sendStatus(500).json({ message: 'Unable to get prizes' })
  }
})
