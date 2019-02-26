/**
 * Created by hp on 2018/1/4.
 */
var diaryDetail={
    id:null,
    getData:function(id){
        $.ajax({
            url:base+"case/getCaseDetailInfoById.do",
            type:"get",
            data:{
                case_id:id
            },
            dataType:"json",
            success:function(res){
                var midHtml=null,html='';
              if(res.status===0) {
                  midHtml = '<h2 id="title">' + res.user_id + "的美丽日记" + '</h2>' +
                      '<div class="head-pic">' +
                      '<img src="http://img2.soyoung.com/user/20170705/6/20170705144642331.jpg" alt="头像">' +
                      '<p>' + res.user_id + '</p>' +
                      '<div>' +
                      '</div>' +
                      '</div>' +
                      '<div class="info-box">' +
                      '<ul>' +
                      '<li>' +
                      '<span>项目：</span><span>' + res.project + '</span></li>' +
                      '<li>' +
                      '<span>日期：</span><span>' + res.operTime + '</span></li>' +
                      '<li><span>医院：</span> <span>' + res.hospital_id + '</span></li>' +
                      '<li><span>医生：</span> <span>' + res.doctor_id + '</span></li>' +
                      '<li><span>价格：</span> <span>' + res.price + '</span></li>' +
                      '<li><p>手术前照片：</p><div id="imgList">' +
                      '<img src=' + imgPath + res.before_main + ' alt="" data-img=' + imgPath + res.before_main + '>' +
                      '<img src=' + imgPath + res.before_two + ' alt="" data-img=' + imgPath + res.before_two + '>' +
                      '<img src=' + imgPath + res.before_three + ' alt=""  data-img=' + imgPath + res.before_three + '></div></li></ul>' +
                      '</div>';
                  $("#diary-info").empty().append(midHtml);
                  if (res.detailList && res.detailList.length > 0) {
                      $.each(res.detailList, function (key, val) {
                          html += '<li class="diary-item">' +
                              '<span class="title">术后第' + val.oper_after_day + '天</span>' +
                              '<p>日记内容 ：       ' + val.content + ' </p>' +
                              '<p>手术后照片：</p>' +
                              '<div class="pic-list">'
                        var imgtemp= val.pic_list.split(',');
                        for(var i=0;i<imgtemp.length;i++){
                            html+='<img class="tp" src=' + imgPath + imgtemp[i] + ' alt=""  data-img=' + imgPath + imgtemp[i] + '>' +
                            '</div>'
                        }
                              
                        html +='<div class="other-thing">' +
                              '<div class="time">' +
                              '<span>' + val.addTime + '</span>' +
                              '</div>' +
                              '<div class="data-look">' +
                              '<span class="Hui-iconfont">&#xe725;&nbsp;' + val.scanNum + '</span>' +
                              '<span class="Hui-iconfont">&#xe686;&nbsp;' + val.evaluateNum + '</span>' +
                              '<span class="Hui-iconfont">&#xe66d;&nbsp;' + val.voteNum + '</span>' +
                              '</div>' +
                              '</div>' +
                              '</li>'
                      });
                      $("#diaryItem").empty().append(html);
                  }
              }else{
                  $.Huimodalalert(err.message || "查询失败!", 1500);
              }

            },
            error:function(err){
                $.Huimodalalert(err.message || "查询失败!", 1500);
            }

        });
    }

};
$(document).ready(function(){
    diaryDetail.id=window.util.getQueryString("id");
    if(diaryDetail.id){
        diaryDetail.getData(diaryDetail.id);
    }else{
        $.Huimodalalert("Id不存在！", 1500);
    }
});

$(function(){
    $(".backtrack").click(function(){
        window.history.go(-1);
      });
})