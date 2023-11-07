const mainForm = document.getElementById('main'); // Id가 main인 form을 잡아 변수 mainForm을 생성

mainForm['prev'].onclick = function () { //mainform의 자식의 name이 prev인 버튼을 클릭을 했을 때
    const minStep = 1; //minStep=1 변수 생성
    const maxStep = 3; //minStep=3 변수 생성
    let step = parseInt(mainForm.dataset.step) - 1; // mainform의 data-step의 값을 -1하고
    if (step < minStep) { // 만약 1이 step보다 클때
        step = minStep; // step에 1을 넣는다.
    }
    if (step > maxStep) { // 만약 step이 3보다 클때
        step = maxStep; // step에 3을 넣는다.
    }
    mainForm.dataset.step = step + ''; //위를 실행한 결과를 stpe에 넣는다.
}

mainForm['infoEmailSend'].onclick = function () {
    if (mainForm['infoEmail'].value === '') {
        dialog.show({
            title: '이메일',
            content: '이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    // mainForm['infoEmail'].focus();
                    mainForm['infoEmail'].select();
                    dialog.hide();
                })
            ]
        });
        return;
    }
    if (!new RegExp(mainForm['infoEmail'].dataset.regex).test(mainForm['infoEmail'].value)) {
        dialog.show({
            title: '이메일',
            content: '올바른 이메일을 입력해 주세요.',
            buttons: [
                dialog.createButton('확인', function () {
                    mainForm['infoEmail'].focus(); // focus : 커서만 갓다 대는것
                    mainForm['infoEmail'].select(); // 커서와 드래그까지 같이하는것
                    dialog.hide();
                })
            ]
        });
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', mainForm['infoEmail'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status >= 200 && xhr.status < 300) {
            const responseObject = JSON.parse(xhr.responseText);
            switch (responseObject['result']) {
                case 'failure':
                    dialog.show({
                        title: '오류',
                        content: '알 수 없는 이유로 인증번호를 전송하지 못하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
                    break;
                case 'failure_duplicate_email':
                    dialog.show({
                        title: '오류',
                        content: '해당 이메일은 이미 사용 중입니다.',
                        buttons: [
                            dialog.createButton('확인', function () {
                                mainForm['infoEmail'].focus();
                                // mainForm['infoEmail'].select();
                                dialog.hide();
                            })
                        ]
                    });
                    break;
                case 'success':
                    mainForm['infoEmail'].setAttribute('disabled', '');
                    mainForm['infoEmailSend'].setAttribute('disabled', '');
                    mainForm['infoEmailCode'].removeAttribute('disabled');
                    mainForm['infoEmailVerify'].removeAttribute('disabled');
                    dialog.show({
                        title: '성공',
                        content: '입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다.<br><br> 해당 인증 번호는 <b>5분간 유효<b>하니 유의해 주세요.',
                        buttons: [
                            dialog.createButton('확인', function (){
                                dialog.hide();
                                mainForm['inforEmailCode'].focus();
                            })
                        ]
                    });
                    break;
                default:
                    dialog.show({
                        title: '오류',
                        content: '서버가 예상치 못한 응답을 반환하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                        buttons: [dialog.createButton('확인', dialog.hide)]
                    });
            }
        } else {
            dialog.show({
                title: '오류',
                content: '요청을 전송하는 도중 예상치 못한 오류가 발생하였습니다.<br><br>잠시 후 다시 시도해 주세요.',
                buttons: [dialog.createButton('확인', dialog.hide)]
            });
        }
    }
    xhr.open('GET', './registerEmail');
    xhr.send(formData);
    loading.show();
}

mainForm.onsubmit = function (e) {
    e.preventDefault();
    switch (parseInt(mainForm.dataset.step)) {
        case 1:
            if (!mainForm['termPolicyAgree'].checked) {
                dialog.show({
                    title: '서비스 이용약관',
                    content: '서비스 이용약관을 읽고 동의해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                return false;
            }
            if (!mainForm['termPrivacyAgree'].checked) {
                dialog.show({
                    title: '개인정보 처리방침',
                    content: '개인정보 처리방침을 읽고 동의해 주세요.',
                    buttons: [dialog.createButton('확인', dialog.hide)]
                });
                return false;
            }
            if (!mainForm['termMarketingAgree'].checked) {
                dialog.show({
                    title: '마케팅 및 광고 활용 동의',
                    content: '마케팅 및 광고 활용에 동의하시면 다양한 혜택을 받아보실 수 있습니다.<br><br>다시 확인해 보시려면 <b>닫기</b>버튼을, 동의하지 않고 진행하시려면 <b>계속하기</b>버튼을 클릭해 주세요.',
                    buttons: [
                        dialog.createButton('닫기', dialog.hide),
                        dialog.createButton('계속하기', function () {
                            mainForm.dataset.step = '2';
                            dialog.hide();
                        })
                    ]
                });
            } else {
                mainForm.dataset.step = '2';
            }
            break;
        case 2:
            break;
        case 3:
            break;
    }
}