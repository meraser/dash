//test
myGlobal = {};
// myGlobal.requestArray = [];
myGlobal.dearray = [];

myGlobal.query = {
    // dev: 'project = TVCSISSUE AND labels not in ("SQI") AND issuetype in ("Field Issue", "Bug") AND Labels !=일일모니터링 AND created >= ', // AND created >= 2019-01-01',

    dev: 'project = TVCSISSUE AND ( labels not in ("SQI", "일일모니터링", "사용자리포트")  OR (labels in("PM_LINK") AND labels in (일일모니터링))) AND issuetype in ("Field Issue", "Bug") AND created >= ',
    dev2: 'project = TVCSISSUE AND labels in ("이슈분석") AND issuetype not in ("Field Issue", "Bug") AND created >= ',
    // sqi: 'project = SQITASK AND created >= ', // AND created >= 2019-01-01',
    date: '2020-01-01',
    date2: '2019-01-01',
    resolved: ' AND status in (Open)',
    inprogress: ' AND status not in (Open, Resolved, Closed)',
    resolved: ' AND status in (Resolved)',
    close: ' AND status in (Closed)',
    order: ' ORDER BY created DESC',

    // in3: ' AND created > -3d',
    // in7: ' AND created > -7d AND created <= -3d',
    // over: ' AND created <= -7d'
};
// myGlobal.conDev = myGlobal.query.dev + myGlobal.query.date;
// myGlobal.conSQI = myGlobal.query.sqi + myGlobal.query.date;


myGlobal.labels = {
    '주요이슈': '주요이슈',
    '이슈분석': '이슈분석',
    // '문제아님': 'Fissue_Solv_No',

    '현상태진행': '현상태진행',
    '차기양산대응': '차기양산대응',
    '양산즉대응': '양산즉대응',
    '양산즉대응_SU': '양산즉대응_SU',
    '정규MR대응': '정규MR대응',

    'Device수정': 'PM_LINK',
    // '업체': 'Non_Device',
    '모니터링': 'Fissue_Monitoring',
    '해외법인': 'Fissue_Oversea',
    '한국CS': 'Fissue_KRCS',
    '한국매장': 'Fissue_KRShop',
    '규제사무국': 'Fissue_VOC',
    '사업자': 'Fissue_Biz',
    '기타': 'Fissue_ETC',
    'CpAppmonitoring': 'CP/AppFissue_Monitoring',
    '지역_한국': 'CPAPP_KR',
    '지역_북미': 'CPAPP_US',
    '지역_유럽': 'CPAPP_EU',
    '지역_일본': 'CPAPP_JP',
    '지역_브라질': 'CPAPP_BR',
    '지역_중국홍콩': 'CPAPP_CNHK',
    '지역_아주중아': 'CPAPP_AJJA',
    '지역_대만콜롬비아': 'CPAPP_TWCO',
    'Type_CP수정': 'Fissue_Solv_AP',
    'Type_서버수정': 'Fissue_Solv_Server',
    'Type_현상태': 'Fissue_Solv_No',
    'Type_Spec': 'Fissue_Solv_Normal',
    'Type_HW': 'Fissue_Solv_HW',
    'Type_Duplicate': 'Fissue_Duplicate'
}

myGlobal.allIssue = {};

myGlobal.listUp = function () {

}

function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

// myGlobal.trClick = function (Ob) {
//     console.log(Ob.id);
//     myGlobal.changeHtml(Ob.id);
// }

// myGlobal.jusuk = '① 이슈 Report: 법인 및 외부로부터 이슈 입수되어 Jira 등록된 최초 상태<br>② 정보 입수 중: 개발부서 검토가 불가능한 상황으로 상세 정보 및 장비 등의 입수 필요하여 법인 요청 상황(증상 Base로 개발자 Assign 진행)<br>③ 개선안 도출 : <br>     Device 수정: TV Device 이슈로 개선되어 TVPM이 있는 상황<br>     업체: Server, CP등에서 개선된 상황<br>④ 양산변경 심의회: TV Device 수정 사항 중 심의회 결정 사항<br>⑤ 모니터링 : 법인 및 업체 장기 미회신<br>⑥ 문제아님: Spec등 문제 아님<br>⑦ Total: 전체 이슈';

myGlobal.currentBoard = '';
myGlobal.currentBA = '';
myGlobal.currentCheck = false;;
myGlobal.date2 = '';

myGlobal.date1 = '';

myGlobal.searchTXT = '';

myGlobal.saveT = function (id) {

    let tt = id.split('_')

    if (tt[1] == 'bt1') myGlobal.currentCheck = true;
    else myGlobal.currentCheck = false;
    // = !myGlobal.currentCheck;
    // myGlobal.date2 = $('#' + obj[0].id + '_date2').val();
    console.log(myGlobal.currentCheck);
    myGlobal.makeList('search__', myGlobal.currentBA);
}

myGlobal.saveD = function (id) {
    myGlobal.date2 = $('#' + id.id + ' #date2').val();
    console.log(myGlobal.date2);
}

myGlobal.saveD1 = function (id) {
    myGlobal.date1 = $('#' + id.id + ' #date1').val();
    console.log(myGlobal.date1);
}


