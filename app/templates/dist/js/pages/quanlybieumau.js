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
  $("#modal_body").empty();
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
        <a class="btn btn-outline-warning btn-sm mx-2 editbieumau" id='editbieumau' data-id="${row.id}" data-id_bieumau="${row.id_bieumau}" href="#"><i class="fas fa-pencil-alt"></i></a>
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
    if (id_bieumau == 6) {
      // Store these values in the modal for later use
      $("#dataForm").data("id", id);
      $("#dataForm").data("id_bieumau", id_bieumau);

      // Open the modal
      $("#dataModal").modal("show");
    }
  });

  // Handle the form submission
  $("#dataForm").on("submit", function (event) {
    event.preventDefault();

    // Get the id, id_bieumau, and input data
    const id = $(this).data("id");
    const id_bieumau = $(this).data("id_bieumau");
    const inputData = $("#inputData").val();
    const inputThoiGianData = $("#inputThoiGianData").val();
    const encodedInputThoiGianData = encodeURIComponent(inputThoiGianData);
    const encodedInputData = encodeURIComponent(inputData);
    console.log("Data to be sent:", { id, id_bieumau, data: encodedInputData });

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
