/**
 * Created with JetBrains WebStorm.
 * User: mrj
 * Date: 12-11-19
 * Time: 上午10:17
 * To change this template use File | Settings | File Templates.
 */
function search() {
    $.ajax({
        url:'/search',
        type:'post',
        data:{page:1,limit:10,type:'name',words:$('#searchWord')[0].value},
        success:function (result) {
            var users=result.users;
            removeDisable();
            console.log(result);
            if (result.status == 'success' && users.length != 0) {
                $('.userTr').remove();
                $('#app').attr({'title':'search'});
                $('#pagelast').attr({'value':result.pages});
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
                if (result.status == 'success') {
                    alert('未搜索到关于"' + $('#searchWord')[0].value + '"的内容')
                }else {
                    alert(result.err);
                }
            }
        }
    });
}
