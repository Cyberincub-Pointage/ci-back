module.exports.bootstrap = async function () {

  // Définir l'URL globale de l'application en fonction de l'environnement
  sails.config.custom.appUrl = sails.config.environment === 'production'
    ? sails.config.custom.appConfig.ci.urls.prod
    : sails.config.custom.appConfig.ci.urls.dev;

  // Créer un administrateur par défaut s'il n'existe pas
  const existingAdmin = await Admin.count({ email: sails.config.custom.admin.email });

  if (existingAdmin === 0) {
    // Note: Le hashage est géré par le lifecycle beforeCreate du modèle Admin
    await Admin.create({
      email: sails.config.custom.admin.email,
      password: sails.config.custom.admin.password,
      nom: sails.config.custom.admin.nom,
      prenom: sails.config.custom.admin.prenom,
      role: 'super_admin',
      status: 'active'
    });

    sails.log.info('Administrateur par défaut créé.');
  }

  // Créer l'email de permission par défaut s'il n'existe pas
  const existingEmail = await PermissionEmail.count();

  if (existingEmail === 0) {
    await PermissionEmail.create({
      value: sails.config.custom.permissionEmail
    });
    sails.log.info('Email de permission par défaut créé.');
  }


  // INITIALISATION DES ÉQUIPES
  const existingEquipes = await Equipe.count();
  if (existingEquipes === 0) {
    const teamsData = [
      { nom: 'Team CES', description: 'Plateforme pour l\'authentification des documents numériques.' },
      { nom: 'VerifIA by Yanju', description: 'Plateforme d\'intelligence artificielle permettant la prévention d\'arnaques en ligne et la protection des utilisateurs vulnérables.' },
      { nom: 'DEFENTIX', description: 'Parefeu -applicatif intelligent.' },
      { nom: 'Cyber+', description: 'Plateforme pour de detections des menaces et d\'evaluation de la surface d\'attaque (sites de phishing, typosquatting, fuites de données, code compromis, brandjacking, etc.).' },
      { nom: 'TRUST CYBER', description: 'Plateforme d\'assistance à l\'audit de conformité à la PSSIE.' },
      { nom: 'Mak & Sec', description: 'Application permettant la protection des citoyens contre les arnaques (SMS frauduleux, mail d\'hammeçonage).' },
      { nom: 'OKIKI', description: 'Plateforme de détection des attaques de phishing.' },
      { nom: 'Liia', description: 'Plateforme permettant l\'analyse des fichiers journaux afin de permettre la détection des attaques.' },
      { nom: 'BJ SEC', description: 'Solution IDS accessible pour les PME.' },
      { nom: 'SAUDITERCOM', description: 'Plateforme permettant l\'auto-évaluation de la posture de sécurité d\'une entreprise.' }
    ];

    await Equipe.createEach(teamsData);
    sails.log.info(`${teamsData.length} équipes initialisées.`);
  }

  // INITIALISATION DES PROJETS
  const existingProjets = await Projet.count();
  if (existingProjets === 0) {
    const projectsDefinition = [
      {
        nom: 'CYPASS',
        equipeNom: 'Team CES',
        description: 'Plateforme pour l\'authentification des documents numériques.'
      },
      {
        nom: 'VerifiA',
        equipeNom: 'VerifIA by Yanju',
        description: 'Plateforme d\'intelligence artificielle permettant la prévention d\'arnaques en ligne et la protection des utilisateurs vulnérables.'
      },
      {
        nom: 'DEFENTIX',
        equipeNom: 'DEFENTIX',
        description: 'Parefeu -applicatif intelligent.'
      },
      {
        nom: 'Intelligency 360',
        equipeNom: 'Cyber+',
        description: 'Plateforme pour de detections des menaces et d\'evaluation de la surface d\'attaque (sites de phishing, typosquatting, fuites de données, code compromis, brandjacking, etc.).'
      },
      {
        nom: 'Système GNONVI',
        equipeNom: 'TRUST CYBER',
        description: 'Plateforme d\'assistance à l\'audit de conformité à la PSSIE.'
      },
      {
        nom: 'Sentra Bénin',
        equipeNom: 'Mak & Sec',
        description: 'Application permettant la protection des citoyens contre les arnaques (SMS frauduleux, mail d\'hammeçonage).'
      },
      {
        nom: 'GovPhish Defender',
        equipeNom: 'OKIKI',
        description: 'Plateforme de détection des attaques de phishing.'
      },
      {
        nom: 'Liaa websecurity',
        equipeNom: 'Liia',
        description: 'Plateforme permettant l\'analyse des fichiers journaux afin de permettre la détection des attaques.'
      },
      {
        nom: 'Hèviosso IA',
        equipeNom: 'BJ SEC',
        description: 'Solution IDS accessible pour les PME.'
      },
      {
        nom: 'SAUDITER.BJ',
        equipeNom: 'SAUDITERCOM',
        description: 'Plateforme permettant l\'auto-évaluation de la posture de sécurité d\'une entreprise.'
      }
    ];

    for (const projDef of projectsDefinition) {
      const equipe = await Equipe.findOne({ nom: projDef.equipeNom });
      if (equipe) {
        await Projet.create({
          nom: projDef.nom,
          description: projDef.description,
          equipe: equipe.id
        });
      } else {
        sails.log.warn(`Impossible d'initialiser le projet ${projDef.nom} : L'équipe ${projDef.equipeNom} est introuvable.`);
      }
    }
    sails.log.info(`${projectsDefinition.length} projets initialisés.`);
  }

  // INITIALISATION DES BANQUES
  const existingBanques = await Banque.count();
  if (existingBanques === 0) {
    const banksData = [
      { nom: 'ECOBANK', code: 'ECO' },
      { nom: 'UNITED BANK OF AFRICA', code: 'UBA' },
      { nom: 'BANK FOR AFRICA', code: 'BOA' }
    ];

    await Banque.createEach(banksData);
    sails.log.info(`${banksData.length} banques initialisées.`);
  }
};
