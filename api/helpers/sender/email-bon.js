const path = require('path');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const fs = require('fs');

module.exports = {
  friendlyName: 'Envoyer un e-mail',
  description: 'Envoie un e-mail en utilisant un template EJS.',

  inputs: {
    template: {
      type: 'string',
      // required: true,
      description: 'Le nom du template (ex: "request-user" pour contents/templix/request-user.ejs).'
    },
    to: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'L\'adresse e-mail du destinataire.'
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Le sujet de l\'e-mail.'
    },
    templateData: {
      type: 'json',
      defaultsTo: {},
      description: 'Les données à passer au template EJS pour le rendu.'
    },
    from: {
      type: 'string',
      defaultsTo: sails.config.custom.emailSender,
      description: 'L\'adresse e-mail de l\'expéditeur.'
    },
    layout: {
      type: 'string',
      defaultsTo: 'default-layout',
      description: 'Le nom du template de layout principal.'
    },
    appSlug: {
      type: 'string',
      required: true,
      description: 'Le slug de l\'application pour récupérer les logos et les URLs.',
      isIn: Object.keys(sails.config.custom.appConfig || {})
    },
    htmlBody: {
      type: 'string',
      description: 'Le contenu HTML de l\'e-mail (utilisé si "template" n\'est pas fourni).',
      allowNull: true,
    },
    textBody: {
      type: 'string',
      description: 'Le contenu texte brut de l\'e-mail (utilisé si "template" n\'est pas fourni).',
      allowNull: true,
    },
  },

  exits: {
    success: {
      description: 'L\'e-mail a été envoyé avec succès.'
    },
    error: {
      description: 'Une erreur est survenue lors de l\'envoi de l\'e-mail.',
    },
    templateNotFound: {
      description: 'Le template EJS spécifié n\'a pas été trouvé.',
    },
    layoutNotFound: {
      description: 'Le layout EJS spécifié n\'a pas été trouvé.',
    },
    invalidAppSlug: {
      description: 'Le slug d\'application spécifié est introuvable dans la configuration.',
    },
    missingContent: {
      description: 'Aucun contenu (template, htmlBody, ou textBody) n\'a été fourni pour l\'e-mail.',
    }
  },

  fn: async function (inputs, exits) {
    try {
      let emailHtmlContent;
      let emailTextContent = inputs.textBody || inputs.subject;

      // Récupérer la configuration de l'application
      const appConfig = sails.config.custom.appConfig[inputs.appSlug];
      if (!appConfig) {
        return exits.invalidAppSlug({
          message: `Le slug d'application "${inputs.appSlug}" est introuvable dans la configuration.`
        });
      }

      // Vérifier si un template est utilisé ou si htmlBody/textBody sont fournis directement
      if (inputs.template) {
        const emailTemplatesPath = path.join(sails.config.appPath, 'views', 'emails');
        const templatePath = path.join(emailTemplatesPath, 'contents', `${inputs.template}.ejs`);
        const layoutPath = path.join(emailTemplatesPath, 'layouts', `${inputs.layout}.ejs`);

        // Vérifier si le template de contenu existe
        if (!fs.existsSync(templatePath)) {
          return exits.templateNotFound({
            message: `Le template d'e-mail "${inputs.template}.ejs" est introuvable dans ${path.join('views', 'emails', 'contents')}.`
          });
        }

        // Vérifier si le layout existe
        if (!fs.existsSync(layoutPath)) {
          return exits.layoutNotFound({
            message: `Le layout d'e-mail "${inputs.layout}.ejs" est introuvable dans ${path.join('views', 'emails', 'layouts')}.`
          });
        }

        // Determine base URL based on environment
        const envUrl = process.env.NODE_ENV === 'production' ? appConfig.urls.prod : appConfig.urls.dev;

        // Lire les logos depuis le système de fichiers et les préparer en tant que CID attachments
        const logoDeskPath = path.join(sails.config.appPath, 'assets', appConfig.logos.desktop);
        const logoMobPath = path.join(sails.config.appPath, 'assets', appConfig.logos.mobile);

        // Vérifier si les fichiers existent et créer les CID references
        const logoDeskExists = fs.existsSync(logoDeskPath);
        const logoMobExists = fs.existsSync(logoMobPath);

        const combinedTemplateData = {
          ...inputs.templateData,
          logoDesk: logoDeskExists ? 'cid:logo-desk' : null,
          logoMob: logoMobExists ? 'cid:logo-mob' : null,
          appName: appConfig.name,
          baseUrl: envUrl
        };

        // Rendre le corps de l'e-mail
        const emailBodyHtml = await ejs.renderFile(templatePath, combinedTemplateData, { async: true });
        emailHtmlContent = await ejs.renderFile(layoutPath, {
          ...combinedTemplateData,
          bodyContent: emailBodyHtml
        }, { async: true });

        // Si le template est utilisé, généré le contenu texte à partir du sujet
        emailTextContent = inputs.templateData.textFallback || inputs.subject;

      } else if (inputs.htmlBody || inputs.textBody) {
        emailHtmlContent = inputs.htmlBody;
        emailTextContent = inputs.textBody || inputs.htmlBody;
      } else {
        return exits.missingContent({ message: 'Aucun contenu d\'e-mail ou template spécifié.' });
      }

      // Rendre le layout complet avec le corps de l'e-mail
      const transporter = nodemailer.createTransport(sails.config.custom.emailService);

      const mailOptions = {
        from: inputs.from,
        to: inputs.to,
        subject: inputs.subject,
        html: emailHtmlContent,
        text: emailTextContent,
        attachments: []
      };

      // Ajouter les logos en tant que pièces jointes embarquées si ils existent
      if (inputs.template) {
        const appConfig = sails.config.custom.appConfig[inputs.appSlug];
        const logoDeskPath = path.join(sails.config.appPath, 'assets', appConfig.logos.desktop);
        const logoMobPath = path.join(sails.config.appPath, 'assets', appConfig.logos.mobile);

        if (fs.existsSync(logoDeskPath)) {
          mailOptions.attachments.push({
            filename: 'logo-desk.png',
            path: logoDeskPath,
            cid: 'logo-desk'
          });
        }

        if (fs.existsSync(logoMobPath)) {
          mailOptions.attachments.push({
            filename: 'logo-mob.jpg',
            path: logoMobPath,
            cid: 'logo-mob'
          });
        }
      }

      await transporter.sendMail(mailOptions);
      sails.log.info(`Email envoyé à ${inputs.to} avec l'objet: ${inputs.subject}`);
      return exits.success();

    } catch (err) {
      sails.log.error(`Erreur lors de l\'envoi de l'email ${inputs.to} avec l'objet: ${inputs.subject}`, err);
      return exits.error(err);
    }
  }
};
