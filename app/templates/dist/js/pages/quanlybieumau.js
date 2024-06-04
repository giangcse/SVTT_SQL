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

const createDropdownMenu = (id, row) => {
  const kyhieu = row.kyhieu ? row.kyhieu.toLowerCase() : "";
  if (kyhieu === "vlute") {
    return `
    <a class="dropdown-item" href="xem_phieu_danh_gia_${kyhieu}?id=${id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem phiếu đánh giá</a>
  `;
  } else {
    return `
    <a class="dropdown-item" href="xem_phieu_tiep_nhan_${kyhieu}?id=${id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem phiếu tiếp nhận</a>
    <a class="dropdown-item" href="xem_phieu_giao_viec_${kyhieu}?id=${id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem phiếu giao việc</a>
    <a class="dropdown-item" href="xem_phieu_theo_doi_${kyhieu}?id=${id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem phiếu theo dõi</a>
    <a class="dropdown-item" href="xem_phieu_danh_gia_${kyhieu}?id=${id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem phiếu đánh giá</a>
  `;
  }
};

const createButton = (id, row) => {
  const dropdownMenu = createDropdownMenu(id, row);

  return `
    <center>
      <div class="btn-group dropleft">
        <button type="button" class="btn btn-outline-success btn-sm dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-eye"></i>
        </button>
        <div class="dropdown-menu">${dropdownMenu}</div>
        <button class="btn btn-outline-warning mx-2 btn-sm editForm" data-id="${id}"><i class="fas fa-pencil-alt"></i></button>
      </div>
    </center>`;
};

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
        return `<a class="dropdown-item" href="xem_${row.tenbieumau}?id=${row.id}&id_bieumau=${row.id_bieumau}" target="_blank">Xem ${row.tenbieumau}</a>
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
