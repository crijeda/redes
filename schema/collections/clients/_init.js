/**
 * Clients collection
 * @type {Mongo.Collection}
 */
Clients = new orion.collection('clients', {
  singularName: 'cliente',
  pluralName: 'clientes',
  title: 'Clientes',
  link: {
    title: 'Clientes'
  },
  tabular: {
    columns: [
      orion.attributeColumn('hasOne', 'mainTargetId', 'Cliente'),
      { data: 'slug', title: 'ID' }
    ]
  }
});
