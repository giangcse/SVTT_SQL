var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});


$(document).ready(function () { //LẤY USERNAME TỪ COOKIE
  let c = document.cookie.split(";");
  let username = "";
  c.forEach(function (val) {
    if (val.includes("username=")) {
      username = val.split("username=")[1];
    }
  });
  // console.log(username);
});


let bangdsthamso = $("#bangdsthamso").DataTable({
  paging: true,
  lengthChange: false,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    type: "GET",
    url: "get_all_tham_so",
    dataSrc: "",
  },
  columns: [{
    data: null,
    render: function (data, type, row, meta) {
      // Use meta.row to get the current row index, and add 1 to start from 1
      return "<center>" + (meta.row + 1) + "</center>";
    },
  },
  {
    data: "ten"
  },
  {
    data: "thamso"
  },
  {
    data: "giatri"
  },
  {
    data: "mota"
  },
  {
    data: "trangthai",
    render: function (data, type, row) {
      let hethong = `<span class="badge badge-info"><i class="fa-solid fa-screwdriver-wrench"></i> Tham số cá nhân</span>`;
      if (row.thamsohethong == 1) {
        hethong = `<span class="badge badge-primary"><i class="fa-solid fa-gears"></i> Tham số hệ thống</span>`;
      }
      if (data == 1) {
        return `<center><span class="badge badge-success"><i class="fa-solid fa-check"></i> Đang hoạt động</span>${hethong}</center>`;
      } else {
        return `<center><span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Ngưng hoạt động</span>${hethong}</center>`;
      }
    },
  },
  {
    data: "id",
    render: function (data, type, row, meta) {
      if (row.thamsohethong == 0) {
        return (
          `<center>
              <a class="btn btn-info btn-sm" id="editBtn" data-id="${data}">
                <i class="fas fa-pencil-alt"></i>
              </a>  
              <a class="btn btn-danger btn-sm" data-id="${data}" id="deleteBtn">
                <i class="fas fa-trash"></i>
              </a>
            </center>`
        );
      } else {
        return `<center>
                    <button class="btn btn-info btn-sm" data-id="${data}" id="editBtn">
                      <i class="fas fa-pencil-alt"></i>
                    </button>  
                  </center>`;
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


// Xoá tham số
$("#bangdsthamso").on("click", "#deleteBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: `Xác nhận xoá tham số`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_xoa_tham_so_by_id?id=${id}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Xoá tham số thành công.`,
            });
            bangdsthamso.ajax.reload();
          } else if (res.status == "EXISTS") {
            Toast.fire({
              icon: "warning",
              title: "Tham số đang được sử dụng. Vui lòng chọn Ngừng sử dụng.",
            });
          }
        },
        error: function () {
          Toast.fire({
            icon: "error",
            title: `Xoá tham số thất bại.`,
          });
        },
      });
    }
  });
});

