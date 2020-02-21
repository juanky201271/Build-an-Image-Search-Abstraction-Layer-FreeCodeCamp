$(function() {
  $('#formTextSearch').submit(function(e) {
    $.ajax({
      url: '/api/imagesearch/' + $('#textSearch').val() + '?offset=' + $('#textSearchOffset').val(),
      type: 'post',
      data: $('#formTextSearch').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#formSearchs').submit(function(e) {
    $.ajax({
      url: '/api/latest/imagesearch?offset=' + $('#searchsOffset').val(),
      type: 'post',
      data: $('#formSearchs').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#formSearchID').submit(function(e) {
    $.ajax({
      url: '/api/latest/imagesearch/' + $('#ID').val(),
      type: 'post',
      data: $('#formSearchID').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
});
