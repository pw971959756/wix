$(document).ready(function () {
  var table = $("#example").DataTable({
    bLengthChange:false,
    iDisplayLength:15,
    "dom": "<'pull-left'f><'pull-right'l>tip",
    "columns": [
      {"data": "wixTitle"},
      {"data": "wixAuthor"},
      {"data": "wixTypesetting"},
      {"data": "wixPublishing"},
      {"data": "wixLink"},
      {"data": "wixReleaseDate"},
      {"data": "wixSummary"}
    ],
  });
  //对行双击添加监听事件
  $("#example tbody").on("dblclick", "tr", function () {
    var row = JSON.parse($(this).attr("data").replace(/\'/g,"\""));
    $("#wixTitle").html(row.wixTitle ? row.wixTitle: "");
    $("#wixAuthor").html(row.wixAuthor ? row.wixAuthor: "");
    $("#wixTypesetting").html(row.wixTypesetting ? row.wixTypesetting: "");
    $("#wixPublishing").html(row.wixPublishing ? row.wixPublishing: "");
    $("#wixLink").html(row.wixLink ? row.wixLink: "");
    $("#wixReleaseDate").html(row.wixReleaseDate ? row.wixReleaseDate: "");
    $("#wixSummary").html(row.wixSummary ? row.wixSummary: "");
    $("#wixContent").html(row.wixContent ? row.wixContent: "");
    layer.open({type: 1, title: "Data details", shadeClose: true, skin: "layui-layer-rim", area: ["800px", "600px"], content: $("#dialog").html()});
  });
});
