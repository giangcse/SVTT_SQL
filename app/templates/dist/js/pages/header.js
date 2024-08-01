$(document).ready(function () {
    // Toast thông báo
    var Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
    });
    // Lấy toàn bộ tham số cá nhân dựa trên UID
    $.ajax({
        type: "GET",
        url: `get_all_tham_so_ca_nhan`,
        success: function (data) {
            $.each(data, function (idx, val) {
                if (val.thamso == 'DARK_MODE' && val.giatri == 1 && val.trangthai == 1) {
                    $("body").addClass("dark-mode");
                }
                if (val.thamso == 'SIDEBAR_COLLAPSE' && val.giatri == 1 && val.trangthai == 1) {
                    $("body").addClass("sidebar-collapse");
                }
            })
        },
        error: function () {
            Toast.fire({
                icon: 'error',
                title: 'Không thể load tham số cá nhân'
            })
        }
    })
});