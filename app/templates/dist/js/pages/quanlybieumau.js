let currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 3);
let currentTimestamp = Math.floor(currentDate.getTime() / 1000);

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

// Clear modal
function clear_modal() {
  $("#modal_title").empty();
  $("#modal-body").empty();
  $("#modal_footer").empty();
}

let bangdsbieumau = $("#bangdsbieumau").DataTable({
  paging: true,
  lengthChange: false,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    type: "GET",
    url: "get_danh_sach_bieumauthuoctruong",
    dataSrc: "",
  },
  columns: [
    {
      data: "id_bieumau",
      render: function (data, type, row, meta) {
        return `<center><input type="checkbox" id='child-checkbox' name='select-checkbox[]' class="select-checkbox child-checkbox" data-id_bieumau="${row.id_bieumau}"></center>`;
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
    {
      data: null,
      render: function (data, type, row) {
        if (row.bieumau_isDelete == 1) {
          return `
          <div class="dropdown">
          <a class='text-dark' href="xem_file?tenfile=${row.tenfile}&id=${row.id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem ${row.tenbieumau}</a>
            <a class="btn btn-warning btn-sm" id="unlockBieuMauBtn" data-id_bieumau="${row.id_bieumau}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Mở khóa biểu mẫu">
              <i class="fa-solid fa-key"></i>
            </a>
          </div>
        `;
        } else {
          if (row.tenfile === "phieutiepnhan_ctu.pdf") {
            return `
          <div class="dropdown">
          <a class='text-dark' href="xem_file?tenfile=${row.tenfile}&id=${row.id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem ${row.tenbieumau}</a>
          <a class="btn btn-outline-warning btn-sm mx-2 editbieumau" id='editbieumau' data-id="${row.id}" data-id_bieumau="${row.id_bieumau}" data-tenfile="${row.tenfile}" href="#"><i class="fas fa-pencil-alt"></i></a>
          <a class="btn btn-danger btn-sm" id="deleteBieuMauBtn" data-id_bieumau="${row.id_bieumau}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Xoá biểu mẫu">
            <i class="fa-solid fa-trash"></i>
          </a>
          </div>
          `;
          } else {
            return `
          <div class="dropdown">
          <a class='text-dark' href="xem_file?tenfile=${row.tenfile}&id=${row.id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem ${row.tenbieumau}</a>
          <a class="btn btn-danger btn-sm" id="deleteBieuMauBtn" data-id_bieumau="${row.id_bieumau}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Xoá biểu mẫu">
            <i class="fa-solid fa-trash"></i>
          </a>
          </div>
          `;
          }
        }
      },
    },
  ],
});

$("#dashboard-select-districts").on("change", function () {
  const selectedValue = $(this).val();
  loadChiSo(selectedValue);
  bangdsbieumau.columns(7).search(selectedValue).draw();
});

$(document).ready(function () {
  // Add an event listener for opening the modal
  $("#bangdsbieumau").on("click", ".editbieumau", function (e) {
    e.preventDefault();
    // Get the id and id_bieumau from the button's data attributes
    const id = $(this).data("id");
    const id_bieumau = $(this).data("id_bieumau");
    const tenfile = $(this).data("tenfile");
    clear_modal();
    // Get the form HTML based on the tenbieumau
    let formHTML = getFormByTenFile(tenfile);
    // Append the form HTML to the modal
    $("#modal-body").append(formHTML);
    // Store these values in the modal for later use
    $("#dataForm").data("id", id);
    $("#dataForm").data("id_bieumau", id_bieumau);
    $("#dataForm").data("tenfile", tenfile);
    console.log("id:", id, "id_bieumau:", id_bieumau, "tenfile:", tenfile);
    // Open the modal
    $("#dataModal").modal("show");

    // Handle the form submission
    $("#dataForm").on("submit", function (event) {
      event.preventDefault();

      // Get the id, id_bieumau, and input data
      const id = $(this).data("id");
      const id_bieumau = $(this).data("id_bieumau");
      const tenfile = $(this).data("tenfile");
      const inputData = $("#inputData").val();
      const inputThoiGianData = $("#inputThoiGianData").val();
      const encodedInputThoiGianData = encodeURIComponent(inputThoiGianData);
      const encodedInputData = encodeURIComponent(inputData);
      console.log("Data to be sent:", {
        id,
        id_bieumau,
        data: encodedInputData,
      });

      $.ajax({
        type: "POST",
        url:
          "chinh_sua_phieutiepnhan_ctu.pdf?id=" +
          id +
          "&id_bieumau=" +
          id_bieumau +
          "&data=" +
          encodedInputData +
          "&thoigian=" +
          encodedInputThoiGianData,
        success: function (response) {
          console.log("Response:", response);
          // Handle the successful response
          Toast.fire({
            icon: "success",
            title: "Dữ liệu đã được gửi thành công!",
          });
          $("#dataModal").modal("hide");
        },
        error: function (error) {
          // Handle errors
          Toast.fire({
            icon: "error",
            title: "Có lỗi xảy ra, vui lòng thử lại!",
          });
        },
      });
    });
  });
});

function getFormByTenFile(tenfile) {
  switch (tenfile) {
    case "phieutiepnhan_ctu.pdf":
      return `
      <form id="dataForm">
        <div class="form-group">
          <label for="inputData">Nội dung phiếu tiếp nhận CTU</label>
          <textarea class="form-control mb-3" id="inputData" rows="3"></textarea>
          <label for="inputThoiGianData">Thời biểu</label>
          <textarea class="form-control" id="inputThoiGianData" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      `;
    case "phieudanhgia_vlute.pdf":
      return `  
      <form id="dataForm">
        <div class="form-group">
          <label for="inputData">Nội dung phiếu đánh giá VLUTE</label>
          <textarea class="form-control" id="inputData" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      `;
    case "phieugiaoviec_ctu.pdf":
      return `  
      <form id="dataForm">
        <div class="form-group">
          <label for="inputData">Nội dung phiếu giao việc CTU</label>
          <textarea class="form-control" id="inputData" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      `;
    case "phieutheodoi_ctu.pdf":
      return `  
      <form id="dataForm">
        <div class="form-group">
          <label for="inputData">Nội dung phiếu theo dõi CTU</label>
          <textarea class="form-control" id="inputData" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      `;
    case "phieudanhgia_ctu.pdf":
      return `  
      <form id="dataForm">
        <div class="form-group">
          <label for="inputData">Nội dung phiếu danh giá CTU</label>
          <textarea class="form-control" id="inputData" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Gửi</button>
      </form>
      `;
    default:
      return `<div class="alert alert-warning">Form not available</div>`;
  }
}

// Select all/none checkboxes
$("#bangdsbieumau").on("click", function () {
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
      $("#xoadanhmucbieumauBtn").prop("disabled", false);
    } else {
      $("#xoadanhmucbieumauBtn").prop("disabled", true);
    }
  }
});

