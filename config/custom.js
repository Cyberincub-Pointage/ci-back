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
  emailSender: process.env.EMAIL_FROM,
  resendApiKey: process.env.RESEND_API_KEY,

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
