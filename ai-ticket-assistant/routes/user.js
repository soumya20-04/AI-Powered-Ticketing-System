import express from "express"
import {login, logout, signup} from "../controllers/users.js"
import { authenticate } from "../middleware/auth.js"

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)



export default router