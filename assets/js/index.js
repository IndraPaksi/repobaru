


$("#add_user").submit(function (e) {
    e.preventDefault()
    const url = e.currentTarget.action
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'application/json',
        data: $("#add_user").serialize(),
        success: function (data) {
            const msg = JSON.parse(obj.responseText)
            console.log('data', msg)
            alert(msg.message);
            window.top.location = `/view-user?id=${msg.data._id}`
        },
        error: function (obj) {
            console.log('error', obj.responseText)
            const msg = JSON.parse(obj.responseText)
            alert(`Error ${msg.message} `);
        }
    });
});


$('#loginButton').submit(function(e){
    const url = '/api/usersLogin/'
    $.getJSON(url, function(respone){
        console.log(respone)
            
    });
});


$("#update_user").submit(function (event) {
    event.preventDefault();

    const url = event.currentTarget.action
    var unindexed_array = $(this).serialize();
    var data = {}

    console.log('update data', unindexed_array);
    var request = {
        "url": url,
        "method": "POST",
        "data": unindexed_array
    }

    $.ajax(request).done(function (respone) {
        alert("Data Updated");
    })
})



if (window.location.pathname == "/") {
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function () {
        var id = $(this).attr("data-id")

        var request = {
            "url": `http//localhost:3000/api/users/${id}`,
            "method": "DELETE",
        }

        if (confirm("Are you sure want to delete ?")) {
            $.ajax(request).done(function (respone) {
                alert("Data deleted");
                location.reload();
            })
        }
    })

}

$('#searchEmail').keypress(function (event) {
    if (event.keyCode == 13) {

        var request = {
            "url": '/api/usersByEmail/' + $(this).val(),
            "method": "GET",
        }
        const url = '/api/usersByEmail/' + $(this).val()
        $.getJSON(url, function (respone) {
            console.log(respone)
            if (respone.message) {
                alert(respone.message)
            } else {
                $('[name=nama]').val(respone.namaDepan + ' ' + respone.namaBelakang)
                $('[name=jeniskelamin]').val(respone.jeniskelamin)
                $('[name=nohp]').val(respone.phoneNumber1)
                $('[name=usia]').val(respone.usia)
                $('[name=TTL]').val(respone.tanggalLahir)
                $('[name=alamat]').val(respone.alamat)
                $('[name=noktp]').val(respone.nomorKtp)
                $('[name=suhu]').val(respone.suhuBadan)
                $('[name=keluhan]').val(respone.keluhan)
                $('[name=penyakit]').val(respone.penyakitPenyerta)
                $('[name=hasil]').val(respone.HasilSwab)

            }

        })
        //alert('Enter' + $(this).val())
    }
})

$('#searchButton').click(function (e) {
    const url = '/api/usersByEmail/' + $('#searchEmail').val()
    $.getJSON(url, function (respone) {
        console.log(respone)
        if (respone.message) {
            alert(respone.message)
        } else {
            $('[name=nama]').val(respone.namaDepan + ' ' + respone.namaBelakang)
            $('[name=jeniskelamin]').val(respone.jeniskelamin)
            $('[name=nohp]').val(respone.phoneNumber1)
            $('[name=usia]').val(respone.usia)
            $('[name=TTL]').val(respone.tanggalLahir)
            $('[name=alamat]').val(respone.alamat)
            $('[name=noktp]').val(respone.nomorKtp)
            $('[name=suhu]').val(respone.suhuBadan)
            $('[name=keluhan]').val(respone.keluhan)
            $('[name=penyakit]').val(respone.penyakitPenyerta)
            $('[name=hasil]').val(respone.HasilSwab)

        }

    })
    //alert('Enter' + $(this).val())
})


