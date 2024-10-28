import express from 'express';
import MailController from '../../controllers/mail.controller.js';
const router = express.Router();



router.get('/mail', MailController.sendMail);