// Sửa tham số
$("#bangdsthamso").on("click", "#editBtn", function () {
  let id = $(this).data("id");

  clear_modal();
  $("#modal_title").text(`Chỉnh sửa tham số`);
  $("#modal_body").html(`
    <div class="form-group">
      <label for="modal_tenthamso_input">Tên tham số</label>
      <input type="text" class="form-control" id="modal_tenthamso_input" required />
    </div>
    <div class="form-group">
      <label for="modal_thamso_input">Tham số</label>
      <input type="text" class="form-control" id="modal_thamso_input" required />
    </div>
    <div class="form-group">
      <label for="modal_giatri_input">Giá trị</label>
      <input type="text" class="form-control" id="modal_giatri_input" required />
    </div>
    <div class="form-group">
      <label for="modal_mota_input">Mô tả</label>
      <textarea id="modal_mota_input" class="form-control" rows="5"></textarea>
    </div>
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="modal_hoatdong_check">
      <label class="form-check-label" for="modal_hoatdong_check">Hoạt động?</label>
    </div>
  `);

  $("#modal_footer").html(`
    <button type="button" class="btn btn-primary" id="modal_submit_btn">
      <i class="fa-solid fa-floppy-disk"></i> Lưu
    </button>`);

  // Đổ dữ liệu về modal
  $.ajax({
    type: 'GET',
    url: `get_chi_tiet_tham_so?id=${id}`,
    success: function(data) {
      $("#modal_tenthamso_input").val(data.ten);
      $("#modal_thamso_input").val(data.thamso);
      $("#modal_giatri_input").val(data.giatri);
      $("#modal_mota_input").val(data.mota.replace(/<br>/g, "\r\n"));
      if (data.trangthai == 1) {
				$("#modal_hoatdong_check").prop("checked", true);
			} else {
				$("#modal_hoatdong_check").prop("checked", false);
			}
      $("#modal_id").modal("show");
    },
    error: function() {
      Toast.fire({
        icon: "error",
        title: "Không load được dữ liệu"
      });
    }
  });

  // Bắt sự kiện lưu thay đổi
  $("#modal_submit_btn").on("click", function() {
    let tenthamso = $("#modal_tenthamso_input").val();
    let thamso = $("#modal_thamso_input").val();
    let giatri = $("#modal_giatri_input").val();
    let mota = $("#modal_mota_input").val().replace(/[\r\n]+/g, "<br>");
    let hoatdong = $("#modal_hoatdong_check").is(":checked");
    let trangthai = 1;
    if (!hoatdong)
      trangthai = 0;

    $.ajax({
      type: 'POST',
      url: `cap_nhat_tham_so?id=${id}&ten=${tenthamso}&thamso=${thamso}&giatri=${giatri}&mota=${mota}&trangthai=${trangthai}`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã thêm tham số.`,
          });
          $("#modal_id").modal("hide");
          bangdsthamso.ajax.reload();
        } else {
          Toast.fire({
            icon: "error",
            title: `Tham số không tồn tại`,
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

// Tạo tham số
$("#themThamSoBtn").on("click", function () {
  clear_modal();
  $("#modal_title").text(`Thêm mới tham số`);

  $("#modal_body").html(`
    <div class="form-group">
      <label for="modal_tenthamso_input">Tên tham số</label>
      <input type="text" class="form-control" id="modal_tenthamso_input" required />
    </div>
    <div class="form-group">
      <label for="modal_thamso_input">Tham số</label>
      <input type="text" class="form-control" id="modal_thamso_input" required />
    </div>
    <div class="form-group">
      <label for="modal_giatri_input">Giá trị</label>
      <input type="text" class="form-control" id="modal_giatri_input" required />
    </div>
    <div class="form-group">
      <label for="modal_mota_input">Mô tả</label>
      <textarea id="modal_mota_input" class="form-control" rows="5"></textarea>
    </div>
    <div class="form-check">
      <input type="checkbox" class="form-check-input" id="modal_hoatdong_check">
      <label class="form-check-label" for="modal_hoatdong_check">Hoạt động?</label>
    </div>
  `);

  $("#modal_footer").html(`
    <button type="button" class="btn btn-primary" id="modal_submit_btn">
      <i class="fa-solid fa-floppy-disk"></i> Lưu
    </button>`);

  $("#modal_id").modal("show");

  $("#modal_submit_btn").on("click", function () {
    let tenthamso = $("#modal_tenthamso_input").val();
    let thamso = $("#modal_thamso_input").val();
    let giatri = $("#modal_giatri_input").val();
    let mota = $("#modal_mota_input").val().replace(/[\r\n]+/g, "<br>");
    let hoatdong = $("#modal_hoatdong_check").is(":checked");
    let trangthai = 1;
    if (!hoatdong)
      trangthai = 0;

    $.ajax({
      type: `POST`,
      url: `them_tham_so?ten=${tenthamso}&thamso=${thamso}&giatri=${giatri.toString()}&mota=${mota}&trangthai=${trangthai}`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã thêm tham số.`,
          });
          $("#modal_id").modal("hide");
          bangdsthamso.ajax.reload();
        } else {
          Toast.fire({
            icon: "error",
            title: `Tham số đã tồn tại`,
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