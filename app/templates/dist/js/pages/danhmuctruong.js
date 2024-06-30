var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

function empty_modal() {
$("#modal_title").empty();
$("#modal_body").empty();
$("#modal_footer").empty();
}

// Khởi tạo dropdown
$('.dropdown-toggle').dropdown()

let bangdscactruong = $("#bangdscactruong").DataTable({
  paging: true,
  lengthChange: false,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    type: "GET",
    url: "get_danh_sach_truong",
    dataSrc: "",
  },
  columns: [
    {
      data: "id",
      render: function (data, type, row, meta) {
        return `<center><input type="checkbox" id='child-checkbox' name='select-checkbox[]' class="select-checkbox child-checkbox" data-id="${row.id}"></center>`;
      },
    },
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
        if (data == 0) {
          return '<center><span class="badge badge-success"><i class="fa-solid fa-check"></i> Đang sử dụng</span></center>';
        } else {
          return '<center><span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Ngưng sử dụng</span></center>';
        }
      },
    },
    {
      data: null,
      render: function (data, type, row,meta) {
        if (row.isDeleted == 1) {
          return `
            <center>
              <a class="btn btn-dark btn-sm" id="unlockTruongBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Mở khóa trường">
                <i class="fa-solid fa-key"></i>
              </a>
            </center>
          `;
        } else {
            return `
            <center>
              <a class="btn btn-info btn-sm" id="edittruongBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Sửa thông tin">
                <i class="fa-solid fa-pencil-alt"></i>
              </a>
              <a class="btn btn-dark btn-sm" id="deleteTruongBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top">
                <i class="fa-solid fa-lock"></i>
              </a>
            </center>`
        }
      },
    },
  ],
});