myGlobal.currentPage = 0;
myGlobal.makeList = function (sub, obj, page) {

    myGlobal.searchTXT = $('#text_Search').val();
    let fDate = '2019-12-01';
    // myGlobal.currentCheck = false;
    if (sub == 'search__') {
        obj = myGlobal.currentBA;
        fDate = myGlobal.date1;
    } else {
        myGlobal.searchTXT = '';
        let tt = new Date();
        // myGlobal.date2 = tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate();
        tt.setHours(tt.getHours() + 9);
        myGlobal.date2 = tt.toISOString().split('T')[0];
        // myGlobal.date1 = '2019-12-01';
        let date2 = new Date(myGlobal.date2)
        date2.setFullYear(date2.getFullYear() - 1)
        myGlobal.date1 = date2.toISOString().split('T')[0];
        // console.log(myGlobal.date1)
    }
    // let inputSome = ['해외법인', '한국CS', '한국매장', '규제사무국', '사업자', '기타'];
    // let inputArea = ['지역_한국', '지역_북미', '지역_유럽', '지역_일본', '지역_브라질', '지역_중국홍콩', '지역_아주중아', '지역_대만콜롬비아'];
    // let inputType = ['Type_Device', 'Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec'];
    // let flagCheckBox = false;

    // if (inputSome.indexOf(sub) > -1) flagCheckBox = true;
    // if (inputArea.indexOf(sub) > -1) flagCheckBox = true;
    // if (inputType.indexOf(sub) > -1) flagCheckBox = true;
    //' + obj[0].id + '_
    let inputDate = '<br><input class="aui-date-picker" id="date1" name="startDate" type="date" min="2019-12-01" onchange="myGlobal.saveD1(' + obj[0].id + ')"/> ~ <input class="aui-date-picker" id="date2" name="startDate" type="date" onchange="myGlobal.saveD(' + obj[0].id + ')"/>  검색어<input type="text" id="text_Search" style="width:100px"></input> <button type="button" id="_btn" onclick="myGlobal.makeList(\'search__\' , \'null\', 0);">Search</button>'
    // let objID = ['ListInput', 'ListArea', 'ListType'];
    let objID = ['ListInput', 'ListArea'];
    let chch = ['Need2', 'Need3', 'Need4'];
    // let inputType = ['Type_Device', 'Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec'];
    let setColorFlag = false;
    if (objID.indexOf(obj[0].id) > -1 && chch.indexOf(sub) == -1) {
        // inputDate += '<input type="checkbox" id="' + obj[0].id + '_ch1" onclick="myGlobal.saveT();">  검토 중</input>  &nbsp; &nbsp; <span style="font-size:9pt">검토 중/전체 이슈 | 전체이슈 확인방법 -> 검토 중 Check Box 해제 후 Search Click</span><br>';
        // inputDate += '<input type="checkbox" id="' + obj[0].id + '_ch1" onclick="myGlobal.saveT();">  검토 중</input>';

        inputDate += '&emsp; <button id="' + obj[0].id + '_bt1" onclick="myGlobal.saveT(this.id);" class="btn default">검토 중</button>';

        inputDate += '<button id="' + obj[0].id + '_bt2" onclick="myGlobal.saveT(this.id);" class="btn default">전&emsp;체</button>';
        setColorFlag = true;
        // sub += '_I';
        if (sub != 'search__') {
            myGlobal.currentCheck = true;
        }
    }
    // else if (objID.indexOf(obj[0].id) > -1) {
    //     inputDate += '<input type="checkbox" id="' + obj[0].id + '_ch1" onclick="myGlobal.saveT();">  검토 중</input><br>';
    // }
    // else if (sub == 'search__' && !myGlobal.currentCheck) {
    //     inputDate += '<input type="checkbox" id="' + obj[0].id + '_ch1" onclick="myGlobal.saveT();">  검토 중</input><br>';
    // }

    // if (sub == 'search__') sub = myGlobal.currentBoard;
    // if (sub == myGlobal.currentBoard);
    let search_RE = null;
    if (sub == 'search__') {
        sub = myGlobal.currentBoard;
        search_RE = new RegExp(myGlobal.searchTXT, 'i');

    }
    // if (sub == myGlobal.currentBoard);

    myGlobal.currentBoard = sub;
    myGlobal.currentBA = obj;

    obj.html(sub);
    if (sub != '주요 이슈') {
        obj.append(inputDate);
    }
    if (setColorFlag) {
        if (myGlobal.currentCheck) $('#' + myGlobal.currentBA[0].id + '_bt1')[0].style.backgroundColor = '#c3c3c3';
        else $('#' + myGlobal.currentBA[0].id + '_bt2')[0].style.backgroundColor = '#c3c3c3';

    }



    if ((objID.indexOf(obj[0].id) > -1) && myGlobal.currentCheck && chch.indexOf(sub) == -1) {
        $('#' + obj[0].id + '_ch1').prop('checked', true);
        sub += '_I';
    }
    // else if(objID.indexOf(obj[0].id) > -1  )

    // 


    // $(obj.selector + ' #date1').val(fDate);
    $(obj.selector + ' #date1').val(myGlobal.date1);
    $(obj.selector + ' #date2').val(myGlobal.date2);
    $('#text_Search').val(myGlobal.searchTXT);

    let tbl = $('<table style="table-layout: fixed;" />').addClass('aui aui-table-sortable');
    let thaed = $('<thead/>');
    let headrow = $('<tr/>');
    let subit = ['Open_E', 'Progress_E', 'Resolved_E', 'etcIssue'];
    // let issues = '';
    // if (subit.indexOf(sub) > -1) issues = my
    let issues = myGlobal[sub];
    headrow.append($('<th style="width:20px"/>').text('No.'));
    headrow.append($('<th style="width:70px"/>').text('Key'));
    headrow.append($('<th style="width:300px" />').text('Summary'));
    // headrow.append($('<th style="width:100px"/>').text(''));
    headrow.append($('<th style="width:50px"/>').text('Create'));
    headrow.append($('<th style="width:50px"/>').text('Status'));
    headrow.append($('<th style="width:40px"/>').text('담당자'));
    // if (sub == '주요 이슈') headrow.append($('<th style="width:100px"/>').text('Description'));
    // headrow.append($('<th style="width:80px"/>').text('심의회'));


    thaed.append(headrow);
    tbl.append(thaed);
    // html('<a href="http://hlm.lge.com/issue/browse/' + data[i].key + '" target="_blank">' + data[i].key.split('-')[1] + '</a><br>'));
    let tb = $('<tbody/>');
    let cntt = 0;
    for (let i in issues) {

        if (issues[i].Create > myGlobal.date2) continue;
        if (issues[i].Create < fDate) continue;
        if (search_RE) {
            console.log(i);
            if ((issues[i].Description.search(search_RE) == -1) && (issues[i].Summary.search(search_RE) == -1) && (issues[i].issueDes.search(search_RE) == -1)) continue;

        }





        // let row = $('<tr id="' + i + '" onclick="myGlobal.trClick(this)"/>');

        let row = $('<tr  />');
        let row2 = $('<tr  />');
        let tempLink = '';
        if (i.indexOf('TVCSISSUE') > -1) tempLink = '"http://hlm.lge.com/qi/browse/';
        else tempLink = '"http://hlm.lge.com/issue/browse/';
        cntt++;
        row.append($('<td style="text-align:center" />').html(cntt));
        if (sub == '주요 이슈') {
            row.append($('<td style="text-align:center" />').html('<a href=' + tempLink + i + '" target="_blank"><b>' + i + '</b></a>'));
            row.append($('<td style="text-align:left" />').html('<b>' + issues[i].Summary + '</b>'));
        } else {
            row.append($('<td style="text-align:center" />').html('<a href=' + tempLink + i + '" target="_blank">' + i + '</a>'));
            row.append($('<td style="text-align:left"  />').html(issues[i].Summary));
        }
        // row.append($('<td style="text-align:left" />'));
        row.append($('<td style="text-align:center" />').html(issues[i].Create));
        if (issues[i].Status == 'Reopened' || issues[i].Status == 'Debugging' || issues[i].Status == 'In Progress' || issues[i].Status == 'Improving' || issues[i].Status == 'Reviewing') row.append($('<td style="text-align:center" />').html('In-Progress'));
        else row.append($('<td style="text-align:center" />').html(issues[i].Status)); //cheee
        row.append($('<td style="text-align:center" />').html(issues[i].Assignee));
        // if (sub == '주요 이슈') row.append($('<td style="text-align:center" />').html('상세 Click'));
        // row.append($('<td style="text-align:center" />').html(myGlobal.allIssue[i]['심의회']));

        tb.append(row);
        if (sub == '주요 이슈') {
            row2.append($('<td id="' + i + '_1" class="ctd" colspan="2" />').html('-'));
            row2.append($('<td id="' + i + '_2" class="ctd" colspan="5" />').html('-'));
            tb.append(row2);
            myGlobal.changeHtml(i);
        }


    }
    tbl.append(tb);

    obj.append(tbl);
    AJS.tablessortable.setTableSortable(AJS.$(tbl));
    AJS.$('#date1').datePicker({
        'overrideBrowserDefault': true
    });
    AJS.$('#date2').datePicker({
        'overrideBrowserDefault': true
    });

    obj.append('<div id="Des"><br></div>');
}