//xoa bieu mau vĩnh viễn
$("#xoadanhmucbieumauBtn").on("click", function () {
  let idList = $("#child-checkbox:checked")
    .map(function () {
      return $(this).data("id_bieumau");
    })
    .get();
  if (idList.length == 0) {
    Toast.fire({
      icon: "warning",
      title: `Vui lòng chọn biểu mẫu cần xóa.`,
    });
  } else {
    Swal.fire({
      title: `Xác nhận xóa biểu mẫu?`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: `POST`,
          url: `delete_bieumau_by_id_list?idList=${idList}`,
          contentType: "application/json",
          success: function (res) {
            console.log(res);
            if (res.status == "OK") {
              Toast.fire({
                icon: "success",
                title: `Đã xóa biểu mẫu.`,
              });
              bangdsbieumau.ajax.reload();
            } else {
              Toast.fire({
                icon: "warning",
                title: "Không thể xóa biểu mẫu đang được sử dụng.",
              });
              bangdsbieumau.ajax.reload();
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
            Toast.fire({
              icon: "error",
              title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
            });
            bangdsbieumau.ajax.reload();
          },
        });
      }
    });
  }
});

// Xoa bieu mau
$("#bangdsbieumau").on("click", "#deleteBieuMauBtn", function () {
  let id_bieumau = $(this).data("id_bieumau");

  Swal.fire({
    title: `Xác nhận ngưng sử dụng biểu mẫu`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_xoa_bieumau_by_id?id_bieumau=${id_bieumau}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Ngưng sử dụng biểu mẫu thành công!.`,
            });
            bangdsbieumau.ajax.reload();
          } else if (res.status == "EXISTS") {
            Toast.fire({
              icon: "warning",
              title: "Biểu mẫu đang được sử dụng. Vui lòng chọn Ngừng sử dụng",
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

// Unlock bieumau
$("#bangdsbieumau").on("click", "#unlockBieuMauBtn", function () {
  let id_bieumau = $(this).data("id_bieumau");

  Swal.fire({
    title: `Xác nhận mở khóa biểu mẫu`,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Mở khóa",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: `POST`,
        url: `update_mo_khoa_bieumau_by_id?id_bieumau=${id_bieumau}`,
        success: function (res) {
          if (res.status == "OK") {
            Toast.fire({
              icon: "success",
              title: `Mở khóa biểu mẫu thành công.`,
            });
            bangdsbieumau.ajax.reload();
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

// Them bieu mau
// Tạo thông tin ngành
$("#taodanhmucbieumauBtn").on("click", function () {
  clear_modal();
  $.ajax({
    type: `GET`,
    url: `get_danh_sach_truong`,
    success: function (res) {
      let options = "";
      res.forEach((school) => {
        options += `<option value="${school.id}">${school.ten} (${school.id})</option>`;
      });
      $("#modal_chontruong_select").html(options);
    },
  });
  $("#modal_title").text(`Tạo biểu mẫu mới`);
  $("#modal_body").html(`
      <div class="form-group">
        <label for="modal_tenbieumau_input">Tên biểu mẫu (vd: Phiếu theo dõi - ctu)</label>
        <input type="text" class="form-control" id="modal_tenbieumau_input" required />
      </div>
      <div class="form-group">
        <label for="modal_data_input">File pdf</label>
        <input type="file" class="form-control" id="modal_data_input" required />
      </div>
      <div class="form-group">
        <label for="modal_chontruong_select">Chọn trường</label>
        <select id="modal_chontruong_select" class="form-control">
        </select>
      </div>
    `);
  $("#modal_footer").append(
    `<button type="button" class="btn btn-primary" id="modal_submit_bieumau_btn">
        <i class="fa-solid fa-floppy-disk"></i> 
        Lưu 
      </button>`
  );

  $("#modal_id").modal("show");

  let tenbieumau = $("#modal_tenbieumau_input");
  let data = $("#modal_data_input");
  let idtruong = $("#modal_chontruong_select");
  let tenfile = $("#modal_tenfile_input");
  $("#modal_submit_bieumau_btn").on("click", function () {
    var formData = new FormData();
    formData.append("file", data[0].files[0]);
    formData.append("ten", tenbieumau.val().trim());
    formData.append("idtruong", idtruong.val());
    formData.append("isDelete", 0); // Assuming isDeleted is always 0
    $.ajax({
      type: `POST`,
      url: `them_bieumau`,
      data: formData,
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        if (res.status == "OK") {
          Toast.fire({
            icon: "success",
            title: `Đã thêm biểu mẫu ${tenbieumau.val()}.`,
          });
          $("#modal_id").modal("hide");
          bangdsbieumau.ajax.reload();
        } else if (res.status == "NOT_ALLOWED") {
          Toast.fire({
            icon: "warning",
            title: `Loại file không được hỗ trợ, vui lòng chọn lại file khác (.doc, .docx, pdf).`,
          });
        } else if (res.status == "EXIST") {
          Toast.fire({
            icon: "warning",
            title: `Văn bản đã tồn tại, thử lại sau`,
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