// Lock trường
$("#bangdscactruong").on("click", "#deleteTruongBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: `Xác nhận ngưng sử dụng trường?`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Ngưng sử dụng",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_xoa_truong_by_id?id=${id}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: "Đã ngưng sử dụng.",
            });
            bangdscactruong.ajax.reload();
          } else if (res.status == "EXISTS") {
            Toast.fire({
              icon: "warning",
              title: "Trường đang được sử dụng.",
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


// Thêm trường
$("#taodanhmuctruongBtn").on("click", function () {
  empty_modal();

  $("#modal_title").text(`Tạo trường mới`);
  $("#modal_body").html(`
      <div class="form-group">
        <label for="modal_tentruong_input">Tên trường</label>
          <input type="text" class="form-control" id="modal_tentruong_input" required />
      </div>
      <div class="form-group">
        <label for="modal_kyhieu_input">Ký hiệu</label>
        <input type="text" class="form-control" id="modal_kyhieu_input" required />
      </div>
    `);
  $("#modal_footer").append(
    `<button type="button" class="btn btn-primary" id="modal_submit_truong_btn">
        <i class="fa-solid fa-floppy-disk"></i>
        Lưu
      </button>`
  );

  $("#modal_id").modal("show");

  let tentruong = $("#modal_tentruong_input");
  let kyhieu = $("#modal_kyhieu_input");

  $("#modal_submit_truong_btn").on("click", function () {
    $.ajax({
      type: `POST`,
      url: `them_truong?ten=${tentruong.val()}&kyhieu=${kyhieu.val()}&isDeleted=0`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã thêm trường mới.`,
          });
          $("#modal_id").modal("hide");
          bangdscactruong.ajax.reload();
        } else if (res.status == "NOT_CREATE") {
          Toast.fire({
            icon: "warning",
            title: `Trường đã tồn tại, vui lòng chọn trường khác.`,
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", status, error);
        Toast.fire({
          icon: "error",
          title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
        });
      },
    });
  });
});

// Unlock truong
$("#bangdscactruong").on("click", "#unlockTruongBtn", function () {
let id = $(this).data("id");

Swal.fire({
  title: `Xác nhận mở khóa trường?`,
  showDenyButton: false,
  showCancelButton: true,
  confirmButtonText: "Mở khóa",
  cancelButtonText: "Huỷ",
}).then((result) => {
  if (result.isConfirmed) {
    $.ajax({
      type: `POST`,
      url: `update_mo_khoa_truong_by_id?id=${id}`,
      success: function (res) {
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã mở khóa trường.`,
          });
          bangdscactruong.ajax.reload();
        } else {
          Toast.fire({
            icon: "error",
            title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
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

// Cập nhật thông tin trường
$("#bangdscactruong").on("click", "#edittruongBtn", function () {
let id = $(this).data("id");
empty_modal();
$.ajax({
  type: "GET",
  url: `get_chi_tiet_truong_by_id?id=` + parseInt(id),
  success: function (truong) {
    console.log(truong);
    $("#modal_title").text("Sửa thông tin trường " + truong.kyhieu);
    let html = `
      <div class="form-group">
        <label for="modal_tentruong_input">Tên trường</label>
        <input type="text" class="form-control" id="modal_tentruong_input" value="${truong.ten}" required />
      </div>
      <div class="form-group">
        <label for="modal_kyhieu_input">Ký hiệu</label>
        <input type="text" class="form-control" id="modal_kyhieu_input" value="${truong.kyhieu}" required />
      </div>
    `;
    $("#modal_body").append(html);
    $("#modal_footer").append(
      `<button type="button" class="btn btn-primary" id="modal_submit_truong_btn">
          <i class="fa-solid fa-floppy-disk"></i> 
          Lưu 
        </button>`
    );
    // Show the modal
    $("#modal_id").modal("show");
    $("#modal_submit_truong_btn").on("click", function () {
      let tentruong = $("#modal_tentruong_input");
      let kyhieu = $("#modal_kyhieu_input");
      $.ajax({
        type: `POST`,
        url: `update_chi_tiet_truong_by_id?id=${id}&ten=${tentruong.val()}&kyhieu=${kyhieu.val()}&isDeleted=0`,
        success: function (res) {
          console.log(res);
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Cập nhật thành công.`,
            });
            $("#modal_id").modal("hide");
            bangdscactruong.ajax.reload();
          } else if (res.status == "NOT_UPDATE") {
            Toast.fire({
              icon: "warning",
              title: "Ký hiệu đã được sử dụng trước đó. Vui lòng chọn ký hiệu khác.",
            });
          }
        },
        error: function (xhr, status, error) {
          console.error("Error:", status, error);
          Toast.fire({
            icon: "error",title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
          });
        },
      });
    });
  },
});
});

// Select all/none checkboxes
$("#bangdscactruong").on("click", function () {
  var selectCheckboxAll = $(".select-all-checkbox");
  var selectCheckboxItem = $(".select-checkbox");
  
  selectCheckboxAll.change(function () {
    var checked = $(this).prop("checked");
    selectCheckboxItem.prop("checked", checked);
    renderCheckAllSubmit();
  });
  selectCheckboxItem.change(function () {
    var checkedAll =
      selectCheckboxItem.length ===
      $('input[name="select-checkbox[]"]:checked').length;
    selectCheckboxAll.prop("checked", checkedAll);
    renderCheckAllSubmit();
  });
  function renderCheckAllSubmit() {
    var checkedCount = $('input[name="select-checkbox[]"]:checked').length;
    if (checkedCount > 0) {
      $("#xoadanhmuctruongBtn").prop("disabled", false);
    } else {
      $("#xoadanhmuctruongBtn").prop("disabled", true);
    }
  }
});

//Xử lý sự kiện nút checkbox để xóa trường
$("#xoadanhmuctruongBtn").on("click", function () {
  let idList = $("#child-checkbox:checked")
  .map(function () {
    return $(this).data("id");
  })
  .get();
  if (idList.length == 0) {
    Toast.fire({
      icon: "warning",
      title: `Vui lòng chọn trường cần xóa.`,
    });
  } else {
    Swal.fire({
      title: `Xác nhận xóa trường đã chọn?`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: `POST`,
          url: `delete_truong_by_id?idList=${idList}`,
          contentType: "application/json",
          success: function (res) {
            console.log(res);
            if (res.status == "OK") {
              Toast.fire({
                icon: "success",
                title: `Xóa thành công.`,
              });
              bangdscactruong.ajax.reload();
            } else {
                Toast.fire({
                icon: "warning",
                title: "Trường đang được sử dụng.",
                });
              bangdscactruong.ajax.reload();
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
            Toast.fire({
              icon: "error",
              title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
            });
          bangdscactruong.ajax.reload();
          },
        });
      }
    });
  }
});


// Xử lý sự kiện khi click vào nút "Xem tài liệu"
$("#bangdscactruong").on("click","#viewDocumentBtn", function () {
  let id = $(this).data("id");
  empty_modal();
  $.ajax({
    type: `GET`,
    url: `get_danh_sach_bieu_mau_theo_truong?id=${id}`,
    success: function (res) {
      let options = "";
      res.forEach((school) => {
        options += `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <a href='xem_${school.tenfile}?id_bieumau=${school.id_bieumau}'>
              ${school.tenbieumau} (${school.id_bieumau})
            </a>
          </div>
            <a href='xem_${school.tenfile}?id_bieumau=${school.id_bieumau}' download='${school.tenfile}'>
              <i class="mx-2 fa fa-download text-dark" aria-hidden="true"></i>
            </a>
        </div>
        <!--<button class="delete-document-btn" data-document-id="${school.id_bieumau}" style="background: none; border: none; cursor: pointer;">
          <i class="fa fa-trash text-red" aria-hidden="true"></i>
        </button> -->
      </br>
        `;
      });
      $("#modal_truong_select").html(options);
    },
  });
  $("#modal_title").text(`Xem văn bản`);
      $("#modal_body").html(`
      <div class="form-group">
        <label for="modal_truong_select">Chọn văn bản</label>
        <div id= 'modal_truong_select'></div>
      </div>
      `);
    
    $("#modal_id").modal("show");
});

// Xử lý sự kiện for button delete document in modal
/*$(document).on("click", ".delete-document-btn", function () {
  let documentId = $(this).data("document-id");

  $.ajax({
    type: "DELETE",
    url: `xoa_bieu_mau?id_bieumau=${documentId}`,
    success: function (res) {
      console.log(res);
      if (res.status === "OK") {
        Toast.fire({
          icon: "success",
          title: `Xóa văn bản thành công.`,
        });
      } else {
        Toast.fire({
          icon: "warning",
          title: "Văn bản đang được sử dụng.",
        });
      }
      // Tải lại bảng dữ liệu
      $('#bangdscactruong').DataTable().ajax.reload();
    },
    error: function (xhr, status, error) {
      console.error("Error:", status, error);
      Toast.fire({
        icon: "error",
        title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
      });
      // Tải lại bảng dữ liệu
      $('#bangdscactruong').DataTable().ajax.reload();
    },
  });
});*/