myGlobal.first_action = function () {
    console.log('test');
    // tvcsissue 
    let d1 = myGlobal.query.dev + myGlobal.query.date + myGlobal.query.order;
    // SQI 
    // let d2 = myGlobal.query.sqi + myGlobal.query.date + myGlobal.query.order;

    let d3 = myGlobal.query.dev2 + myGlobal.query.date2 + myGlobal.query.order;

    let devURL = 'http://hlm.lge.com/issue/rest/api/2/search';
    let qURL = 'http://hlm.lge.com/qi/rest/api/2/search/';

    let paramQ = {
        "jql": d1,
        "maxResults": "1000",
        "startAt": "0",
        "fields": ['summary', "created", "assignee", "status", 'labels', 'description', 'components', 'customfield_16500', 'resolution', 'customfield_16503', 'customfield_16502']
    };
    // let paramDEV = {
    //     "jql": d2,
    //     "maxResults": "1000",
    //     "startAt": "0",
    //     "fields": ['summary', "created", "customfield_14503", "status", 'labels', 'customfield_14407', 'customfield_14406']
    // };

    let paramE = {
        "jql": d3,
        "maxResults": "1000",
        "startAt": "0",
        "fields": ['summary', "created", "assignee", "status"]
    };

    myGlobal.loadAjax('dev', paramQ, qURL, myGlobal.loadIssue);
    // myGlobal.loadAjax('sqi', paramDEV, devURL, myGlobal.loadIssue);
    myGlobal.loadAjax('dev2', paramE, qURL, myGlobal.loadIssue);


    $.when.apply($, myGlobal.dearray).done(function (value) {
        myGlobal.dearray = [];
        console.log('done');

        myGlobal.dataSort();
        // myGlobal.makeList('주요 이슈', $('#m-risk'));
        myGlobal.disPlayIssue();

        myGlobal.makeList('allIssue', $('#ListTotal'), 0);

        $('.menu-item a').click(function (x) {
            // console.log(x.toElement.dataset.cardId)
            // let tid = x.toElement.dataset.cardId;
            if ($('#circle-Type').css('display') == 'block') $('#desCircle').css('display', 'none');
            else $('#desCircle').css('display', 'block');
            $('#ListTotal_N').html('');
            $('#ListTotal_E').html('');
            $('#ListTotal').html('');
            $('#ListArea').html('');
            $('#ListInput').html('');
            $('#ListType').html('');
            if (x.toElement.text == '전체 이슈 현황') myGlobal.makeList('allIssue', $('#ListTotal'), 0);

            // if (tid = 'm-total') $('#ListTotal').html();
            // else if (tid = 'm-select') {
            //     $('#ListArea').html();
            //     $('#ListInput').html();
            //     $('#ListType').html();
            // }
            // else if (tid = 'm-select') $('#ListTotal').html();
            // else if (tid = 'm-select') $('#ListTotal').html();
            // else if (tid = 'm-select') $('#ListTotal').html();

        })

    });
}

