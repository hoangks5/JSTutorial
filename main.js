//setTimeout(function() {
//    alert('Thong bao')
//},5000)

//setInterval(function() {
//    console.log('Day la log'+Math.random())
//},1000)

var a = 6;
console.log(++a);

function sendPageViewData(n) {
  ga("send", "pageview", n);
}
function sendEventCallingAjax(n) {
  ga("send", "event", "Registration", n, { page: n });
}
function sendUserTimeCallingAjax(n, t) {
  ga("send", {
    hitType: "timing",
    timingCategory: "Registration",
    timingVar: "Process Data",
    timingValue: t,
    page: n,
  });
}
function sendExceptionData(n) {
  alert(n);
  ga("send", "exception", { exDescription: n, exFatal: !1 });
}
function ajaxRequest(n, t, i, r, u, f, e) {
  var o = new Date().getTime();
  $.ajax({
    type: n,
    cache: !1,
    async: e,
    url: t,
    dataType: i,
    success: function (n) {
      r != null && r(n);
    },
    error: function (n) {
      sendExceptionData("Ajax request error: " + t);
      u != null && u(n);
    },
    complete: function (n) {
      var i = new Date().getTime(),
        r = i - o;
      sendUserTimeCallingAjax(t, r);
      sendEventCallingAjax(t);
      f != null && f(n);
    },
  });
}
function showNoty(n, t, i) {
  $n != null && $n.close();
  window.setTimeout(function () {
    $n = noty({
      text: n,
      type: t,
      dismissQueue: !0,
      layout: i,
      theme: "defaultTheme",
    });
  }, 1e3);
}
function CheckConflict() {
  var i = $("input[data-crdid]"),
    r = $("td[data-crdid-registered]"),
    t = [];
  r.each(function () {
    t.push($(this).attr("data-crdid-registered"));
  });
  i.each(function () {
    if ($.inArray($(this).attr("data-crdid"), t) > -1) {
      var n = $(this).parent().parent();
      n.find("input.order").remove();
      n.find("td.over").is(".over")
        ? n.attr(
            "title",
            "Môn học đã đủ số lượng sinh viên đăng ký! và Môn học đã đăng ký lớp môn học khác!"
          )
        : (n.addClass("conflict"),
          n.attr("title", "Môn học đã đăng ký lớp môn học khác!"));
    }
  });
  var u = $(".time-table-1"),
    f = $(".time-table-2"),
    n = [];
  f.each(function () {
    n.push($(this).attr("data-time-table-2"));
  });
  u.each(function () {
    var t = $(this).parent().parent(),
      i = $(this).attr("data-time-table-1");
    $.inArray(i, n) > -1
      ? (t.find("input").remove(),
        t.find("td.over").is(".over")
          ? t.attr(
              "title",
              "Môn học đã đủ số lượng sinh viên đăng ký! và Môn học bị trùng lịch học!"
            )
          : (t.addClass("conflict"),
            t.attr("title", "Môn học bị trùng lịch học!")))
      : $.each(n, function (n, r) {
          var u = i.split(":"),
            f = r.split(":");
          u[0] == f[0] &&
            ((parseInt(u[1]) >= parseInt(f[1]) &&
              parseInt(u[1]) <= parseInt(f[2])) ||
              (parseInt(u[2]) >= parseInt(f[1]) &&
                parseInt(u[2]) <= parseInt(f[2])) ||
              (parseInt(u[1]) <= parseInt(f[1]) &&
                parseInt(u[2]) >= parseInt(f[2])) ||
              (parseInt(u[1]) >= parseInt(f[1]) &&
                parseInt(u[2]) <= parseInt(f[2]))) &&
            (t.find("input").remove(),
            t.find("td.over").is(".over")
              ? t.attr(
                  "title",
                  "Môn học đã đủ số lượng sinh viên đăng ký! và Môn học bị trùng lịch học!"
                )
              : (t.addClass("conflict"),
                t.attr("title", "Môn học bị trùng lịch học!")));
        });
  });
}
function CheckPrerequisite(n) {
  var r = new Date().getTime(),
    i = "",
    t = "/kiem-tra-tien-quyet/" + n + "/" + $registrationMode;
  return (
    $.ajax({
      type: "POST",
      cache: !1,
      async: !1,
      url: t,
      dataType: "json",
      success: function (n) {
        i = n.message;
      },
      complete: function () {
        var n = new Date().getTime(),
          i = n - r;
        sendUserTimeCallingAjax(t, i);
        sendEventCallingAjax(t);
      },
    }),
    i
  );
}
function DSDK(n) {
  $dsdkMod = n;
  var t = "/danh-sach-mon-hoc/" + $registrationMode + "/" + n;
  ajaxRequest(
    "POST",
    t,
    "html",
    successCallback1,
    errorCallback1,
    completeCallback1,
    !0
  );
}
function successCallback1(n) {
  $("#divDSDK table tbody").html(n);
}
function errorCallback1() {
  $(
    '<tr><td colspan="11" style="text-align:left;">Đã xảy ra lỗi khi lấy danh sách môn học. Vui lòng tải lại trang!</td></tr>'
  ).appendTo($("#divDSDK table tbody"));
}
function completeCallback1() {
  $registrationAvailable == "false" && $(".order").remove();
  RegisteredSubject();
}
function RegisteredSubject() {
  var n = "/danh-sach-mon-hoc-da-dang-ky/" + $registrationMode;
  ajaxRequest(
    "POST",
    n,
    "html",
    successCallback2,
    errorCallback2,
    completeCallback2,
    !0
  );
}
function successCallback2(n) {
  $("#registered-container table tbody").html(n);
}
function errorCallback2() {
  $(
    '<tr><td colspan="10" style="text-align:left;">Đã xảy ra lỗi khi lấy danh sách môn học. Vui lòng tải lại trang!</td></tr>'
  ).appendTo($("#registered-container table tbody"));
}
function completeCallback2() {
  $registrationAvailable == "true" &&
    ($(".abort").remove(),
    $(".chk-brc").remove(),
    $n != null && $n.close(),
    showNoty("Ngoài thời hạn đăng ký!", "warning", "center"));
  CheckConflict();
  App.unblockUI();
  $n != null && $n.close();
  $("#hasChange").val() == "true" &&
    showNoty(
      "Bạn đã thay đổi môn học. Các thay đổi này chỉ thực sự được ghi nhận sau khi bạn bấm nút Ghi nhận!",
      "warning",
      "bottom"
    );
  $(".total-credit-container").text($(".total-credit").val());
  $(".total-crd-container").text($(".total-crd").val());
}
function Pending(n) {
  var r = new Date().getTime(),
    i = "",
    t = "/chon-mon-hoc/" + n + "/" + $registrationMode + "/" + $dsdkMod;
  return (
    $.ajax({
      type: "POST",
      cache: !1,
      async: !1,
      url: t,
      dataType: "json",
      success: function (n) {
        i = n.message;
        sendPageViewData(t);
      },
      complete: function () {
        var n = new Date().getTime(),
          i = n - r;
        sendUserTimeCallingAjax(t, i);
        sendEventCallingAjax(t);
      },
    }),
    i
  );
}
function Abort(n) {
  var r = new Date().getTime(),
    i = "",
    t = "/huy-mon-hoc/" + n + "/" + $registrationMode + "/" + $dsdkMod;
  return (
    $.ajax({
      type: "POST",
      cache: !1,
      async: !1,
      url: t,
      dataType: "json",
      success: function (n) {
        i = n.message;
        sendPageViewData(t);
      },
      complete: function () {
        var n = new Date().getTime(),
          i = n - r;
        sendUserTimeCallingAjax(t, i);
        sendEventCallingAjax(t);
      },
    }),
    i
  );
}
var $dsdkMod = 1;
App.blockUI();
$(document).ready(function () {
  function n(n) {
    alert(n.message);
    $n && $n.close();
    DSDK($(".sel-dsdk-mod").select2("val"));
  }
  $(".sel-dsdk-mod").select2({ minimumResultsForSearch: -1 });
  DSDK($(".sel-dsdk-mod").select2("val"));
  $(document).on("click", ".order", function () {
    var n;
    if ((App.blockUI(), (n = ""), $(this).is(":checked"))) {
      var i = $(this).attr("data-crdid"),
        r = $(this).attr("data-rowindex"),
        t = $(".StdRegMax-container").text() * 1,
        u = $(".total-crd-container").text() * 1,
        f = $(this).attr("data-numcrd") * 1;
      if (
        ((n =
          t < u + f
            ? "Bạn đã chọn quá số tín chỉ được phép đăng ký!\nSố tín chỉ tối đa được phép đăng ký là: " +
              t
            : CheckPrerequisite(i)),
        n == "")
      )
        if (((n = Pending(r)), n == ""))
          DSDK($(".sel-dsdk-mod").select2("val"));
        else {
          $(this).prop("checked", !1);
          alert(n);
          App.unblockUI();
          return;
        }
      else {
        $(this).prop("checked", !1);
        alert(n);
        App.unblockUI();
        return;
      }
    }
  });
  $(document).on("click", ".abort", function () {
    if (
      confirm(
        "Bạn có chắc chắn hủy đăng ký không?\nThao tác chỉ thành công sau khi bạn nhấn nút Ghi nhận!"
      )
    ) {
      App.blockUI();
      var n = "",
        t = $(this).attr("data-rowindex");
      if (((n = Abort(t)), n == "")) DSDK($(".sel-dsdk-mod").select2("val"));
      else {
        alert(n);
        App.unblockUI();
        return;
      }
    }
  });
  $(document).on("click", ".confirm-registration", function () {
    App.blockUI();
    var t = "/xac-nhan-dang-ky/" + $registrationMode;
    ajaxRequest("POST", t, "json", n, null, null, !0);
    return;
  });
  $(window).on("beforeunload", function () {
    if ($("#hasChange").val() == "true")
      return 'Cảnh báo: Bạn chưa Ghi nhận thay đổi đăng ký môn học!\nBấm "Stay on Page" sau đó bấm Ghi nhận;\nBấm "Leave Page" để bỏ qua!';
  });
  $(document).on("click", ".chk-brc", function () {
    App.blockUI();
    var t = $(this).is(":checked"),
      i,
      r = $(this).attr("data-rowindex"),
      u = $(this).attr("data-brc"),
      n =
        "/dang-ky-lay-diem-theo-nganh/" +
        r +
        "/" +
        u +
        "/" +
        t +
        "/" +
        $registrationMode,
      f = new Date().getTime();
    $.ajax({
      type: "POST",
      cache: !1,
      async: !1,
      url: n,
      dataType: "json",
      success: function (t) {
        i = t.success;
        sendPageViewData(n);
      },
      complete: function () {
        var t = new Date().getTime(),
          i = t - f;
        sendUserTimeCallingAjax(n, i);
        sendEventCallingAjax(n);
      },
    });
    i
      ? ($n != null && $n.close(),
        showNoty(
          "Bạn đã thay đổi môn học. Các thay đổi này chỉ thực sự được ghi nhận sau khi bạn bấm nút Ghi nhận!",
          "warning",
          "bottom"
        ))
      : $(this).prop("checked", !t);
    App.unblockUI();
  });
  $(".sel-dsdk-mod").change(function () {
    App.blockUI();
    DSDK($(this).val());
  });
});
