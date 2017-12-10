$(function() {
    
    val = document.getElementById('contentDetail').innerHTML;
    
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
  
    document.getElementById('contentDetail').innerHTML=removeHtmlTag(val);
});  