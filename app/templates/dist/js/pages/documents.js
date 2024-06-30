var Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
});

function clear_modal() {
    $("#modal_title").empty();
    $("#modal_body").empty();
    $("#modal_footer").empty();
}

// Khởi tạo dropdown
$('.dropdown-toggle').dropdown()

let bangdsvanban = $("#bangdsvanban").DataTable({
    paging: true,
    lengthChange: false,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
    ajax: {
        type: "GET",
        url: "get_danh_sach_van_ban",
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
        { data: "tenvanban" },
        { data: "tentruong" },
        {
          data: "files",
          render: function (data, type, row) {
            if (row.files && row.files.length > 0) {
              let fileInfo = row.files.map(file => `
                <div>
                  <a target="_blank" class="text-primary" href="xem_file?id_file=${file.id_file}&tenfile=${file.tenfile}">${file.tenfile} (${file.ngaydang})</a>
                  <i style="cursor:pointer" class="fa fa-times text-danger delete-file" data-file-id="${file.id_file}" aria-hidden="true"></i>
                </div>
              `).join('');
              return fileInfo;
            } else {
              return ''; // Trả về chuỗi rỗng nếu không có files để hiển thị
            }
          }
        },
        { data: "nguoidangtai" },
        { 
            data: "id",
             render: function(data, type, row, meta) {
                return (
                    `<center>
                      <a class="btn btn-info btn-sm" id="editBtn" data-id="${row.id}">
                        <i class="fas fa-pencil-alt"></i>
                      </a>
                      <a class="btn btn-danger btn-sm" data-id="${data}" id="deleteBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Xoá văn bản">
                        <i class="fas fa-trash"></i>
                      </a>
                    </center>`
                );
            }
        }
    ]
})

