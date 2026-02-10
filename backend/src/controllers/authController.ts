import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { pool } from "../config/database.js"

const SECRET = process.env.JWT_SECRET || "secret123"

// Registrazione
export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password richiesti" })
  }

  try {
    const password_hash = bcrypt.hashSync(password, 10)

    await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password_hash]
    )

    const [rows]: any = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    )

    const user = rows[0]
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: "1h" }
    )

    res.status(201).json({ token, message: "Utente registrato con successo" })
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username già esistente" })
    }
    
    res.status(500).json({ error: "Errore interno del server" })
  }
}

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password richiesti" })
  }

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    )

    if (rows.length === 0) {
      return res.status(401).json({ error: "Username non valido" })
    }

    const user = rows[0]
    const valid = bcrypt.compareSync(password, user.password)
    
    if (!valid) {
      return res.status(401).json({ error: "Password non valida" })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: "1h" }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: "Errore interno del server" })
  }
}