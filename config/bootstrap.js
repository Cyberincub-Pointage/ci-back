module.exports.bootstrap = async function () {
  const { ulid } = require('ulid');

  // Set global appUrl based on environment
  sails.config.custom.appUrl = sails.config.environment === 'production'
    ? sails.config.custom.appConfig.ci.urls.prod
    : sails.config.custom.appConfig.ci.urls.dev;

  // Create default admin if not exists
  const existingAdmin = await Admin.count({ email: sails.config.custom.admin.email });

  if (existingAdmin === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(sails.config.custom.admin.password, 10);

    await Admin.create({
      id: ulid(),
      email: sails.config.custom.admin.email,
      password: hashedPassword,
      nom: sails.config.custom.admin.nom,
      prenom: sails.config.custom.admin.prenom,
      role: 'super_admin',
      status: 'active'
    });

    sails.log.info('Default admin created.');
  }

  // Create default permission email if not exists
  const existingEmail = await PermissionEmail.count();

  if (existingEmail === 0) {
    await PermissionEmail.create({
      id: ulid(),
      value: sails.config.custom.permissionEmail
    });
    sails.log.info('Default permission email created.');
  }


  // -------------------------------------------------------------------------
  // SEED TEAMS
  // -------------------------------------------------------------------------
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
    ].map(team => ({ ...team, id: ulid() }));

    await Equipe.createEach(teamsData);
    sails.log.info(`Seeded ${teamsData.length} teams.`);
  }

  // -------------------------------------------------------------------------
  // SEED PROJECTS
  // -------------------------------------------------------------------------
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
          id: ulid(),
          nom: projDef.nom,
          description: projDef.description,
          equipe: equipe.id
        });
      } else {
        sails.log.warn(`Cannot seed project ${projDef.nom}: Team ${projDef.equipeNom} not found.`);
      }
    }
    sails.log.info(`Seeded ${projectsDefinition.length} projects.`);
  }

  // -------------------------------------------------------------------------
  // SEED BANKS
  // -------------------------------------------------------------------------
  const existingBanques = await Banque.count();
  if (existingBanques === 0) {
    const banksData = [
      { nom: 'ECOBANK', code: 'ECO' },
      { nom: 'UNITED BANK OF AFRICA', code: 'UBA' },
      { nom: 'BANK FOR AFRICA', code: 'BOA' }
    ].map(bank => ({ ...bank, id: ulid() }));

    await Banque.createEach(banksData);
    sails.log.info(`Seeded ${banksData.length} banks.`);
  }
};
