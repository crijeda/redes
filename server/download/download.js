Router.route('/download-data/:targetId/:data/:fromDate/:toDate', function() {
  check([this.params.targetId, this.params.data, this.params.fromDate, this.params.toDate], [String]);
  var target = Targets.findOne(this.params.targetId);
  var fromDate = moment.unix(this.params.fromDate);
  var toDate = moment.unix(this.params.toDate);
  var dateFilter = { $gte: fromDate.toDate(), $lte: toDate.toDate() };
  var csv = '';
  var title = '';

  if (this.params.data == 'tw-tweets') {
    var data = DataTwitterTweets.find({ created_at: dateFilter, targetId: target._id }).fetch();
    var fields = [
      { key: 'id_str', title: 'ID' },
      { key: 'text', title: 'Contenido' },
      { key: 'created_at', title: 'Fecha' },
      { key: 'user.id_str', title: 'User ID' },
      { key: 'user.name', title: 'User Name' },
      { key: 'user.screen_name', title: 'User Screen Name' },
      { key: 'user.followers_count', title: 'Seguidores' }
    ];
    title = target.name + ' - Tweets';
    csv = exportToCSV(title, fields, data);
  }
  if (this.params.data == 'fb-likes') {
    var data = DataFBLikes.find({ date: dateFilter, targetId: target._id }).fetch();
    var fields = [
      { key: 'date', title: 'Fecha' },
      { key: 'likes', title: 'Likes' }
    ];
    title = target.name + ' - Historial de likes';
    csv = exportToCSV(title, fields, data);
  }
  if (this.params.data == 'fb-posts') {
    var data = DataFBPosts.find({ created_time: dateFilter, targetId: target._id }).fetch();
    var fields = [
      { key: 'id', title: 'ID' },
      { key: 'from.id', title: 'User ID' },
      { key: 'message', title: 'Mensaje' },
      { key: 'picture', title: 'Imagen' },
      { key: 'type', title: 'Tipo' },
      { key: 'status_type', title: 'Tipo de status' },
      { key: 'created_time', title: 'Fecha' },
      {
        key: 'id',
        title: 'Likes',
        transform: function(id) {
          return DataFBPostLikes.find({ targetId: target._id, postId: id }).count()
        }
      },
      {
        key: 'object_id',
        title: 'Comentarios',
        transform: function(id) {
          var regex = new RegExp('^' + id + '_.*$', 'm');
          return DataFBPostComments.find({ targetId: target._id, id: { $regex: regex } }).count()
        }
      }
    ];
    title = target.name + ' - Historial de likes'
    csv = exportToCSV(title, fields, data);
  }
  if (this.params.data == 'fb-posts-likes') {
    var data = DataFBPostLikes.find({ date: dateFilter, targetId: target._id }).fetch();
    var fields = [
      { key: 'postId', title: 'Post ID' },
      { key: 'userId', title: 'User ID' },
      { key: 'date', title: 'Fecha' }
    ];
    title = target.name + ' - Posts likes'
    csv = exportToCSV(title, fields, data);
  }
  if (this.params.data == 'fb-posts-comments') {
    var data = DataFBPostComments.find({ created_time: dateFilter, targetId: target._id }).fetch();
    var fields = [
      { key: 'id', title: 'Comment ID' },
      { key: 'id', title: 'Post ID', transform: function(val) { return val.split('_')[0] } },
      { key: 'from.id', title: 'User ID' },
      { key: 'like_count', title: 'Likes' },
      { key: 'created_time', title: 'Fecha' },
      { key: 'message', title: 'Mensaje' }
    ];
    title = target.name + ' - Posts likes'
    csv = exportToCSV(title, fields, data);
  }

  var headers = {
    'Content-type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename=' + title + '.csv'
  };
  console.log(this);
  this.response.writeHead(200, headers);
  this.response.end(csv);
}, { where: 'server' });
