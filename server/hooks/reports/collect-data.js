Reports.after.insert(function(userId, doc) {
  console.log(userId);
  _.each(doc.selectedReports, function(item) {
    Meteor.call('collectReportData', doc._id, item);
  });
})
