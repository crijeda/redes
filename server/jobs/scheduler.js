Meteor.methods({
  scheduleJob: function() {
    var slave = Slaves.findAndModify({
      query: { nextRun: { $lt: new Date() }, isRunning: false },
      update: { $set: { isRunning: true, startedAt: new Date() } },
      sort: { nextRun: 1 },
      new: true
    });

    if (!slave) {
      Meteor._sleepForMs(1000);
      return;
    };

    try {
      var nextRun = Jobs[slave.type](slave);
      if (nextRun) {
        Slaves.update(slave._id, { $set: { nextRun: nextRun, lastRun: new Date(), isRunning: false }, $unset: { startedAt: '' } });
      } else {
        Slaves.remove(slave._id);
      }
    } catch (e) {
      Slaves.update(slave._id, { $set: { nextRun: new Date(), isRunning: false }, $unset: { startedAt: '' }});
      Meteor._sleepForMs(5000);
      throw e;
    }
  },
  refreshSlaves: function() {
    console.log('Setting slaves state to unactive');
    Slaves.update({ isRunning: true }, { $set: { isRunning: false }, $unset: { startedAt: '' } });
  }
});

Meteor.startup(function () {
  Meteor.call('refreshSlaves');
  Meteor.defer(function() {
    while (Jobs.running) {
      try {
        Meteor.call('scheduleJob');
      } catch(e) {
        console.log('Error running job: ', e);
      }
      Meteor._sleepForMs(100 + _.random(300));
    }
  })
});
