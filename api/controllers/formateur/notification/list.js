module.exports = {
  friendlyName: 'Lister les notifications',
  description: 'Lister les notifications pour le formateur connecté.',

  inputs: {
    page: {
      type: 'number',
      defaultsTo: 1
    },
    limit: {
      type: 'number',
      defaultsTo: 20
    },
    startDate: {
      type: 'string',
      columnType: 'date'
    },
    endDate: {
      type: 'string',
      columnType: 'date'
    },
    status: {
      type: 'string',
      isIn: ['unread', 'read']
    }
  },

  exits: {
    success: {
      statusCode: 200
    },
  },

  fn: async function ({ page, limit, startDate, endDate, status }) {
    const query = {
      formateur: this.req.me.id
    };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt['>='] = new Date(startDate).getTime();
      }
      if (endDate) {
        query.createdAt['<='] = new Date(endDate).getTime();
      }
    }

    const total = await Notification.count(query);
    const notifications = await Notification.find(query)
      .sort('createdAt DESC')
      .paginate(page - 1, limit);

    return {
      notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
};