myGlobal.dataSort = function () {
    myGlobal['주요 이슈'] = {};
    myGlobal['Open'] = {};
    myGlobal['In-Progress'] = {};
    myGlobal['모니터링'] = {};
    myGlobal['즉대응'] = {};
    myGlobal['차기양산'] = {};
    myGlobal['MR대응'] = {};
    myGlobal['현상태진행'] = {};

    myGlobal['Device수정'] = {};
    myGlobal['CP/Server수정'] = {};

    myGlobal['문제아님'] = {};

    myGlobal['Need1'] = {};


    myGlobal['allIssue_N'] = {};
    myGlobal['Open_N'] = {};
    myGlobal['In-Progress_N'] = {};
    myGlobal['모니터링_N'] = {};
    myGlobal['즉대응_N'] = {};
    myGlobal['차기양산_N'] = {};
    myGlobal['MR대응_N'] = {};
    myGlobal['현상태진행_N'] = {};

    myGlobal['Device수정_N'] = {};
    myGlobal['CP/Server수정_N'] = {};

    myGlobal['문제아님_N'] = {};

    myGlobal['Need1_N'] = {};

    // myGlobal['allIssue_E'] = {};
    myGlobal['Open_E'] = {};
    myGlobal['In-Progress_E'] = {};
    myGlobal['Resolved_E'] = {};


    myGlobal['allIssue_I'] = {};
    // myGlobal['즉대응_E'] = {};
    // myGlobal['차기양산_E'] = {};
    // myGlobal['MR대응_E'] = {};
    // myGlobal['현상태진행_E'] = {};

    // myGlobal['Device수정_E'] = {};
    // myGlobal['CP/Server수정_E'] = {};

    // myGlobal['문제아님_E'] = {};

    // myGlobal['Need1_E'] = {};

    for (let i in myGlobal.labels) {
        myGlobal.labels[i] = myGlobal.labels[i].toLowerCase();
    }
    let ai = myGlobal.allIssue;
    for (let i in ai) {
        ai[i].Labels = ai[i].Labels.map(function (x) {
            return x.toLowerCase()
        });
        // ai[i]
        // let curIssue = ai[i];

        if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['allIssue_N'][i] = ai[i];
        // if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['allIssue_E'][i] = ai[i];


        if (ai[i].Labels.indexOf(myGlobal.labels['주요이슈']) > -1) {
            myGlobal['주요 이슈'][i] = ai[i];
        }

        if (ai[i].Status == 'Open') {
            myGlobal['allIssue_I'][i] = ai[i];
            myGlobal['Open'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['Open_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['Open_E'][i] = ai[i];
            continue;
        } //Reopened
        if (ai[i].Status == 'Reopened' || ai[i].Status == 'Debugging' || ai[i].Status == 'In Progress' || ai[i].Status == 'Improving' || ai[i].Status == 'Reviewing') {
            myGlobal['allIssue_I'][i] = ai[i];
            myGlobal['In-Progress'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['In-Progress_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['In-Progress_E'][i] = ai[i];
            continue;
        }
        if (ai[i].Labels.indexOf(myGlobal.labels['모니터링']) > -1) {
            myGlobal['모니터링'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['모니터링_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['모니터링_E'][i] = ai[i];
            continue;
        }
        if ((ai[i].Labels.indexOf(myGlobal.labels['Type_Spec']) > -1) || (ai[i].Labels.indexOf(myGlobal.labels['Type_현상태']) > -1) || (ai[i].Resol.indexOf('Duplicate (중복 문제 발생)') > -1) || (ai[i].Labels.indexOf(myGlobal.labels['Type_HW']) > -1) || (ai[i].Labels.indexOf(myGlobal.labels['Type_Duplicate']) > -1)) {
            // if ((ai[i].Labels.indexOf(myGlobal.labels['Type_Spec']) > -1) || (ai[i].Labels.indexOf(myGlobal.labels['Type_현상태']) > -1)) {
            myGlobal['문제아님'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['문제아님_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['문제아님_E'][i] = ai[i];
            continue;
        }




        if (ai[i].Labels.indexOf(myGlobal.labels['양산즉대응']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['양산즉대응_SU']) > -1) {
            ai[i]['심의회'] = '양산즉대응';
            myGlobal['즉대응'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['즉대응_N'][i] = ai[i]; //
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['즉대응_E'][i] = ai[i];
            continue;
        }

        if (ai[i].Labels.indexOf(myGlobal.labels['차기양산대응']) > -1) {
            ai[i]['심의회'] = '차기양산대응';
            myGlobal['차기양산'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['차기양산_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['차기양산_E'][i] = ai[i];

            continue;
        }

        if (ai[i].Labels.indexOf(myGlobal.labels['정규MR대응']) > -1) {
            ai[i]['심의회'] = '정규MR대응';
            myGlobal['MR대응'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['MR대응_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['MR대응_E'][i] = ai[i];

            continue;
        }

        if (ai[i].Labels.indexOf(myGlobal.labels['현상태진행']) > -1) {
            ai[i]['심의회'] = '현상태진행';
            myGlobal['현상태진행'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['현상태진행_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['현상태진행_E'][i] = ai[i];
            continue;
        }

        if (ai[i].Labels.indexOf(myGlobal.labels['Device수정']) > -1) {
            myGlobal['Device수정'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['Device수정_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['Device수정_E'][i] = ai[i];
            continue;
        }

        if (ai[i].Labels.indexOf(myGlobal.labels['Type_CP수정']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['Type_서버수정']) > -1) {
            myGlobal['CP/Server수정'][i] = ai[i];
            if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['CP/Server수정_N'][i] = ai[i];
            // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['CP/Server수정_E'][i] = ai[i];
            continue;
        }

        myGlobal['Need1'][i] = ai[i];
        if (ai[i].Ftype == 'Field Claim' && ai[i].Stype == 'SW') myGlobal['Need1_N'][i] = ai[i];
        // else if (ai[i].Ftype == 'Request' && (ai[i].Labels.indexOf(myGlobal.labels['이슈분석']) > -1)) myGlobal['Need1_E'][i] = ai[i];
    }

    let inputSome = ['해외법인', '한국CS', '한국매장', '규제사무국', '사업자', '기타', 'CpAppmonitoring'];

    myGlobal['Need2'] = {};
    for (let i in inputSome) {
        myGlobal[inputSome[i]] = {};
        myGlobal[inputSome[i] + '_I'] = {};
    }


    for (let i in ai) {
        let inputFlag = true;
        for (let j in inputSome) {
            if (ai[i].Labels.indexOf(myGlobal.labels[inputSome[j]]) > -1) {
                // if (.Labels.indexOf(myGlobal.labels[inputSome[j]]) > -1) { ai[i]
                myGlobal[inputSome[j]][i] = ai[i];
                inputFlag = false;
                // continue;
                if (ai[i].Status == 'Reopened' || ai[i].Status == 'Open' || ai[i].Status == 'Debugging' || ai[i].Status == 'In Progress' || ai[i].Status == 'Improving' || ai[i].Status == 'Reviewing') {
                    myGlobal[inputSome[j] + '_I'][i] = ai[i];
                }
            }
            // else {
            //     myGlobal['Need2'][i] = ai[i];
            // }
        }
        if (inputFlag) myGlobal['Need2'][i] = ai[i];

    }

    let inputArea = ['지역_한국', '지역_북미', '지역_유럽', '지역_일본', '지역_브라질', '지역_중국홍콩', '지역_아주중아', '지역_대만콜롬비아', '지역_모니터링'];
    let areaForTVCS = ['한국', '북미', '구주/CIS', '일본', '중남미(브라질)', '중국/홍콩', '아주/중아', '대만/콜롬비아', '모니터링'];

    myGlobal['Need3'] = {};
    for (let i in inputArea) {
        myGlobal[inputArea[i]] = {};
        myGlobal[inputArea[i] + '_I'] = {};
    }

    for (let i in ai) {
        let inputFlag = true;
        let areacount = 0;
        // if (i.indexOf('SQI') > -1) {
        if (i.indexOf('SQI') < -1) {
            // for (let i in ai) {
            for (let j in inputArea) {
                if (ai[i].Labels.indexOf(myGlobal.labels[inputArea[j]]) > -1) {
                    myGlobal[inputArea[j]][i] = ai[i];
                    inputFlag = false;
                    areacount++;
                    // continue;
                    if (ai[i].Status == 'Reopened' || ai[i].Status == 'Open' || ai[i].Status == 'Debugging' || ai[i].Status == 'In Progress' || ai[i].Status == 'Improving' || ai[i].Status == 'Reviewing') {
                        myGlobal[inputArea[j] + '_I'][i] = ai[i];
                    }
                }
                // else myGlobal['Need3'][i] = ai[i];
                // }
            }
        } else {
            // for (let i in ai) {
            // console.log(i);
            for (let j in inputArea) {

                if (ai[i].Area.indexOf(areaForTVCS[j]) > -1) {
                    myGlobal[inputArea[j]][i] = ai[i];
                    inputFlag = false;
                    areacount++;

                    if (ai[i].Status == 'Reopened' || ai[i].Status == 'Open' || ai[i].Status == 'Debugging' || ai[i].Status == 'In Progress' || ai[i].Status == 'Improving' || ai[i].Status == 'Reviewing') {
                        myGlobal[inputArea[j] + '_I'][i] = ai[i];
                    }
                }
                // else myGlobal['Need3'][i] = ai[i];
            }
            // }

        }
        if (inputFlag) myGlobal['Need3'][i] = ai[i];
        // if (areacount > 1) console.log('over' + i);


    }
    // myGlobal['Type_Device'] = myGlobal['Device수정'];
    myGlobal['Type_All'] = {};
    myGlobal['Type_Device'] = {};
    // myGlobal['Type_Device_I'] = {}
    let inputType = ['Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec'];
    myGlobal['Need4'] = {};

    for (let i in inputType) {
        myGlobal[inputType[i]] = {};
        // myGlobal[inputType[i] + '_I'] = {};
    }

    for (let i in ai) {
        let inputFlag = true;

        if ((ai[i].Labels.indexOf(myGlobal.labels['모니터링']) > -1)) continue;

        //(ai[i].Resol.indexOf('Duplicate (중복 문제 발생)') > -1)
        if (ai[i].Status == 'Reopened' || ai[i].Status == 'Open' || ai[i].Status == 'Debugging' || ai[i].Status == 'In Progress' || ai[i].Status == 'Improving' || ai[i].Status == 'Reviewing') continue;

        if (ai[i].Labels.indexOf(myGlobal.labels['Device수정']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['현상태진행']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['차기양산대응']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['양산즉대응']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['양산즉대응_SU']) > -1 || ai[i].Labels.indexOf(myGlobal.labels['정규MR대응']) > -1) {

            if ((ai[i].Resol.indexOf('Duplicate (중복 문제 발생)') == -1)) {
                myGlobal['Type_Device'][i] = ai[i];
                myGlobal['Type_All'][i] = ai[i];
                inputFlag = false;
            } else if ((ai[i].Resol.indexOf('Duplicate (중복 문제 발생)') > -1)) {
                myGlobal['Type_현상태'][i] = ai[i];
                myGlobal['Type_All'][i] = ai[i];
                inputFlag = false;

            }

        }
        //  else myGlobal['Need4'][i] = ai[i];
        // for 문 제거 (중복 제거 용)
        for (let j in inputType) {

            if (ai[i].Labels.indexOf(myGlobal.labels[inputType[j]]) > -1) {

                myGlobal[inputType[j]][i] = ai[i];
                myGlobal['Type_All'][i] = ai[i];
                inputFlag = false;
                continue;

                // else inputFlag = false;
            }
            // else myGlobal['Need4'][i] = ai[i];
        }

        if ((ai[i].Labels.indexOf(myGlobal.labels['Type_HW']) > -1) || (ai[i].Labels.indexOf(myGlobal.labels['Type_Duplicate']) > -1)) {

            // myGlobal[inputType[j]][i] = ai[i];
            myGlobal['Type_현상태'][i] = ai[i];
            myGlobal['Type_All'][i] = ai[i];
            inputFlag = false;

            // else inputFlag = false;
        }

        if (inputFlag && (ai[i].Labels.indexOf(myGlobal.labels['모니터링']) == -1)) myGlobal['Need4'][i] = ai[i];
    }


    for (let i in myGlobal.etcIssue) {
        if (myGlobal.etcIssue[i].Status == 'Open') {
            myGlobal['Open_E'][i] = myGlobal.etcIssue[i];
            continue;
        }
        if (myGlobal.etcIssue[i].Status == 'Reopened' || myGlobal.etcIssue[i].Status == 'Debugging' || myGlobal.etcIssue[i].Status == 'In Progress' || myGlobal.etcIssue[i].Status == 'Improving' || myGlobal.etcIssue[i].Status == 'Reviewing') {
            myGlobal['In-Progress_E'][i] = myGlobal.etcIssue[i];
            continue;
        }
        myGlobal['Resolved_E'][i] = myGlobal.etcIssue[i];

    }
}

myGlobal.disPlayIssue = function () {

    let issueArray = ['주요 이슈', 'Open', 'In-Progress', '모니터링'];
    for (let i in issueArray) {
        $('#' + issueArray[i]).text(Object.keys(myGlobal[issueArray[i]]).length);
        if (i > 0) $('#' + issueArray[i] + '_N').text(Object.keys(myGlobal[issueArray[i] + '_N']).length);
        // if (i > 0) $('#' + issueArray[i] + '_E').html(Object.keys(myGlobal[issueArray[i] + '_E']).length);
    }
    let issueArrayStack = ['allIssue', '문제아님'];
    for (let i in issueArrayStack) {
        $('#' + issueArrayStack[i]).text(Object.keys(myGlobal[issueArrayStack[i]]).length);
        $('#' + issueArrayStack[i] + '_N').text(Object.keys(myGlobal[issueArrayStack[i] + '_N']).length);
        // $('#' + issueArrayStack[i] + '_E').html(Object.keys(myGlobal[issueArrayStack[i] + '_E']).length);
    }
    let textIssueArray = ['Device수정'];
    for (let i in textIssueArray) {
        $('#' + textIssueArray[i]).text(textIssueArray[i] + ': ' + Object.keys(myGlobal[textIssueArray[i]]).length);
        $('#' + textIssueArray[i] + '_N').text(textIssueArray[i] + ': ' + Object.keys(myGlobal[textIssueArray[i] + '_N']).length);
        // $('#' + textIssueArray[i] + '_E').html(textIssueArray[i] + ': ' + Object.keys(myGlobal[textIssueArray[i] + '_E']).length);
    }
    let textIssueArrayStack = ['즉대응', '차기양산', 'MR대응', '현상태진행', 'CP/Server수정'];
    for (let i in textIssueArrayStack) {
        $('#' + textIssueArrayStack[i].replace('/', '\\/')).text(textIssueArrayStack[i] + ': ' + Object.keys(myGlobal[textIssueArrayStack[i]]).length);
        $('#' + textIssueArrayStack[i].replace('/', '\\/') + '_N').text(textIssueArrayStack[i] + ': ' + Object.keys(myGlobal[textIssueArrayStack[i] + '_N']).length);
        // $('#' + textIssueArrayStack[i].replace('/', '\\/') + '_E').html(textIssueArrayStack[i] + ': ' + Object.keys(myGlobal[textIssueArrayStack[i] + '_E']).length);
    }

    let inputSome = ['해외법인', '한국CS', '한국매장', '규제사무국', '사업자', '기타', 'CpAppmonitoring', 'allIssue'];
    let inputArea = ['지역_한국', '지역_북미', '지역_유럽', '지역_일본', '지역_브라질', '지역_중국홍콩', '지역_아주중아', '지역_대만콜롬비아', '지역_모니터링'];
    let inputType = ['Type_Device', 'Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec', 'Type_All'];

    for (let i in inputSome) {
        let textTemp = Object.keys(myGlobal[inputSome[i] + '_I']).length + '/' + Object.keys(myGlobal[inputSome[i]]).length;
        $('#' + inputSome[i] + ' text').text(textTemp);

    }

    for (let i in inputArea) {
        let textTemp = Object.keys(myGlobal[inputArea[i] + '_I']).length + '/' + Object.keys(myGlobal[inputArea[i]]).length;
        $('#' + inputArea[i] + ' text').text(textTemp);

    }

    for (let i in inputType) {
        // let textTemp = Object.keys(myGlobal[inputType[i] + '_I']).length + '/' + Object.keys(myGlobal[inputType[i]]).length;
        let textTemp = Object.keys(myGlobal[inputType[i]]).length;
        $('#' + inputType[i] + ' text').text(textTemp);

    }

    let etcArray = ['Open_E', 'In-Progress_E', 'Resolved_E', 'etcIssue'];
    for (let i in etcArray) {
        $('#' + etcArray[i]).text(Object.keys(myGlobal[etcArray[i]]).length);

    }

}

myGlobal.etcIssue = {};

myGlobal.loadIssue = function (i, data, deferred) {
    // row.append($('<td class="ctd" />').html(myGlobal.allIssue[i].iDesHTML));
    // row.append($('<td class="ctd" />').html(ma[i].DesHTML));

    let arr = data.issues;
    if (i == 'dev') {
        // console.log(data);
        for (let i in arr) {
            let tempKey = arr[i].key;
            myGlobal.allIssue[tempKey] = {};
            let ar = arr[i].fields;
            myGlobal.allIssue[tempKey].Summary = ar.summary;
            myGlobal.allIssue[tempKey].Create = ar.created.split('T')[0];
            myGlobal.allIssue[tempKey].Status = ar.status.name;
            if (ar.description) myGlobal.allIssue[tempKey].Description = ar.description;
            else myGlobal.allIssue[tempKey].Description = '';

            if (ar.customfield_16500) myGlobal.allIssue[tempKey].issueDes = ar.customfield_16500;
            else myGlobal.allIssue[tempKey].issueDes = '';
            if (ar.assignee) myGlobal.allIssue[tempKey].Assignee = ar.assignee.displayName.split(' ')[0];
            else myGlobal.allIssue[tempKey].Assignee = 'Empty';
            myGlobal.allIssue[tempKey].Labels = ar.labels;
            if (ar.components) myGlobal.allIssue[tempKey].Area = ar.components[0].description;
            else myGlobal.allIssue[tempKey].Area = 'Empty';
            if (ar.resolution) myGlobal.allIssue[tempKey].Resol = ar.resolution.name;
            else myGlobal.allIssue[tempKey].Resol = 'Empty';
            if (ar.customfield_16503) myGlobal.allIssue[tempKey].Ftype = ar.customfield_16503.value;
            else myGlobal.allIssue[tempKey].Ftype = 'Empty';
            if (ar.customfield_16502) myGlobal.allIssue[tempKey].Stype = ar.customfield_16502.value;
            else myGlobal.allIssue[tempKey].SType = 'Empty';
            myGlobal.allIssue[tempKey].iDesHTML = 'Empty';
            myGlobal.allIssue[tempKey].DesHTML = 'Empty';
        }

        myGlobal.dResolve(deferred);

    }
    // else if (i == 'sqi') {
    //     // console.log(data);
    //     for (let i in arr) {
    //         let tempKey = arr[i].key;
    //         myGlobal.allIssue[tempKey] = {};
    //         let ar = arr[i].fields;
    //         myGlobal.allIssue[tempKey].Summary = ar.summary;
    //         myGlobal.allIssue[tempKey].Create = ar.created.split('T')[0];
    //         myGlobal.allIssue[tempKey].Status = ar.status.name;
    //         if (ar.customfield_14407) myGlobal.allIssue[tempKey].Description = ar.customfield_14407;
    //         else myGlobal.allIssue[tempKey].Description = '';
    //         if (ar.customfield_14406) myGlobal.allIssue[tempKey].issueDes = ar.customfield_14406;
    //         else myGlobal.allIssue[tempKey].issueDes = '';
    //         if (ar.customfield_14503) myGlobal.allIssue[tempKey].Assignee = ar.customfield_14503[0].displayName.split(' ')[0];
    //         else myGlobal.allIssue[tempKey].Assignee = 'Empty';
    //         myGlobal.allIssue[tempKey].Labels = ar.labels;
    //         myGlobal.allIssue[tempKey].Resol = 'Empty';
    //         myGlobal.allIssue[tempKey].Ftype = 'Field Claim';
    //         myGlobal.allIssue[tempKey].Stype = 'SW';
    //         myGlobal.allIssue[tempKey].iDesHTML = 'Empty';
    //         myGlobal.allIssue[tempKey].DesHTML = 'Empty';
    //     }
    //     myGlobal.dResolve(deferred);
    // } 
    else if (i == 'dev2') {
        for (let i in arr) {
            let tempKey = arr[i].key;
            myGlobal.etcIssue[tempKey] = {};
            let ar = arr[i].fields;
            myGlobal.etcIssue[tempKey].Summary = ar.summary;
            myGlobal.etcIssue[tempKey].Create = ar.created.split('T')[0];
            myGlobal.etcIssue[tempKey].Status = ar.status.name;
            if (ar.customfield_14503) myGlobal.etcIssue[tempKey].Assignee = ar.customfield_14503[0].displayName.split(' ')[0];
            else myGlobal.etcIssue[tempKey].Assignee = 'Empty';
            // myGlobal.allIssue[tempKey].iDesHTML = 'Empty';
            // myGlobal.allIssue[tempKey].DesHTML = 'Empty';

        }
        myGlobal.dResolve(deferred);

    }
    else console.log('unkown...issue plz check again..');
}
myGlobal.loadAjax = function (index, param, searchURL, myFunction) {

    //function loadAjax(param, searchURL, myFunction) {
    let deferred = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred); //deferred 배열에 저장, 모든 요청에 대한 종료 확인 후 다음 실행을 위해서 

    let request = $.ajax({
        url: searchURL,
        contentType: 'application/json',
        type: "POST",
        data: JSON.stringify(param),
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data, textStatus, jqXHR) { //요청 load 시
            myFunction(index, data, deferred);
        },
        error: function (jqXHR, errorThrown) {
            console.log('error:' + errorThrown);
        }
    });

    // myGlobal.requestArray.push(request); //Ajax 요청 배열에 저장 	
    return deferred.promise(); //deferred Jqeury Ajax에서 종료 시점을 위한 기능
}

myGlobal.dResolve = function (deferred) {
    let per = 0;
    for (let i in myGlobal.dearray) {
        if (myGlobal.dearray[i].state() == "resolved") per++;
    }
    console.log((per / myGlobal.dearray.length).toFixed(2));
    // let tempPer = (per / myGlobal.dearray.length * 100).toFixed(0);
    // $('#viewTVPM').html(tempPer + '%');
    // let cssTxt = 'linear-gradient(to right, #ffcc00 ' + tempPer + '%, #ffffff ' + (tempPer * 1 + 1) + '%)';
    // $('#viewTVPM').css('background', cssTxt)
    deferred.resolve();
}

window.onload = function () {
    require("atlassian/analytics/user-activity-xhr-header").uninstall();

    let deferred1 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred1);
    $("#m-total").load("http://collab.lge.com/main/download/attachments/1085010220/t.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');
            let tt = 'onclick="myGlobal.makeList(this.id, $(\'#ListTotal\'), 0);" style="cursor: pointer;"';


            // $('#waitApply').html('-<span id="즉대응" ' + tt + '>xx</span><br>-<span id="차기양산" ' + tt + '>xx</span><br>-<span id="MR대응" ' + tt + '>xx</span><br>-<span id="현상태진행" ' + tt + '>xx</span>');
            // $('#resolve').html('<tr id="Device수정" ' + tt + '>Device 수정: xx</tr><br><tr id="업체" ' + tt + '>업체: xx</tr>');
            //
            myGlobal.dResolve(deferred1);
        } else alert('Press F5');
    });
    let deferred2 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred2);
    $("#circle-input").load("http://collab.lge.com/main/download/attachments/1085010220/circle_input.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');
            myGlobal.dResolve(deferred2);
        } else alert('Press F5');
    });
    let deferred3 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred3);
    $("#circle-area").load("http://collab.lge.com/main/download/attachments/1085010220/circle_area.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');
            myGlobal.dResolve(deferred3);
        } else alert('Press F5');
    });
    let deferred4 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred4);
    $("#circle-Type").load("http://collab.lge.com/main/download/attachments/1085010220/circle_type.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');
            myGlobal.dResolve(deferred4);
        } else alert('Press F5');
    });

    let deferred5 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred1);
    $("#riskTable").load("http://collab.lge.com/main/download/attachments/1085010220/t1.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');

            myGlobal.dResolve(deferred5);
        } else alert('Press F5');
    });

    let deferred6 = $.Deferred(); // deferred Jqeury Ajax에서 종료 시점을 위한 기능
    myGlobal.dearray.push(deferred1);
    $("#etcTable").load("http://collab.lge.com/main/download/attachments/1085010220/t2.html", function (responseTxt, statusTxt, xhr) {

        if (statusTxt == 'success') {
            console.log('load');

            myGlobal.dResolve(deferred6);
        } else alert('Press F5');
    });
    $.when.apply($, myGlobal.dearray).done(function (value) {
        myGlobal.dearray = [];
        console.log('done');

        myGlobal.first_action();
    });
}


