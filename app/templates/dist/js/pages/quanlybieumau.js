var Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});
let bangdscacbieumau = $("#bangdscacbieumau").DataTable({
  paging: true,
  lengthChange: true,
  searching: true,
  ordering: true,
  info: true,
  autoWidth: false,
  responsive: true,
  ajax: {
    url: "get_danhsach_templates",
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
    { data: "name", className: "text-center" },
    { data: "content", className: "text-center" },
    { data: "ten_truong" },
    {
      data: null,
      className: "text-center",
      render: function (data, type, row) {
        return `
        <center>
            <a class="btn btn-primary btn-sm" id="viewBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Xem biểu mẫu">
                <i class="fa-solid fa-eye"></i>
            </a>
            <a class="btn btn-info btn-sm" id="editBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Sửa biểu mẫu">
              <i class="fa-solid fa-pencil-alt"></i>
            </a>
            <a class="btn btn-danger btn-sm" id="deleteBtn" data-id="${row.id}" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Xoá biểu mẫu">
              <i class="fa-solid fa-trash"></i>
            </a>
          </center>
            `;
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

function editTemplate(id) {
  // Handle edit template
}

function deleteTemplate(id) {
  // Handle delete template
}
