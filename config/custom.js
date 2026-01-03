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
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production',
  },


  permissionEmail: process.env.PERMISSION_EMAIL,

  // Configuration par application
  appConfig: {
    ci: {
      name: 'PRO GESTION SOFT',
      logos: {
        desktop: 'assets/img/logo-desk.jpg',
        mobile: 'assets/img/logo-mob.jpg',
      },
      urls: {
        prod: process.env.PROD_URL,
        dev: 'http://localhost:3000',
      },
    },
  },

  presenceZone: {
    latitude: 6.497475511141847,
    longitude: 2.6637200356102406,
    radius: 100
  },

};
