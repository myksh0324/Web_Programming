$(function() {
  
  val = document.getElementById('nameDetail').innerHTML;
  val1 = document.getElementById('contentDetail').innerHTML;
  
  console.log('텍스트 내용 가져오기', val);
  

  function removeHtmlTag(text)
  {
    
  if(text != "" && text != null){
  text = text.replace(/<br>/ig, "\n"); // <br>을 엔터로 변경
  text = text.replace(/&nbsp;/ig, ""); // 공백 제거
  
  // HTML 태그제거
  text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
  
  text = text.replace(/<(no)?script[^>]*>.*?<\/(no)?script>/ig, "");
  
  text = text.replace(/<style[^>]*>.*<\/style>/ig,"");
  
  text = text.replace(/<(\”[^\”]*\”|\'[^\’]*\’|[^\’\”>])*>/ig, "");
  
  text = text.replace(/<\\w+\\s+[^<]*\\s*>/ig, "");
  text = text.replace(/&lt;/ig, "<");
  text = text.replace(/&gt;/ig, ">");
  
  text = text.replace(/\\s\\s+/ig, "");
  console.log('텍스트 내용 가져오기', text);
  
  
  }
  return text;
  };

  document.getElementById('nameDetail').innerHTML=removeHtmlTag(val);
  document.getElementById('contentDetail').innerHTML=removeHtmlTag(val1);
  
  $('.question-like-btn').click(function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('loading')) return;
    $el.addClass('loading');
    $.ajax({
      url: '/api/questions/' + $el.data('id') + '/like',
      method: 'POST',
      dataType: 'json',
      success: function(data) {
        $('.question .num-likes').text(data.numLikes);
        $('.question-like-btn').hide();
      },
      error: function(data, status) {
        if (data.status == 401) {
          alert('Login required!');
          location = '/signin';
        }
        console.log(data, status);
      },
      complete: function(data) {
        $el.removeClass('loading');
      }
    });
  });

  $('.answer-like-btn').click(function(e) {
    var $el = $(e.currentTarget);
    if ($el.hasClass('disabled')) return;
    $.ajax({
      url: '/api/answers/' + $el.data('id') + '/like',
      method: 'POST',
      dataType: 'json',
      success: function(data) {
        $el.parents('.answer').find('.num-likes').text(data.numLikes);
        $el.addClass('disabled');
      },
      error: function(data, status) {
        if (data.status == 401) {
          alert('Login required!');
          location = '/signin';
        }
        console.log(data, status);
      }
    });
  });
    



}); 