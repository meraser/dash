// main.js
(function(global) {
    let myGlobal = {};
    myGlobal.dearray = [];

    myGlobal.query = {
        dev: 'project = TVCSISSUE AND ( labels not in ("SQI", "일일모니터링", "사용자리포트")  OR (labels in("PM_LINK") AND labels in (일일모니터링))) AND issuetype in ("Field Issue", "Bug") AND created >= ',
        dev2: 'project = TVCSISSUE AND labels in ("이슈분석") AND issuetype not in ("Field Issue", "Bug") AND created >= ',
        sqi: 'project = SQITASK AND created >= ',
        date: '2020-01-01',
        date2: '2019-01-01',
        resolved: ' AND status in (Resolved)',
        inprogress: ' AND status not in (Open, Resolved, Closed)',
        close: ' AND status in (Closed)',
        order: ' ORDER BY created DESC',
    };

    myGlobal.labels = {
        '주요이슈': '주요이슈',
        '이슈분석': '이슈분석',
        '현상태진행': '현상태진행',
        '차기양산대응': '차기양산대응',
        '양산즉대응': '양산즉대응',
        '양산즉대응_SU': '양산즉대응_SU',
        '정규MR대응': '정규MR대응',
        'Device수정': 'PM_LINK',
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
    };

    myGlobal.allIssue = {};

    function replaceAll(str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

    function saveState(id, isChecked) {
        myGlobal.currentCheck = isChecked;
        myGlobal.makeList('search__', myGlobal.currentBA);
    }

    function saveDate(id, dateType) {
        myGlobal[dateType] = $('#' + id.id + ' #' + dateType).val();
    }

    myGlobal.makeList = function (sub, obj, page) {
        myGlobal.searchTXT = $('#text_Search').val();
        let fDate = '2019-12-01';

        if (sub === 'search__') {
            obj = myGlobal.currentBA;
            fDate = myGlobal.date1;
        } else {
            myGlobal.searchTXT = '';
            myGlobal.date1 = '2019-12-01';
            let tt = new Date();
            tt.setHours(tt.getHours() + 9);
            myGlobal.date2 = tt.toISOString().split('T')[0];
        }

        let inputDate = `<br>
            <input class="aui-date-picker" id="date1" name="startDate" type="date" min="2019-12-01" onchange="saveDate(${obj[0].id}, 'date1')"/> ~ 
            <input class="aui-date-picker" id="date2" name="startDate" type="date" onchange="saveDate(${obj[0].id}, 'date2')"/>  
            검색어<input type="text" id="text_Search" style="width:100px"></input> 
            <button type="button" id="_btn" onclick="myGlobal.makeList('search__', 'null', 0);">Search</button>`;
        
        let objID = ['ListInput', 'ListArea'];
        let chch = ['Need2', 'Need3', 'Need4'];
        let setColorFlag = false;

        if (objID.includes(obj[0].id) && !chch.includes(sub)) {
            inputDate += `&emsp; 
                <button id="${obj[0].id}_bt1" onclick="saveState(this.id, true);" class="btn default">검토 중</button>
                <button id="${obj[0].id}_bt2" onclick="saveState(this.id, false);" class="btn default">전&emsp;체</button>`;
            setColorFlag = true;
            if (sub !== 'search__') myGlobal.currentCheck = true;
        }

        let search_RE = sub === 'search__' ? new RegExp(myGlobal.searchTXT, 'i') : null;
        myGlobal.currentBoard = sub === 'search__' ? myGlobal.currentBoard : sub;
        myGlobal.currentBA = obj;

        obj.html(sub);
        if (sub !== '주요 이슈') obj.append(inputDate);
        if (setColorFlag) {
            let btn = myGlobal.currentCheck ? '#bt1' : '#bt2';
            $(`#${myGlobal.currentBA[0].id}${btn}`)[0].style.backgroundColor = '#c3c3c3';
        }

        if (objID.includes(obj[0].id) && myGlobal.currentCheck && !chch.includes(sub)) {
            $(`#${obj[0].id}_ch1`).prop('checked', true);
            sub += '_I';
        }

        $(obj.selector + ' #date1').val(fDate);
        $(obj.selector + ' #date2').val(myGlobal.date2);
        $('#text_Search').val(myGlobal.searchTXT);

        let tbl = $('<table style="table-layout: fixed;" />').addClass('aui aui-table-sortable');
        let thaed = $('<thead/>');
        let headrow = $('<tr/>');
        let issues = myGlobal[sub];

        headrow.append($('<th style="width:20px"/>').text('No.'));
        headrow.append($('<th style="width:70px"/>').text('Key'));
        headrow.append($('<th style="width:300px" />').text('Summary'));
        headrow.append($('<th style="width:50px"/>').text('Create'));
        headrow.append($('<th style="width:50px"/>').text('Status'));
        headrow.append($('<th style="width:40px"/>').text('담당자'));
        thaed.append(headrow);
        tbl.append(thaed);

        let tb = $('<tbody/>');
        let cntt = 0;
        for (let i in issues) {
            if (issues[i].Create > myGlobal.date2 || issues[i].Create < fDate) continue;
            if (search_RE && !search_RE.test(issues[i].Description) && !search_RE.test(issues[i].Summary) && !search_RE.test(issues[i].issueDes)) continue;

            let row = $('<tr />');
            let tempLink = i.includes('TVCSISSUE') ? '"http://hlm.lge.com/qi/browse/' : '"http://hlm.lge.com/issue/browse/';
            cntt++;
            row.append($('<td style="text-align:center" />').html(cntt));
            row.append($('<td style="text-align:center" />').html(`<a href=${tempLink}${i}" target="_blank">${i}</a>`));
            row.append($('<td style="text-align:left" />').html(issues[i].Summary));
            row.append($('<td style="text-align:center" />').html(issues[i].Create));
            row.append($('<td style="text-align:center" />').html(issues[i].Status === 'Reopened' || issues[i].Status === 'Debugging' || issues[i].Status === 'In Progress' || issues[i].Status === 'Improving' || issues[i].Status === 'Reviewing' ? 'In-Progress' : issues[i].Status));
            row.append($('<td style="text-align:center" />').html(issues[i].Assignee));
            tb.append(row);
        }
        tbl.append(tb);
        obj.append(tbl);
        AJS.tablessortable.setTableSortable(AJS.$(tbl));
        AJS.$('#date1').datePicker({ 'overrideBrowserDefault': true });
        AJS.$('#date2').datePicker({ 'overrideBrowserDefault': true });
        obj.append('<div id="Des"><br></div>');
    };

    myGlobal.first_action = function () {
        let d1 = myGlobal.query.dev + myGlobal.query.date + myGlobal.query.order;
        let d2 = myGlobal.query.sqi + myGlobal.query.date + myGlobal.query.order;
        let d3 = myGlobal.query.dev2 + myGlobal.query.date2 + myGlobal.query.order;

        let devURL = 'http://hlm.lge.com/issue/rest/api/2/search';
        let qURL = 'http://hlm.lge.com/qi/rest/api/2/search/';

        let paramQ = {
            "jql": d1,
            "maxResults": "1000",
            "startAt": "0",
            "fields": ['summary', "created", "assignee", "status", 'labels', 'description', 'components', 'customfield_16500', 'resolution', 'customfield_16503', 'customfield_16502']
        };
        let paramDEV = {
            "jql": d2,
            "maxResults": "1000",
            "startAt": "0",
            "fields": ['summary', "created", "customfield_14503", "status", 'labels', 'customfield_14407', 'customfield_14406']
        };
        let paramE = {
            "jql": d3,
            "maxResults": "1000",
            "startAt": "0",
            "fields": ['summary', "created", "assignee", "status"]
        };

        myGlobal.loadAjax('dev', paramQ, qURL, myGlobal.loadIssue);
        myGlobal.loadAjax('sqi', paramDEV, devURL, myGlobal.loadIssue);
        myGlobal.loadAjax('dev2', paramE, qURL, myGlobal.loadIssue);

        $.when.apply($, myGlobal.dearray).done(function () {
            myGlobal.dearray = [];
            myGlobal.dataSort();
            myGlobal.disPlayIssue();
            myGlobal.makeList('allIssue', $('#ListTotal'), 0);
            $('.menu-item a').click(function (x) {
                $('#ListTotal_N, #ListTotal_E, #ListTotal, #ListArea, #ListInput, #ListType').html('');
                if (x.toElement.text === '전체 이슈 현황') myGlobal.makeList('allIssue', $('#ListTotal'), 0);
            });
        });
    };

    myGlobal.dataSort = function () {
        let labelKeys = Object.keys(myGlobal.labels);
        let ai = myGlobal.allIssue;
        labelKeys.forEach(key => {
            myGlobal.labels[key] = myGlobal.labels[key].toLowerCase();
        });
        for (let i in ai) {
            ai[i].Labels = ai[i].Labels.map(x => x.toLowerCase());
            let curIssue = ai[i];
            if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['allIssue_N'][i] = curIssue;
            if (curIssue.Labels.includes(myGlobal.labels['주요이슈'])) myGlobal['주요 이슈'][i] = curIssue;

            if (curIssue.Status === 'Open') {
                myGlobal['allIssue_I'][i] = curIssue;
                myGlobal['Open'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['Open_N'][i] = curIssue;
                continue;
            }
            if (['Reopened', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(curIssue.Status)) {
                myGlobal['allIssue_I'][i] = curIssue;
                myGlobal['In-Progress'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['In-Progress_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['모니터링'])) {
                myGlobal['모니터링'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['모니터링_N'][i] = curIssue;
                continue;
            }
            if (['Type_Spec', 'Type_현상태'].some(type => curIssue.Labels.includes(myGlobal.labels[type])) || curIssue.Resol.includes('Duplicate (중복 문제 발생)') || curIssue.Labels.includes(myGlobal.labels['Type_HW']) || curIssue.Labels.includes(myGlobal.labels['Type_Duplicate'])) {
                myGlobal['문제아님'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['문제아님_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['양산즉대응']) || curIssue.Labels.includes(myGlobal.labels['양산즉대응_SU'])) {
                curIssue['심의회'] = '양산즉대응';
                myGlobal['즉대응'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['즉대응_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['차기양산대응'])) {
                curIssue['심의회'] = '차기양산대응';
                myGlobal['차기양산'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['차기양산_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['정규MR대응'])) {
                curIssue['심의회'] = '정규MR대응';
                myGlobal['MR대응'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['MR대응_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['현상태진행'])) {
                curIssue['심의회'] = '현상태진행';
                myGlobal['현상태진행'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['현상태진행_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['Device수정'])) {
                myGlobal['Device수정'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['Device수정_N'][i] = curIssue;
                continue;
            }
            if (curIssue.Labels.includes(myGlobal.labels['Type_CP수정']) || curIssue.Labels.includes(myGlobal.labels['Type_서버수정'])) {
                myGlobal['CP/Server수정'][i] = curIssue;
                if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['CP/Server수정_N'][i] = curIssue;
                continue;
            }
            myGlobal['Need1'][i] = curIssue;
            if (curIssue.Ftype === 'Field Claim' && curIssue.Stype === 'SW') myGlobal['Need1_N'][i] = curIssue;
        }

        let inputSome = ['해외법인', '한국CS', '한국매장', '규제사무국', '사업자', '기타', 'CpAppmonitoring'];
        myGlobal['Need2'] = {};
        inputSome.forEach(item => {
            myGlobal[item] = {};
            myGlobal[item + '_I'] = {};
        });

        for (let i in ai) {
            let inputFlag = true;
            inputSome.forEach(item => {
                if (ai[i].Labels.includes(myGlobal.labels[item])) {
                    myGlobal[item][i] = ai[i];
                    inputFlag = false;
                    if (['Reopened', 'Open', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(ai[i].Status)) {
                        myGlobal[item + '_I'][i] = ai[i];
                    }
                }
            });
            if (inputFlag) myGlobal['Need2'][i] = ai[i];
        }

        let inputArea = ['지역_한국', '지역_북미', '지역_유럽', '지역_일본', '지역_브라질', '지역_중국홍콩', '지역_아주중아', '지역_대만콜롬비아', '지역_모니터링'];
        let areaForTVCS = ['한국', '북미', '구주/CIS', '일본', '중남미(브라질)', '중국/홍콩', '아주/중아', '대만/콜롬비아', '모니터링'];
        myGlobal['Need3'] = {};
        inputArea.forEach(item => {
            myGlobal[item] = {};
            myGlobal[item + '_I'] = {};
        });

        for (let i in ai) {
            let inputFlag = true;
            let areacount = 0;
            if (i.includes('SQI')) {
                inputArea.forEach(area => {
                    if (ai[i].Labels.includes(myGlobal.labels[area])) {
                        myGlobal[area][i] = ai[i];
                        inputFlag = false;
                        areacount++;
                        if (['Reopened', 'Open', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(ai[i].Status)) {
                            myGlobal[area + '_I'][i] = ai[i];
                        }
                    }
                });
            } else {
                inputArea.forEach((area, idx) => {
                    if (ai[i].Area.includes(areaForTVCS[idx])) {
                        myGlobal[area][i] = ai[i];
                        inputFlag = false;
                        areacount++;
                        if (['Reopened', 'Open', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(ai[i].Status)) {
                            myGlobal[area + '_I'][i] = ai[i];
                        }
                    }
                });
            }
            if (inputFlag) myGlobal['Need3'][i] = ai[i];
            if (areacount > 1) console.log('over' + i);
        }

        myGlobal['Type_All'] = {};
        myGlobal['Type_Device'] = {};
        let inputType = ['Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec'];
        myGlobal['Need4'] = {};
        inputType.forEach(type => {
            myGlobal[type] = {};
        });

        for (let i in ai) {
            let inputFlag = true;
            if (ai[i].Labels.includes(myGlobal.labels['모니터링'])) continue;
            if (['Reopened', 'Open', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(ai[i].Status)) continue;

            if (['Device수정', '현상태진행', '차기양산대응', '양산즉대응', '양산즉대응_SU', '정규MR대응'].some(type => ai[i].Labels.includes(myGlobal.labels[type]))) {
                if (!ai[i].Resol.includes('Duplicate (중복 문제 발생)')) {
                    myGlobal['Type_Device'][i] = ai[i];
                    myGlobal['Type_All'][i] = ai[i];
                    inputFlag = false;
                } else {
                    myGlobal['Type_현상태'][i] = ai[i];
                    myGlobal['Type_All'][i] = ai[i];
                    inputFlag = false;
                }
            }
            inputType.forEach(type => {
                if (ai[i].Labels.includes(myGlobal.labels[type])) {
                    myGlobal[type][i] = ai[i];
                    myGlobal['Type_All'][i] = ai[i];
                    inputFlag = false;
                }
            });
            if (['Type_HW', 'Type_Duplicate'].some(type => ai[i].Labels.includes(myGlobal.labels[type]))) {
                myGlobal['Type_현상태'][i] = ai[i];
                myGlobal['Type_All'][i] = ai[i];
                inputFlag = false;
            }
            if (inputFlag && !ai[i].Labels.includes(myGlobal.labels['모니터링'])) myGlobal['Need4'][i] = ai[i];
        }

        for (let i in myGlobal.etcIssue) {
            if (myGlobal.etcIssue[i].Status === 'Open') {
                myGlobal['Open_E'][i] = myGlobal.etcIssue[i];
                continue;
            }
            if (['Reopened', 'Debugging', 'In Progress', 'Improving', 'Reviewing'].includes(myGlobal.etcIssue[i].Status)) {
                myGlobal['In-Progress_E'][i] = myGlobal.etcIssue[i];
                continue;
            }
            myGlobal['Resolved_E'][i] = myGlobal.etcIssue[i];
        }
    };

    myGlobal.disPlayIssue = function () {
        let issueArray = ['주요 이슈', 'Open', 'In-Progress', '모니터링'];
        issueArray.forEach((issue, i) => {
            $('#' + issue).text(Object.keys(myGlobal[issue]).length);
            if (i > 0) $('#' + issue + '_N').text(Object.keys(myGlobal[issue + '_N']).length);
        });

        let issueArrayStack = ['allIssue', '문제아님'];
        issueArrayStack.forEach(issue => {
            $('#' + issue).text(Object.keys(myGlobal[issue]).length);
            $('#' + issue + '_N').text(Object.keys(myGlobal[issue + '_N']).length);
        });

        let textIssueArray = ['Device수정'];
        textIssueArray.forEach(issue => {
            $('#' + issue).text(`${issue}: ${Object.keys(myGlobal[issue]).length}`);
            $('#' + issue + '_N').text(`${issue}: ${Object.keys(myGlobal[issue + '_N']).length}`);
        });

        let textIssueArrayStack = ['즉대응', '차기양산', 'MR대응', '현상태진행', 'CP/Server수정'];
        textIssueArrayStack.forEach(issue => {
            $('#' + issue.replace('/', '\\/')).text(`${issue}: ${Object.keys(myGlobal[issue]).length}`);
            $('#' + issue.replace('/', '\\/') + '_N').text(`${issue}: ${Object.keys(myGlobal[issue + '_N']).length}`);
        });

        let inputSome = ['해외법인', '한국CS', '한국매장', '규제사무국', '사업자', '기타', 'CpAppmonitoring', 'allIssue'];
        let inputArea = ['지역_한국', '지역_북미', '지역_유럽', '지역_일본', '지역_브라질', '지역_중국홍콩', '지역_아주중아', '지역_대만콜롬비아', '지역_모니터링'];
        let inputType = ['Type_Device', 'Type_CP수정', 'Type_서버수정', 'Type_현상태', 'Type_Spec', 'Type_All'];

        inputSome.forEach(item => {
            $('#' + item + ' text').text(`${Object.keys(myGlobal[item + '_I']).length}/${Object.keys(myGlobal[item]).length}`);
        });

        inputArea.forEach(item => {
            $('#' + item + ' text').text(`${Object.keys(myGlobal[item + '_I']).length}/${Object.keys(myGlobal[item]).length}`);
        });

        inputType.forEach(type => {
            $('#' + type + ' text').text(Object.keys(myGlobal[type]).length);
        });

        let etcArray = ['Open_E', 'In-Progress_E', 'Resolved_E', 'etcIssue'];
        etcArray.forEach(item => {
            $('#' + item).text(Object.keys(myGlobal[item]).length);
        });
    };

    myGlobal.etcIssue = {};

    myGlobal.loadIssue = function (i, data, deferred) {
        let arr = data.issues;
        if (i === 'dev') {
            arr.forEach(issue => {
                let tempKey = issue.key;
                myGlobal.allIssue[tempKey] = {
                    Summary: issue.fields.summary,
                    Create: issue.fields.created.split('T')[0],
                    Status: issue.fields.status.name,
                    Description: issue.fields.description || '',
                    issueDes: issue.fields.customfield_16500 || '',
                    Assignee: issue.fields.assignee ? issue.fields.assignee.displayName.split(' ')[0] : 'Empty',
                    Labels: issue.fields.labels,
                    Area: issue.fields.components ? issue.fields.components[0].description : 'Empty',
                    Resol: issue.fields.resolution ? issue.fields.resolution.name : 'Empty',
                    Ftype: issue.fields.customfield_16503 ? issue.fields.customfield_16503.value : 'Empty',
                    Stype: issue.fields.customfield_16502 ? issue.fields.customfield_16502.value : 'Empty',
                    iDesHTML: 'Empty',
                    DesHTML: 'Empty'
                };
            });
            myGlobal.dResolve(deferred);
        } else if (i === 'sqi') {
            arr.forEach(issue => {
                let tempKey = issue.key;
                myGlobal.allIssue[tempKey] = {
                    Summary: issue.fields.summary,
                    Create: issue.fields.created.split('T')[0],
                    Status: issue.fields.status.name,
                    Description: issue.fields.customfield_14407 || '',
                    issueDes: issue.fields.customfield_14406 || '',
                    Assignee: issue.fields.customfield_14503 ? issue.fields.customfield_14503[0].displayName.split(' ')[0] : 'Empty',
                    Labels: issue.fields.labels,
                    Resol: 'Empty',
                    Ftype: 'Field Claim',
                    Stype: 'SW',
                    iDesHTML: 'Empty',
                    DesHTML: 'Empty'
                };
            });
            myGlobal.dResolve(deferred);
        } else if (i === 'dev2') {
            arr.forEach(issue => {
                let tempKey = issue.key;
                myGlobal.etcIssue[tempKey] = {
                    Summary: issue.fields.summary,
                    Create: issue.fields.created.split('T')[0],
                    Status: issue.fields.status.name,
                    Assignee: issue.fields.customfield_14503 ? issue.fields.customfield_14503[0].displayName.split(' ')[0] : 'Empty'
                };
            });
            myGlobal.dResolve(deferred);
        } else {
            console.log('Unknown issue. Please check again.');
        }
    };

    myGlobal.loadAjax = function (index, param, searchURL, myFunction) {
        let deferred = $.Deferred();
        myGlobal.dearray.push(deferred);
        $.ajax({
            url: searchURL,
            contentType: 'application/json',
            type: "POST",
            data: JSON.stringify(param),
            dataType: "json",
            xhrFields: { withCredentials: true },
            success: function (data) {
                myFunction(index, data, deferred);
            },
            error: function (jqXHR, errorThrown) {
                console.log('error:' + errorThrown);
            }
        });
        return deferred.promise();
    };

    myGlobal.dResolve = function (deferred) {
        let resolvedCount = myGlobal.dearray.filter(deferred => deferred.state() === "resolved").length;
        console.log((resolvedCount / myGlobal.dearray.length).toFixed(2));
        deferred.resolve();
    };

    window.onload = function () {
        require("atlassian/analytics/user-activity-xhr-header").uninstall();

        let loadContent = function (selector, url) {
            let deferred = $.Deferred();
            myGlobal.dearray.push(deferred);
            $(selector).load(url, function (responseTxt, statusTxt) {
                if (statusTxt === 'success') {
                    myGlobal.dResolve(deferred);
                } else {
                    alert('Press F5');
                }
            });
            return deferred.promise();
        };

        loadContent("#m-total", "http://collab.lge.com/main/download/attachments/1085010220/t.html");
        loadContent("#circle-input", "http://collab.lge.com/main/download/attachments/1085010220/circle_input.html");
        loadContent("#circle-area", "http://collab.lge.com/main/download/attachments/1085010220/circle_area.html");
        loadContent("#circle-Type", "http://collab.lge.com/main/download/attachments/1085010220/circle_type.html");
        loadContent("#riskTable", "http://collab.lge.com/main/download/attachments/1085010220/t1.html");
        loadContent("#etcTable", "http://collab.lge.com/main/download/attachments/1085010220/t2.html");

        $.when.apply($, myGlobal.dearray).done(function () {
            myGlobal.dearray = [];
            myGlobal.first_action();
        });
    };

    global.myGlobal = myGlobal;
})(window);
