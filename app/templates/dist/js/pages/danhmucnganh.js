var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

let bangdscacnganh = $("#bangdscacnganh").DataTable({
  paging: true,
  lengthChange: false,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    type: "GET",
    url: "get_danh_sach_nganh",
    dataSrc: "",
  },
  columns: [
    {
      data: null,
      render: function (data, type, row, meta) {
        // Use meta.row to get the current row index, and add 1 to start from 1
        return "<center>" + (meta.row + 1) + "</center>";
      },
    },
    { data: "ten" },
    { data: "kyhieu" },
    {
      data: "isDeleted",
      render: function (data, type, row) {
        if (data == 1) {
          return '<center><span class="badge badge-danger"><i class="fa-solid fa-x"></i>Đã xóa</span></center>';
        } else {
          return '<center><span class="badge badge-success"><i class="fa-solid fa-check"></i>Đang hoạt động</span></center>';
        }
      },
    },
  ],
});

// Clear modal
function clear_modal() {
  $("#modal_title").empty();
  $("#modal_body").empty();
  $("#modal_footer").empty();
}

// Xoá người dùng
$("#bangdscacnganh").on("click", "#deleteBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: `Xác nhận xoá danh mục ngành`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_xoa_nganh_by_id?id=${id}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Xoá ngành thành công.`,
            });
            bangdscacnganh.ajax.reload();
          } else if (res.status == "EXISTS") {
            Toast.fire({
              icon: "warning",
              title:
                "Người dùng đang hướng dẫn nhóm. Vui lòng chọn Ngừng sử dụng.",
            });
          }
        },
        error: function () {
          Toast.fire({
            icon: "error",
            title: `Xoá người dùng thất bại.`,
          });
        },
      });
    }
  });
});

// Active người dùng
$("#bangdstaikhoan").on("click", "#activeBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: `Xác nhận kích hoạt người dùng`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Kích hoạt",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_active_nguoi_huong_dan_by_id?id=${id}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Đã kích hoạt người dùng.`,
            });
            bangdstaikhoan.ajax.reload();
          } else if (res.status == "NOT_BANNED") {
            Toast.fire({
              icon: "warning",
              title: "Người dùng đang hoạt động.",
            });
          }
        },
        error: function () {
          Toast.fire({
            icon: "error",
            title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
          });
        },
      });
    }
  });
});

// Cập nhật thông tin người dùng
$("#bangdstaikhoan").on("click", "#editBtn", function () {
  let id = $(this).data("id");

  clear_modal();

  $("#modal_title").text(`Chỉnh sửa thông tin người dùng`);
  $("#modal_body").html(`
      <div class="form-group">
        <label for="modal_hoten_input">Họ tên</label>
        <input type="text" class="form-control" id="modal_hoten_input" required />
      </div>
      <div class="form-group">
        <label for="modal_email_input">Email</label>
        <input type="email" class="form-control" id="modal_email_input" required />
      </div>
      <div class="form-group">
        <label for="modal_sdt_input">Số điện thoại</label>
        <input type="number" class="form-control" id="modal_sdt_input" required />
      </div>
      <div class="form-group">
        <label for="modal_chucdanh_select">Chức danh</label>
        <select id="modal_chucdanh_select" class="form-control">
          <option value="Nhân viên">Nhân viên</option>
          <option value="Phó phòng">Phó phòng</option>
          <option value="Trưởng phòng">Trưởng phòng</option>
        </select>
      </div>
      <div class="form-group">
        <label for="modal_phong_select">Phòng</label>
        <select id="modal_phong_select" class="form-control">
          <option value="Phòng GP CNTT 1">Phòng GP CNTT 1</option>
          <option value="Phòng GP CNTT 2">Phòng GP CNTT 2</option>
          <option value="Phòng KD">Phòng KD</option>
        </select>
      </div>
      <div class="form-group">
        <label for="modal_zalo_input">Zalo</label>
        <input type="text" class="form-control" id="modal_zalo_input" />
      </div>
      <div class="form-group">
        <label for="modal_facebook_input">Facebook</label>
        <input type="text" class="form-control" id="modal_facebook_input" />
      </div>
      <div class="form-group">
        <label for="modal_github_input">Github</label>
        <input type="text" class="form-control" id="modal_github_input" />
      </div>
      <div class="form-group">
        <label for="modal_avatar_input">Avatar</label>
        <input type="text" class="form-control" id="modal_avatar_input" />
      </div>
    `);
  $("#modal_footer").append(
    `<button type="button" class="btn btn-primary" data-id="${id}" id="modal_submit_btn">
        <i class="fa-solid fa-floppy-disk"></i> 
        Lưu thay đổi
      </button>`
  );

  $("#modal_id").modal("show");

  let hoten = $("#modal_hoten_input");
  let email = $("#modal_email_input");
  let sdt = $("#modal_sdt_input");
  let chucdanh = $("#modal_chucdanh_select");
  let phong = $("#modal_phong_select");
  let zalo = $("#modal_zalo_input");
  let facebook = $("#modal_facebook_input");
  let github = $("#modal_github_input");
  let avatar = $("#modal_avatar_input");

  $("#modal_submit_btn").on("click", function () {
    $.ajax({
      type: `POST`,
      url: `update_chi_tiet_tai_khoan_by_id?id=${id}&hoten=${hoten.val()}&email=${email.val()}&sdt=${sdt.val()}&chucdanh=${chucdanh.val()}&phong=${phong.val()}&zalo=${zalo.val()}&facebook=${facebook.val()}&github=${github.val()}&avatar=${avatar.val()}`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã cập nhật thông tin.`,
          });
          $("#modal_id").modal("hide");
          bangdstaikhoan.ajax.reload();
        }
      },
      error: function () {
        Toast.fire({
          icon: "error",
          title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
        });
      },
    });
  });
});

