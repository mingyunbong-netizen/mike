// 브라우저 호환성 체크 (Chrome 기반)
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// SpeechRecognition 인스턴스 생성
const recognition = new SpeechRecognition();
const resultDiv = document.getElementById('result');

// 💡 (수정) 최종적으로 확정된 텍스트를 누적할 변수
let accumulatedTranscript = '';

// 1. 주요 설정
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'ko-KR'; 

// 2. 인식 결과 처리 (수정된 부분)
recognition.onresult = function(event) {
    let interimTranscript = ''; // 현재 말하는 중인 임시 텍스트
    let finalTranscript = '';   // 새로 확정된 최종 텍스트

    // 모든 결과를 순회
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
            // 새로 확정된 최종 텍스트를 모음
            finalTranscript += transcript;
        } else {
            // 현재 말하고 있는 임시 텍스트를 모음
            interimTranscript += transcript;
        }
    }
    
    // 💡 새로 확정된 최종 텍스트를 '누적 저장' 변수에 추가
    accumulatedTranscript += finalTranscript;

    // 💡 화면에 '누적된 최종 텍스트'와 '현재 임시 텍스트'를 합쳐서 표시합니다.
    // 사용자가 말하는 동안에는 실시간으로 임시 텍스트가 덧붙여져 보입니다.
    resultDiv.textContent = accumulatedTranscript + interimTranscript;
};

// 3. 인식 종료 시 처리
// 인식이 잠시 멈추더라도 연속적인 인식을 위해 자동으로 다시 시작합니다.
recognition.onend = function() {
    console.log('Speech recognition ended. Restarting...');
    recognition.start(); 
};

// 4. 오류 처리
recognition.onerror = function(event) {
    console.error('Speech recognition error: ' + event.error);
    resultDiv.textContent = accumulatedTranscript + ' [오류 발생: ' + event.error + ']';
    
    if (event.error !== 'not-allowed') {
        // 'not-allowed' (권한 없음) 오류가 아니면 재시도
        setTimeout(() => {
            recognition.start();
        }, 1000);
    }
};

// 5. 웹사이트 로드 시 자동 시작
window.onload = function() {
    try {
        recognition.start();
        console.log('Speech recognition started.');
        resultDiv.textContent = '마이크 접근 허용 후 말씀해주세요.';
    } catch (e) {
        console.warn('Speech recognition start failed: ' + e.message);
    }
};