myGlobal.changeHtml = function (key) {
    // ff = "1. 검토 현황 (날짜,내용,담당자 History 기록)\r\n01/17: 출하품질보증팀으로 이슈 입수함, 북미향/한국향 확인 시 OSD 오류 확인 -> System App팀에 검토 요청\r\n\r\n2. 이슈 및 고객 대응\r\n1) 원인 : 파악 중\r\n2) 대응 : 확인 중\r\n\r\n!네크워크.png|width=600, height=400!";
    $("#Des").html('Loading...');
    let ff = myGlobal.allIssue[key].Description;
    let ff2 = myGlobal.allIssue[key].issueDes;
    let rere;
    let rere2;
    $.ajax({
        contentType: 'application/json',
        type: 'POST',
        url: 'http://hlm.lge.com/qi/rest/api/1.0/render',
        data: JSON.stringify({
            rendererType: "atlassian-wiki-renderer",
            unrenderedMarkup: ff,
            issueKey: key,

        }),
        dataType: 'html',
        success: function (response) {
            console.log(response);
            rere = response;

            rere = replaceAll(rere, 'src="/qi/secure/attachment', 'src="http://hlm.lge.com/qi/secure/attachment');
            rere = replaceAll(rere, 'src="/issue/secure/attachment', 'src="http://hlm.lge.com/issue/secure/attachment');

            // console.log(rere);
            // $("#Des").empty();
            // $("#Des").html('<br><br>' + key + ', ' + myGlobal.allIssue[key].Summary + '<br>');
            // $("#Des").append(rere);
            // return rere;
            // obj.html(rere);
            // $('#' + key + '_2').html(rere);
            // $('#' + key + '_2').html(rere);
            myGlobal.allIssue[key]['DesHTML'] = rere;
        }
    });
    $.ajax({
        contentType: 'application/json',
        type: 'POST',
        url: 'http://hlm.lge.com/qi/rest/api/1.0/render',
        data: JSON.stringify({
            rendererType: "atlassian-wiki-renderer",
            unrenderedMarkup: ff2,
            issueKey: key,

        }),
        dataType: 'html',
        success: function (response) {
            console.log(response);
            rere2 = response;

            rere2 = replaceAll(rere2, 'src="/qi/secure/attachment', 'src="http://hlm.lge.com/qi/secure/attachment');
            rere2 = replaceAll(rere2, 'src="/issue/secure/attachment', 'src="http://hlm.lge.com/issue/secure/attachment');

            // console.log(rere);
            // $("#Des").empty();
            // $("#Des").html('<br><br>' + key + ', ' + myGlobal.allIssue[key].Summary + '<br>');
            // $("#Des").append(rere);
            // return rere;
            // obj.html(rere);
            // $('#' + key + '_1').html(rere2);
            // $('#' + key + '_2').html(rere);
            myGlobal.allIssue[key]['iDesHTML'] = rere2;
        }
    });

}