// Tạo thông tin người dùng
$("#taodanhmucnganhBtn").on("click", function () {
  clear_modal();

  $("#modal_title").text(`Tạo ngành mới`);
  $("#modal_body").html(`
      <div class="form-group">
        <label for="modal_tenganh_input">Tên ngành</label>
        <input type="text" class="form-control" id="modal_tennganh_input" required />
      </div>
      <div class="form-group">
        <label for="modal_kyhieu_input">Ký hiệu</label>
        <input type="text" class="form-control" id="modal_kyhieu_input" required />
      </div>
      <div class="form-group">
        <label for="modal_chontruong_select">Chọn trường</label>
        <select id="modal_chontruong_select" class="form-control">
          <option value="ĐH Cần Thơ">ĐH Cần Thơ</option>
          <option value="Đại học Sư phạm Kỹ thuật Vĩnh Long">Đại học Sư phạm Kỹ thuật Vĩnh Long</option>
          <option value="Đại học Xây dựng Miền Tây">Đại học Xây dựng Miền Tây</option>
          <option value="Đại học Cửu Long">Đại học Cửu Long</option>
          <option value="Đại học Nam Cần Thơ">Đại học Nam Cần Thơ</option>
        </select>
      </div>
    `);
  $("#modal_footer").append(
    `<button type="button" class="btn btn-primary" id="modal_submit_nganh_btn">
        <i class="fa-solid fa-floppy-disk"></i> 
        Lưu
      </button>`
  );

  $("#modal_id").modal("show");

  let tennganh = $("#modal_tennganh_input");
  let kyhieu = $("#modal_kyhieu_input");

  $("#modal_submit_nganh_btn").on("click", function () {
    $.ajax({
      type: `POST`,
      url: `them_nganh?ten=${tennganh.val()}&kyhieu=${kyhieu.val()}`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã thêm ngành mới.`,
          });
          $("#modal_id").modal("hide");
          bangdscacnganh.ajax.reload();
        } else {
          Toast.fire({
            icon: "error",
            title: `Ngành đã tồn tại, vui lòng chọn ngành khác.`,
          });
        }
      },
      error: function () {
        Toast.fire({
          icon: "error",
          title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
        });
      },
    });
  });
});
