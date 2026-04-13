// server/services/emailService.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Function to send enrollment email with template
const sendEnrollmentEmail = async (student) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            authMethod: "PLAIN",
            tls: {
                rejectUnauthorized: false
            }
        });

        // Generate registration link with token
        const registrationLink = process.env.FRONTEND_URL;
        console.log('====================================');
        console.log(registrationLink);
        console.log('====================================');
        // Email template
        const emailTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Complete Your Registration</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 0;
                        background-color: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .reg-number {
                        background-color: #f0f0f0;
                        padding: 15px;
                        border-radius: 8px;
                        text-align: center;
                        margin: 20px 0;
                        font-size: 24px;
                        font-weight: bold;
                        color: #667eea;
                    }
                    .button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        padding: 14px 35px;
                        border-radius: 50px;
                        font-weight: bold;
                        margin: 20px 0;
                        transition: transform 0.3s ease;
                    }
                    .button:hover {
                        transform: translateY(-2px);
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    .info-box {
                        background-color: #e8f4f8;
                        border-left: 4px solid #667eea;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    @media only screen and (max-width: 600px) {
                        .container {
                            width: 100%;
                            margin: 10px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .button {
                            display: block;
                            text-align: center;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Student Registration</h1>
                        <p>Welcome to Our Institution</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hello ${student.name}!</h2>
                        
                        <p>Thank you for applying to our program. We're excited to have you on board!</p>
                        
                        <div class="reg-number">
                            📝 Registration Number: ${student.regNo}
                        </div>
                        
                        <div class="info-box">
                            <strong>📋 Important Information:</strong><br>
                            • Your registration number has been generated successfully<br>
                            • Please complete your registration within <strong>7 days</strong><br>
                            • Keep your registration number for future reference
                        </div>
                        
                        <p>To complete your registration and activate your student account, please click the button below:</p>
                        
                        <div style="text-align: center;">
                            <a href="${registrationLink}" class="button">Complete Registration →</a>
                        </div>
                        
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
                            ${registrationLink}
                        </p>
                        
                        <div class="info-box">
                            <strong>⚠️ Note:</strong> This link will expire in 7 days for security reasons.
                            If you didn't request this registration, please ignore this email.
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message from Student Management System.</p>
                        <p>For assistance, please contact our support team at support@yourinstitution.edu</p>
                        <p>&copy; 2024 Student Management System. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Alternative simple text version for email clients that don't support HTML
        const textVersion = `
            Hello ${student.name}!
            
            Thank you for applying to our program.
            
            Registration Number: ${student.regNo}
            
            To complete your registration, please visit this link:
            ${registrationLink}
            
            Important Information:
            • Your registration number has been generated successfully
            • Please complete your registration within 7 days
            • Keep your registration number for future reference
            
            This link will expire in 7 days for security reasons.
            If you didn't request this registration, please ignore this email.
            
            For assistance, please contact our support team at support@yourinstitution.edu
        `;
        
        // Send email
        const mailOptions = {
            from: `"Student Management System" <${process.env.FROM_EMAIL}>`,
            to: student.email,
            subject: '🎓 Complete Your Registration - Action Required',
            html: emailTemplate,
            text: textVersion  // Fallback for email clients that don't support HTML
        };
        
        await transporter.sendMail(mailOptions);
        
        console.log(`Registration email sent to ${student.email}`);
        return { success: true };
        
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = sendEnrollmentEmail;
