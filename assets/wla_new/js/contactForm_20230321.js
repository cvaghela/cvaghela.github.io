
// function submit_form(){
//    // var datastring = $("#career_form").serialize();
//    var formData = new FormData($("#formDetails")[0]);
//    var origin = window.location.origin;
//    var slug = $("#form-slug").val();
//    var url=origin+"/addo/form_submit/"+slug;
//       $.ajax({
//          type: "POST",
//          url: url,
//          data: formData,
//          dataType: "json",
//          // contentType: 'multipart/form-data',
//          success: function(data) {
//            if(data['status']==1){
//               alert("Success: "+data['msg']);
// 	      //$("#formDetails").trigger("reset");
// 		      return;
//            }else{
//             alert("Error: "+data['msg']);
// 		      return;
//            }
//          },
//          error: function() {
//             alert('Kindly Fill All Fields.');
//          }
//       });
// }



$(document).ready(function(e) {
   $("#formDetails").submit(function(eve) {
      var origin = window.location.origin;
      eve.preventDefault(); 
      var slug = $("#form-slug").val();
      var url=origin+"/addo/form_submit/"+slug;
      $('#submitDetails').attr("disabled", true);
         var datastring = $("#formDetails").serialize();
         $.ajax({
             type: "POST",
             url: url,
             data: datastring,
             dataType: "json",
             success: function(data) {
                if(data.status==1){
                   //form reset
                   $("#formDetails")[0].reset();
                  $("#formStatus").html("<span style='padding: 0.5em;text-align:center;margin:.5em;display: table;background: yellow;border: 1px green dashed;border-radius: 5px;'>"+data.msg+"</span>");
                }else{
                   $("#formStatus").html("<span style='padding: 0.5em;text-align:center;margin:.5em;display: table;color:red;'>"+data.msg+"</span>");
            }
                 // do what ever you want with the server response
             },
             error: function() {
                 alert('error handling here');
             }
         });
         $('#submitDetails').attr("disabled", false);

         return false;
      })
 });


 function addChecboxValue(value,inputTag){
   var val="";
   tagName=inputTag+'-chk';
   $('input[name='+tagName+']:checked').each(function() {
     if(val==''){
       val=this.value;
     }else{
       val=val+','+this.value;
       
     }
   });
   $('#'+inputTag).val(val);
 }