// modal add file
$("#themfile_btn").on("click",function () {
    clear_modal();
    $.ajax({
      type: "GET",
      url: "get_chi_tiet_van_ban",
      success: function (res) {
        console.log(res.tenvanban)
      $("#modal_title").text("Upload File");
        html = `
            <div class="form-group">
              <label for="modal_tenvanban_select">Chọn văn bản</label>
              <select id="modal_tenvanban_select" class="form-control select2"></select>
            </div>
            <div class="form-group">
              <label for="modal_duongdan_input">Choose file (PDF, Word, Excel)</label>
              <input type="file" class="form-control-file" id="modal_duongdan_input" accept=".pdf,.doc,.docx,.xls,.xlsx" multiple required>
            </div>
          <script>
            $(".select2").select2({
              theme: "bootstrap",
              dropdownParent: $("#modal_id")
            });
          </script>`;
        $("#modal_body").append(html);
        $.each(res.tenvanban, function (idx, val) {
          $("#modal_tenvanban_select").append(
            '<option value="' + val.id + '">' + val.tenvanban + "</option>"
          );
        });
        $("#modal_footer").append(
          '<button type="button" class="btn btn-primary" id="modal_submit_btn"><i class="fa-solid fa-floppy-disk"></i> Lưu</button>'
        );
        $("#modal_id").modal("show");
        
        $("#modal_submit_btn").on("click", function () {
          var formData = new FormData();
              let data = $("#modal_duongdan_input")[0].files[0];
              let tenvanban = $("#modal_tenvanban_select").val();

              formData.append("tenvanban", tenvanban);
              formData.append("isDeleted", 0);
              formData.append("files", data);

        $.ajax({
          type: `POST`,
          url: `them_files`,
          data: formData,
          contentType: false,
          processData: false,
          success: function (res) {
            if(res.status == 'OK'){
              Toast.fire({
                icon: "success",
                title: `Upload file thành công.`,
              });
              bangdsvanban.ajax.reload();
            }else if(res.status == 'EXIST'){
                Toast.fire({
                  icon: "warning",
                  title: "File đã tồn tại.",
                });
            }else if(res.status == "INVALID"){
              Toast.fire({
                icon: "warning",
                title: "Tên file không đúng định dạng(.doc,.docx,.pdf,.xls,.xlsx)!",
              });
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
            Toast.fire({
              icon: "error",
              title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
            });
          bangdsvanban.ajax.reload();
          },
        });
        $("#modal_id").modal("hide");
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
});


// modal add văn bản
$("#themvanban_btn").on("click",function () {
    clear_modal();
    $.ajax({
      type: "GET",
      url: "get_chi_tiet_van_ban",
      success: function (res) {
        console.log(res.tentruong)
    $("#modal_title").text("Thêm văn bản");
        html = `<div class="form-group">
            <label for="modal_truong_select">Chọn trường</label>
            <select id="modal_truong_select" class="form-control select2"></select>
            </div>
            <div class="form-group">
              <label for="modal_nguoidangtai_select">Người đăng tải</label>
              <select class="form-control select2" id="modal_nguoidangtai_select"></select>
            </div>
            <div class="form-group">
              <label for="modal_tenvanban_input">Tên văn bản</label>
              <input type="text" class="form-control" id="modal_tenvanban_input" />
            </div>
          <script>
            $(".select2").select2({
              theme: "bootstrap",
              dropdownParent: $("#modal_id")
            });
          </script>`;
        $("#modal_body").append(html);
        $.each(res.tentruong, function (idx, val) {
          $("#modal_truong_select").append(
            '<option value="' + val.id + '">' + val.ten + "</option>"
          );
        });
        $.each(res.nguoidangtai, function (idx, val) {
          $("#modal_nguoidangtai_select").append(
            '<option value="' + val.id + '">' + val.hoten + "</option>"
          );
        });
        $("#modal_footer").append(
          '<button type="button" class="btn btn-primary" id="modal_submit_btn"><i class="fa-solid fa-floppy-disk"></i> Lưu</button>'
        );
        $("#modal_id").modal("show");
        
        $("#modal_submit_btn").on("click", function () {
          let idtruong = $("#modal_truong_select").val();
          let ndt = $("#modal_nguoidangtai_select").val();
          let tenvanban = $("#modal_tenvanban_input").val();
        $.ajax({
          type: `POST`,
          url: `them_vanban?tenvanban=${tenvanban}&ndt=${ndt}&idtruong=${idtruong}&isDeleted=0`,
          success: function (res) {
            if(res.status == 'OK'){
              Toast.fire({
                icon: "success",
                title: `Đã thêm văn bản`,
              });
              bangdsvanban.ajax.reload();
            }else if(res.status == 'EXIST'){
                Toast.fire({
                  icon: "warning",
                  title: "Tên văn bản đã tồn tại.",
                });
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
            Toast.fire({
              icon: "error",
              title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
            });
          bangdsvanban.ajax.reload();
          },
        });
        $("#modal_id").modal("hide");
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
});

//modal update --loading
$("#bangdsvanban").on("click", "#editBtn", function () {
  let id = $(this).data("id");
  clear_modal();
  $.ajax({
    type: "GET",
    url: "get_chi_tiet_van_ban_by_id?id=" + parseInt(id),
    success: function (res) {
      $("#modal_title").text("Chỉnh sửa văn bản");
      let html = `
        <div class="form-group">
          <label for="modal_tenvanban_input">Tên văn bản</label>
          <input type="text" class="form-control" id="modal_tenvanban_input" value="${res.tenvanban}" required/>
        </div>
        <div class="form-group">
          <label for="modal_duongdan_input">Choose file (PDF, Word, Excel)</label>
          <input type="file" class="form-control-file" id="modal_duongdan_input" accept=".pdf,.doc,.docx,.xls,.xlsx" multiple>
        </div>
        <script>
          $(".select2").select2({
            theme: "bootstrap",
            dropdownParent: $("#modal_id")
          });
        </script>
      `;
      $("#modal_body").append(html);
      /*$.each(res.tenvanban, function (idx, val) {
        $("#modal_tenvanban_input").append(
          '<option value="' + val.id + '">' + val.tenvanban + "</option>"
        );
      });*/
      $("#modal_footer").append(
        `<button type="button" class="btn btn-primary" id="modal_submit_vanban_btn">
            <i class="fa-solid fa-floppy-disk"></i>
            Lưu thay đổi
          </button>`
      );
      // Show the modal
      $("#modal_id").modal("show");

      $("#modal_submit_vanban_btn").on("click", function () {
        var formData = new FormData()
        let data = $("#modal_duongdan_input")[0].files[0];
        let tenvanban = $("#modal_tenvanban_input").val();
        if (tenvanban) {
          formData.append("tenvanban", tenvanban);
        }
        if (data) {
          formData.append("files", data);
        }
        $.ajax({
          type: `POST`,
          url: `update_chi_tiet_van_ban_by_id?id=${id}`,
          data: formData,
          contentType: false,
          processData: false,
          success: function (res) {
            console.log(res);
            if (res.status == "OK") {
              Toast.fire({
                icon: "success",
                title: `Cập nhật thành công.`,
              });
              $("#modal_id").modal("hide");
              bangdsvanban.ajax.reload();
            } else if(res.status == "NOT_UPDATE") {
              Toast.fire({
                icon: "warning",
                title: "Tên văn bản đã được thêm trước đó. Vui lòng chọn tên khác.",
              });
            }else if(res.status == "INVALID"){
              Toast.fire({
                icon: "warning",
                title: "File không đúng định dạng",
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


//delete file
$('#bangdsvanban').on('click', '.delete-file', function() {
  let fileId = $(this).data('file-id');
  
  Swal.fire({
      title: 'XÁC NHẬN!',
      text: "Bạn chắc chắn muốn xóa file này?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa'
  }).then((result) => {
      if (result.isConfirmed) {
          $.ajax({
              type: "POST",
              url: `xoa_file_by_id?fileid=${fileId}`,
              contentType: "application/json",
              success: function(res) {
                if (res.status == "OK") {
                  Toast.fire({
                      icon: 'success',
                      title: `Xóa thành công.`
                  });
                  bangdsvanban.ajax.reload(); // Tải lại bảng dữ liệu
              } else {
                  Swal.fire({
                      icon: 'warning',
                      title: 'Lỗi!',
                  });
              }
              },
              error: function(xhr, status, error) {
                  Toast.fire({
                      icon: 'error',
                      title: 'Error deleting file. Please try again later.',
                  });
              }
          });
      }
  });
});

//delete văn bản --loading
$("#bangdsvanban").on("click", "#deleteBtn", function () {
  let id = $(this).data("id");

  Swal.fire({
    title: "Bạn muốn xóa văn bản số " + id,
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "update_xoa_van_ban_by_id?id=" + parseInt(id),
        success: function (res) {
          if(res.status == 'OK'){
            Toast.fire({
              icon: "success",
              title: "Đã xoá",
            });
            bangdsvanban.ajax.reload();
          }else{
            Toast.fire({
              icon: "warning",
              title: "Văn bản đang được sử dụng!"
            });
          }
        },
        error: function (xhr, status, error) {
          Toast.fire({
            icon: "error",
            title: "Xoá không thành công.",
          });
        },
      });
    }
  });
});


// Select all/none checkboxes
$("#bangdsvanban").on("click", function () {
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
      $("#xoadanhmucvanbanBtn").prop("disabled", false);
    } else {
      $("#xoadanhmucvanbanBtn").prop("disabled", true);
    }
  }
});

//xoa bieu mau vĩnh viễn
$("#xoadanhmucvanbanBtn").on("click", function () {
  let idList = $("#child-checkbox:checked")
    .map(function () {
      return $(this).data("id");
    })
    .get();
  if (idList.length == 0) {
    Toast.fire({
      icon: "warning",
      title: `Vui lòng chọn văn bản cần xóa.`,
    });
  } else {
    Swal.fire({
      title: `Xác nhận xóa văn bản?`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: `POST`,
          url: `delete_vanban_by_id_list?idList=${idList}`,
          contentType: "application/json",
          success: function (res) {
            console.log(res);
            if (res.status == "OK") {
              Toast.fire({
                icon: "success",
                title: `Đã xóa văn bản.`,
              });
              bangdsvanban.ajax.reload();
            } else {
              Toast.fire({
                icon: "warning",
                title: "Không thể xóa văn bản đang được sử dụng.",
              });
              bangdsvanban.ajax.reload();
            }
          },
          error: function (xhr, status, error) {
            console.error("Error:", status, error);
            Toast.fire({
              icon: "error",
              title: `Đã xảy ra lỗi. Vui lòng thử lại sau.`,
            });
            bangdsvanban.ajax.reload();
          },
        });
      }
    });
  }
});