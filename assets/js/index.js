


$("#add_user").submit(function(event){
    alert("Data Successfully added!");
});



$("#update_user").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n,i){
        data[n['nama']] = n['value']
    })

    console.log(data);
    var request = {
        "url" : `http//localhost:3000/api/users/${data.id}`,
        "method" : "POST",
        "data" :data
    }
    $.ajax(request).done(function(respone){
        alert("Data Updated");
    })
})



if(window.location.pathname =="/"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")
        
        var request = {
            "url" : `http//localhost:3000/api/users/${id}`,
            "method" : "DELETE",
        }

        if(confirm("Are you sure want to delete ?")){
            $.ajax(request).done(function(respone){
                alert("Data deleted");
                location.reload();
            })
        }
    })
}