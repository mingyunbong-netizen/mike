// 브라우저 호환성 체크 (Chrome 기반)
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// SpeechRecognition 인스턴스 생성
const recognition = new SpeechRecognition();
const resultDiv = document.getElementById('result');

// 1. 주요 설정
// 연속 인식: 사용자가 말하는 중간에 멈추더라도 계속 들으려면 true
recognition.continuous = true;
// 중간 결과 반환: 최종 확정 전 임시 텍스트를 받으려면 true
recognition.interimResults = true;
// 인식 언어 설정 (한국어)
recognition.lang = 'ko-KR'; 
// 다른 언어를 사용하려면 'en-US', 'ja-JP' 등으로 변경

// 2. 인식 결과 처리
recognition.onresult = function(event) {
    let interimTranscript = ''; // 임시 결과
    let finalTranscript = '';   // 최종 결과

    // 모든 결과를 순회
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            // 최종 결과
            finalTranscript += transcript;
        } else {
            // 임시 결과 (말하는 도중에 실시간으로 표시됨)
            interimTranscript += transcript;
        }
    }

    // 화면에 텍스트 표시
    resultDiv.textContent = finalTranscript + interimTranscript;
};

// 3. 인식 종료 시 처리 (continuous: true 설정 시 중요)
// 인식이 종료(end)되면 자동으로 다시 시작하여 연속적인 인식을 유지합니다.
recognition.onend = function() {
    console.log('Speech recognition ended. Restarting...');
    // 마이크가 닫히면 자동으로 다시 시작합니다.
    recognition.start(); 
};

// 4. 오류 처리
recognition.onerror = function(event) {
    console.error('Speech recognition error: ' + event.error);
    resultDiv.textContent = '오류 발생: ' + event.error;
    
    // 오류 발생 후에도 다시 시작을 시도할 수 있습니다.
    if (event.error === 'not-allowed') {
        alert("마이크 접근이 거부되었습니다. 페이지를 새로고침하고 권한을 허용해주세요.");
    } else if (event.error === 'service-not-allowed') {
        // 이 오류는 인식이 끝난 후 onend가 호출되어 다시 시작할 수 있게 해줍니다.
    } else {
        // 기타 오류 시 1초 후 재시도
        setTimeout(() => {
            recognition.start();
        }, 1000);
    }
};

// 5. 웹사이트 로드 시 자동 시작
// 사용자가 페이지에 접속하면 바로 인식을 시작합니다.
window.onload = function() {
    try {
        recognition.start();
        console.log('Speech recognition started.');
    } catch (e) {
        // 이미 인식이 진행 중일 때 start()를 호출하면 발생하는 오류 처리
        console.warn('Speech recognition start failed (maybe already active): ' + e.message);
        resultDiv.textContent = '음성 인식 시작 준비 중...';
    }
};
