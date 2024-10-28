import express from 'express';
import nodemailer from 'nodemailer';


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: "joamilibarra@gmail.com",
        pass: "fegf owpo zprw zpwu"
    }

});