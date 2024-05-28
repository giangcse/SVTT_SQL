var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

var bangdsyeucau;

// Clear modal
function clear_modal() {
  $("#modal_title").empty();
  $("#modal_body").empty();
  $("#modal_footer").empty();
}

bangdsyeucau = $("#bangdsyeucau").DataTable({
  paging: true,
  lengthChange: false,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    type: "GET",
    url: "get_all_yeu_cau_in_phieu",
    dataSrc: "data",
  },
  columns: [
    {
      data: null,
      render: function (data, type, row, meta) {
        // Use meta.row to get the current row index, and add 1 to start from 1
        return "<center>" + (meta.row + 1) + "</center>";
      },
    },
    {
      data: null,
      render: function (data, type, row) {
        // Combine loaiyeucau and ngaygui
        return row.hotensv + "<br><small><i>" + row.emailsv + "</i></small>";
      },
    },
    { data: "loaiyeucau" },
    { data: "ngaygui" },
    { data: "ngayxuly" },
    {
      data: "trangthai",
      render: function (data, type, row) {
        if (data == 0) {
          return '<center><span class="badge badge-warning"><i class="fa-solid fa-clock"></i>&nbsp; Chờ phê duyệt</span></center>';
        } else if (data == 1) {
          return '<center><span class="badge badge-success"><i class="fa-solid fa-check"></i>&nbsp; Đã phê duyệt</span></center>';
        } else {
          return '<center><span class="badge badge-danger"><i class="fa-solid fa-xmark"></i>&nbsp; Bị từ chối</span></center>';
        }

      },
    },
    {
      data: "id",
      render: function (data, type, row) {
        if(row.trangthai==0){
          return (
            `<center>
              <a class="btn btn-success btn-sm" id="checkBtn" data-id="${data}"><i class="fas fa-check"></i></a>
              <a class="btn btn-warning btn-sm" id="rejectBtn" data-id="${data}"><i class="fas fa-close"></i></a>
            </center>`
          );
        } else if(row.trangthai==1){
          return (
            `<center>
              <a class="btn btn-warning btn-sm" id="rejectBtn" data-id="${data}"><i class="fas fa-close"></i></a> 
              <a class="btn btn-danger btn-sm" id="deleteBtn" data-id="${data}"><i class="fas fa-trash"></i></a>  
            </center>`
          );
        } else {
          return (
            `<center> 
              <a class="btn btn-success btn-sm" id="checkBtn" data-id="${data}"><i class="fas fa-check"></i></a>
              <a class="btn btn-danger btn-sm" id="deleteBtn" data-id="${data}"><i class="fas fa-trash"></i></a>
            </center>`
          );
        }
      },
    },
  ],
});

// Xoá yêu cầu
$("#bangdsyeucau").on("click", "#deleteBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: "Bạn chắc chắn muốn xoá yêu cầu này?" ,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "/update_xoa_yeu_cau_in_phieu_by_id?id=" + parseInt(id),
        success: function (res) {
          if(res.status=='OK'){
            Toast.fire({
              icon: "success",
              title: "Đã xoá 1 yêu cầu",
            });
            // Tải lại bảng bangdsyeucau
            bangdsyeucau.ajax.reload();
          }else{
            Toast.fire({
              icon: "warning",
              title: "Xóa yêu cầu không thành công"
            });
          }
        },
        error: function (xhr, status, error) {
          Toast.fire({
            icon: "error",
            title: "Lỗi! Xoá không thành công",
          });
        },
      });
    }
  });
});

// Phê duyệt yêu cầu
$("#bangdsyeucau").on("click", "#checkBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: "Phê duyệt yêu cầu này?" ,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "/update_yeu_cau_in_phieu?id=" + parseInt(id) + "&trangthai=1",
        success: function (res) {
          if(res.status=='OK'){
            Toast.fire({
              icon: "success",
              title: "Đã duyệt 1 yêu cầu",
            });
            // Tải lại bảng bangdsyeucau
            bangdsyeucau.ajax.reload();
          }else{
            Toast.fire({
              icon: "warning",
              title: "Duyệt yêu cầu không thành công"
            });
          }
        },
        error: function (xhr, status, error) {
          Toast.fire({
            icon: "error",
            title: "Lỗi! Duyệt không thành công",
          });
        },
      });
    }
  });
});

// Từ chối yêu cầu
$("#bangdsyeucau").on("click", "#rejectBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: "Từ chối yêu cầu này?" ,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "/update_yeu_cau_in_phieu?id=" + parseInt(id) + "&trangthai=-1",
        success: function (res) {
          if(res.status=='OK'){
            Toast.fire({
              icon: "success",
              title: "Đã từ chối 1 yêu cầu",
            });
            // Tải lại bảng bangdsyeucau
            bangdsyeucau.ajax.reload();
          }else{
            Toast.fire({
              icon: "warning",
              title: "Từ chối yêu cầu không thành công"
            });
          }
        },
        error: function (xhr, status, error) {
          Toast.fire({
            icon: "error",
            title: "Lỗi! Từ chối không thành công",
          });
        },
      });
    }
  });
});