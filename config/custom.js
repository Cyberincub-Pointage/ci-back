module.exports.custom = {

  // Administrateur 
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    nom: process.env.ADMIN_LASTNAME,
    prenom: process.env.ADMIN_FIRSTNAME,
  },

  // Configuration nodemailer  
  adminEmail: process.env.ADMIN_EMAIL,
  emailSender: process.env.SMTP_FROM,
  emailService: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false

    },


  },


  permissionEmail: process.env.PERMISSION_EMAIL,

  // Configuration par application
  appConfig: {
    ci: {
      name: 'CYBER INCUB POINTAGE',
      logos: {
        desktop: 'img/logo-desk.png',
        mobile: 'img/logo-mob.png',
      },
      urls: {
        prod: process.env.PROD_URL,
        dev: 'http://localhost:3000',
      },
    },
  },

  presenceZone: {
    latitude: 6.4373803,
    longitude: 2.3401794,
    radius: 100
  },
};
