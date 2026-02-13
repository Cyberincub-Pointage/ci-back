const path = require('path');
const ejs = require('ejs');
const { Resend } = require('resend');
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
      const resend = new Resend(sails.config.custom.resendApiKey);

      let emailHtmlContent;
      let emailTextContent = inputs.textBody || inputs.subject;

      // Récupérer la configuration de l'application
      const appConfig = sails.config.custom.appConfig[inputs.appSlug];
      if (!appConfig) return exits.invalidAppSlug();

      if (inputs.template) {
        const basePath = path.join(sails.config.appPath, 'views', 'emails');
        const templatePath = path.join(basePath, 'contents', `${inputs.template}.ejs`);
        const layoutPath = path.join(basePath, 'layouts', `${inputs.layout}.ejs`);

        if (!fs.existsSync(templatePath)) return exits.templateNotFound();
        if (!fs.existsSync(layoutPath)) return exits.layoutNotFound();

        const envUrl = process.env.NODE_ENV === 'production'
          ? appConfig.urls.prod
          : appConfig.urls.dev;

        // Lire les logos depuis le système de fichiers et les préparer en tant que CID attachments
        const logoDeskPath = path.join(sails.config.appPath, 'assets', appConfig.logos.desktop);
        const logoMobPath = path.join(sails.config.appPath, 'assets', appConfig.logos.mobile);

        const combinedTemplateData = {
          ...inputs.templateData,
          logoDesk: fs.existsSync(logoDeskPath) ? 'cid:logo-desk' : null,
          logoMob: fs.existsSync(logoMobPath) ? 'cid:logo-mob' : null,
          appName: appConfig.name,
          baseUrl: envUrl
        };

        const bodyHtml = await ejs.renderFile(templatePath, combinedTemplateData, { async: true });

        emailHtmlContent = await ejs.renderFile(layoutPath, {
          ...combinedTemplateData,
          bodyContent: bodyHtml
        }, { async: true });

        // Si le template est utilisé, généré le contenu texte à partir du sujet
        emailTextContent = inputs.templateData.textFallback || inputs.subject;

      } else if (inputs.htmlBody || inputs.textBody) {
        emailHtmlContent = inputs.htmlBody;
        emailTextContent = inputs.textBody || inputs.htmlBody;
      } else {
        return exits.missingContent();
      }

      // Envoi de l'e-mail via Resend
      const attachments = [];

      // Ajouter les logos en tant que pièces jointes embarquées si ils existent
      if (inputs.template) {
        const logoDeskPath = path.join(sails.config.appPath, 'assets', appConfig.logos.desktop);
        const logoMobPath = path.join(sails.config.appPath, 'assets', appConfig.logos.mobile);

        if (fs.existsSync(logoDeskPath)) {
          attachments.push({
            filename: 'logo-desk.png',
            content: fs.readFileSync(logoDeskPath),
          });
        }

        if (fs.existsSync(logoMobPath)) {
          attachments.push({
            filename: 'logo-mob.png',
            content: fs.readFileSync(logoMobPath),
          });
        }
      }

      await resend.emails.send({
        from: inputs.from,
        to: inputs.to,
        subject: inputs.subject,
        html: emailHtmlContent,
        text: emailTextContent,
        attachments: attachments.length > 0 ? attachments : undefined
      });

      sails.log.info(`Email envoyé à ${inputs.to} : ${inputs.subject}`);
      return exits.success();

    } catch (err) {
      sails.log.error('Erreur envoi email:', err);
      return exits.error(err);
    }
  }
};
