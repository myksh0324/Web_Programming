$(function() { 
    if($('#sector').val() == 'Related_Movie'){
        $('#tt').remove();
        $('#typeE').remove();
        $('#typeOfEventEtc').remove();       
        
    }
    $("#sector").change(function() {      
        if($(this).val() == 'Related_Movie'){
            console.log("영화관련 분야입니다.");
            $('#tt').remove();
            $('#typeE').remove();    
            $('#typeOfEventEtc').remove();                   
            document.getElementById('typeOfEvent').innerHTML = "<label id='typeE' for='typeOfEvents'>Type of Movie Events</label> <select class='custom-select'id='tt' name='typeOfEvent'><option selected value='Movie Preview'>Movie Preview</option><option value='Talking about Movie'>Talking about Movie</option><option value='Watching Movie'>Watching Movie</option><option value='Events at the Cinema'>Events at the Cinema</option><option value='Volunteering at the Cinema'>Volunteering at the Cinema</option><option value='Redcarpet Travel'>Redcarpet Travel</option><option value='Visit movie Museum'>Visit movie Museum</option></select>";
        }
        else if($(this).val() == 'Etc'){
            console.log("비영화관련 분야입니다.");
            $('#tt').remove();
            $('#typeM').remove();  
            document.getElementById('typeOfEvent').innerHTML = "<label id='typeE' for='typeOfEvents'>Type of Events</label> <input class='form-control' id='typeOfEventEtc' type='text' name='typeOfEvent' placeholder='Create your Event Sector and Event type'>";    
        };
      });
    $("#money").change(function() {   
        if($(this).val() == 'free'){
            console.log("이벤트 참여비용을 무료로 선택하셨습니다.");
            $('#typeP').remove();
            $('#pp').remove();
            document.getElementById('freeOrCharge').innerHTML = "<label id='typeP' for='Price'>Price</label><select class='custom-select' id='pp' name='Price'><option selected value='0'>0</option>";    
            
        }
        else if($(this).val() == 'charged'){
            console.log("이벤트 참여비용을 유료로 선택하셨습니다.");
            $('#typeP').remove();
            $('#pp').remove();
            document.getElementById('freeOrCharge').innerHTML = "<label id='typeE' for='Price'>Price($)</label> <input class='form-control' id='Price' type='number' name='Price' placeholder='How much do you want, Only numbers can be used, base currency is dollar.'>";    
            
        };            
    });
    if($("#money").val() == 'free'){
        document.getElementById('freeOrCharge').innerHTML = "<label id='typeP' for='Price'>Price</label><select class='custom-select' id='pp' name='Price'><option selected value='free'>free</option>";        
    }

    //https://m.blog.naver.com/PostView.nhn?blogId=javaking75&logNo=220546927730&proxyReferer=https%3A%2F%2Fwww.google.co.kr%2F
    //위 사이트에서 데이트 피커 날짜 범위 설정을 배웠습니다.
    
    $.datepicker.setDefaults($.datepicker.regional['ko']); 
    
    // 시작일(fromDate)은 종료일(toDate) 이후 날짜 선택 불가
    // 종료일(toDate)은 시작일(fromDate) 이전 날짜 선택 불가

    //시작일.
    $('#SDate').datepicker({
        showOn: "both",                     // 달력을 표시할 타이밍 (both: focus or button)
        buttonImage: "images/calendar.gif", // 버튼 이미지
        buttonImageOnly : true,             // 버튼 이미지만 표시할지 여부
        buttonText: "날짜선택",             // 버튼의 대체 텍스트
        dateFormat: "yy-mm-dd",             // 날짜의 형식
        changeMonth: true,                  // 월을 이동하기 위한 선택상자 표시여부
        //minDate: 0,                       // 선택할수있는 최소날짜, ( 0 : 오늘 이전 날짜 선택 불가)
        onClose: function( selectedDate ) {    
            // 시작일(fromDate) datepicker가 닫힐때
            // 종료일(toDate)의 선택할수있는 최소 날짜(minDate)를 선택한 시작일로 지정
            $("#FDate").datepicker( "option", "minDate", selectedDate );
        }                
    });

    //종료일
    $('#FDate').datepicker({
        showOn: "both", 
        buttonImage: "images/calendar.gif", 
        buttonImageOnly : true,
        buttonText: "날짜선택",
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        //minDate: 0, // 오늘 이전 날짜 선택 불가
        onClose: function( selectedDate ) {
            // 종료일(toDate) datepicker가 닫힐때
            // 시작일(fromDate)의 선택할수있는 최대 날짜(maxDate)를 선택한 종료일로 지정 
            $("#SDate").datepicker( "option", "maxDate", selectedDate );
        }                
    });











}); 
