Router.route('/admin/status', {
  name: 'admin.status',
  layoutTemplate: 'orionMaterializeLayout'
});

if (Meteor.isClient) {
  orion.links.add({
    index: 1,
    identifier: 'status',
    title: 'Status',
    routeName: 'admin.status',
    activeRouteRegex: 'admin.status',
  });

  orion.accounts.addProtectedRoute('admin.status');
}

Router.route('/admin/targets/:_id/data', {
  name: 'admin.targets.data',
  layoutTemplate: 'orionMaterializeLayout'
})