myGlobal.makeTa = function () {
    $('#riskTable').html();
    let ma = myGlobal.allIssue;

    let tbl = $('<table style="table-layout: fixed;" />').addClass('aui aui-table-sortable');
    let thaed = $('<thead/>');
    let headrow = $('<tr/>');

    headrow.append($('<th style="width:20px"/>').text('No.'));
    headrow.append($('<th style="width:15%"/>').text('Summary'));
    headrow.append($('<th class"ctd" style="width:25%" />').text('문제점 상세 내용'));
    // headrow.append($('<th style="width:100px"/>').text(''));
    headrow.append($('<th style="width:720px" />').text('Description'));
    headrow.append($('<th style="width:50px"/>').text('Create'));
    headrow.append($('<th style="width:40px"/>').text('담당자'));
    // if (sub == '주요 이슈') headrow.append($('<th style="width:100px"/>').text('Description'));
    // headrow.append($('<th style="width:80px"/>').text('심의회'));


    thaed.append(headrow);
    tbl.append(thaed);
    let tb = $('<tbody/>');
    let cntt = 0;
    for (let i in ma) {
        if (ma[i].DesHTML == 'Empty') continue;
        console.log(i);

        let row = $('<tr  />');
        let tempLink = '';
        if (i.indexOf('TVCSISSUE') > -1) tempLink = '"http://hlm.lge.com/qi/browse/';
        else tempLink = '"http://hlm.lge.com/issue/browse/';
        cntt++;
        row.append($('<td style="text-align:center" />').html(cntt));
        row.append($('<td />').html('<a href=' + tempLink + i + '" target="_blank"><b>' + ma[i].Summary + '</b></a>'));
        // row.append($('<td style="text-align:left" />').html('<b>' +  + '</b>'));
        row.append($('<td class="ctd" />').html(myGlobal.allIssue[i].iDesHTML));
        row.append($('<td class="ctd" />').html(ma[i].DesHTML));

        row.append($('<td style="text-align:center" />').html(myGlobal.allIssue[i].Create));
        row.append($('<td style="text-align:center" />').html(myGlobal.allIssue[i].Assignee));
        // if (sub == '주요 이슈') row.append($('<td style="text-align:center" />').html('상세 Click'));
        // row.append($('<td style="text-align:center" />').html(myGlobal.allIssue[i]['심의회']));
        tb.append(row);
    }
    tbl.append(tb);

    $('#riskTable').append(tbl);
    AJS.tablessortable.setTableSortable(AJS.$(tbl));

}
