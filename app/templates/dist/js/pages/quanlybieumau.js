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
    url: "get_danh_sach_truong",
    dataSrc: "",
  },
  columns: [
    {
      data: "id_bieumau",
      render: function (data, type, row, meta) {
        return `<center><input type="checkbox" id='child-checkbox' name='select-checkbox' class="select-checkbox child-checkbox" data-id_bieumau="${row.id_bieumau}"></center>`;
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
        const kyhieu = row.kyhieu ? row.kyhieu.toLowerCase() : "";
        return `
        <div class="dropdown">
        <a class='text-dark' href="xem_${row.tenfile}?id=${row.id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem ${row.tenbieumau}</a>
        <a class="btn btn-outline-warning btn-sm mx-2 editbieumau" id='editbieumau' data-id="${row.id}" data-id_bieumau="${row.id_bieumau}" data-tenfile="${row.tenfile}" href="#"><i class="fas fa-pencil-alt"></i></a>
        </div>
        `;
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
$("#bangdsbieumau").on("click", ".select-all-checkbox", function () {
  var isChecked = $(this).prop("checked");
  $(".child-checkbox").prop("checked", isChecked);
});
// Xóa bieu mau
$(document).ready(function () {
  // Ẩn nút khi trang vừa tải
  $("#xoadanhmucbieumauBtn").hide();

  // Lắng nghe sự kiện khi checkbox thay đổi trạng thái
  $(document).on("change", ".select-checkbox", function () {
    if ($(".select-checkbox:checked").length > 0) {
      // Hiển thị nút nếu có checkbox được chọn
      $("#xoadanhmucbieumauBtn").show();
    } else {
      // Ẩn nút nếu không có checkbox nào được chọn
      $("#xoadanhmucbieumauBtn").hide();
    }
  });

  // Lắng nghe sự kiện thay đổi của checkbox "select-all-checkbox"
  $(document).on("change", ".select-all-checkbox", function () {
    $(".select-checkbox")
      .prop("checked", $(this).prop("checked"))
      .trigger("change");
  });
  // Lắng nghe sự kiện thay đổi của checkbox "select-checkbox"
  var select_checkbox_item = $("input[name='select-checkbox']");
  $(document).on("change", ".select-checkbox", function () {
    var checked =
      select_checkbox_item.length ===
      select_checkbox_item.filter(":checked").length;
    $(".select-all-checkbox").prop("checked", checked);
  });
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
                title: `Đã xóa ${idList.length} biểu mẫu.`,
              });
              bangdsbieumau.ajax.reload();
            } else {
              Toast.fire({
                icon: "warning",
                title: "Không thể xóa ngành đang được sử dụng.",
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
