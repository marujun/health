/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-16
 * Time: 下午8:46
 * To change this template use File | Settings | File Templates.
 */
var pageIndex=1;

function back(){
    if(pageIndex>1){
        removeDisable();
        pageIndex=pageIndex-1;
        postPage(pageIndex,10,'back',$('#app')[0].title);
    }
    if(pageIndex==1){$('#backPage').attr( {'disabled':'disabled'});}
    console.log('pageIndex :  '+pageIndex);
}

function next(){

    var lastPageNumber=$('#pagelast').val();
    if(pageIndex<lastPageNumber){
        removeDisable();
        pageIndex=pageIndex+1;
        postPage(pageIndex,10,'next',$('#app')[0].title);
    }
    if(pageIndex==lastPageNumber){$('#nextPage').attr( {'disabled':'disabled'});}
    console.log('pageIndex :  '+pageIndex);
}

function pageDetail(index,classIndex){
    pageIndex=index;
    if(classIndex=='last'){
        $('#nextPage').attr( {'disabled':'disabled'});
        pageIndex=$('#pagelast').val();
    }
    postPage(pageIndex,10,'detail',$('#app')[0].title);
    removeDisable();
    $("#page"+classIndex).attr( {'disabled':'disabled','style': 'background-color: #f5f5f5;'});
    if(index==1){$('#backPage').attr( {'disabled':'disabled'}); }
    console.log('pageIndex :  '+pageIndex);
}
function postPage(page,limit,type,title){
    $.ajax({
        url:'getUserByPage',
        type:'post',
        data:{page:page,limit:limit,type:type,title:title,words:$('#searchWord')[0].value},
        success:function (result) {
            var users=result.users;
            console.log(result);
            if (result.status == 'success' && result.length != 0) {
                $('.userTr').remove();
                for(var i=0;i<users.length;i++){
                    $('<tr class="userTr">'+
                        '<td>'+users[i].personal.name+'</td>'+
                        '<td>'+users[i].activity.campaign+'</td>'+
                        '<td>'+users[i].personal.birthday+'</td>'+
                        '<td class="wide">'+users[i].personal.user_id+'</td>'+
                        '<td>'+users[i].personal.gender+'</td>'+
                        '<td>'+users[i].personal.height+'</td>'+
                        '<td>'+users[i].personal.mobile+'</td>'+
                        '<td>'+users[i].personal.email+'</td>'+
                        '<td>'+users[i].personal.city_id+'</td>'+
                        '<td class="wide">'+users[i].personal.address +'</td>'+
                        '<td class="wide">'+users[i].personal.note+'</td>'+
                        +'</tr>').appendTo('table');
                }
            } else {
                alert('连接不到服务器！');
            }
        }
    });
}
function removeDisable(){
    $("#pageone").attr("disabled",false);  $("#pageone").attr("style",false);
    $("#pagetwo").attr("disabled",false);  $("#pagetwo").attr("style",false);
    $("#pagethree").attr("disabled",false);$("#pagethree").attr("style",false);
    $("#pagefour").attr("disabled",false); $("#pagefour").attr("style",false);
    $("#pagefive").attr("disabled",false); $("#pagefive").attr("style",false);
    $("#pagelast").attr("disabled",false); $("#pagelast").attr("style",false);
    $("#backPage").attr("disabled",false);
    $("#nextPage").attr("disabled",false);
}