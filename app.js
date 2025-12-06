// Web Speech API 객체 가져오기 (브라우저 접두사 지원)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// 필요한 HTML 요소 가져오기
const output = document.getElementById('output');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

// 브라우저 지원 여부 확인
if (!SpeechRecognition) {
    alert("죄송합니다. 사용하시는 브라우저가 Web Speech API를 지원하지 않습니다. (Chrome, Edge 사용 권장)");
} else {
    const recognition = new SpeechRecognition();

    // --- 설정 ---
    recognition.continuous = true;  // 인식을 멈추지 않고 계속 듣도록 설정
    recognition.lang = 'ko-KR';     // 인식 언어를 한국어로 설정
    recognition.interimResults = false; // 중간 결과 대신 최종 결과만 받도록 설정

    // --- 이벤트 처리 ---
    
    // 1. 인식 결과를 받았을 때
    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        // 인식된 최종 텍스트만 가져옵니다.
        const transcript = event.results[last][0].transcript;
        
        // 텍스트 영역에 결과 추가 및 화면 표시
        output.value += transcript + ' '; 
        
        // 디버깅을 위해 콘솔에 결과를 출력합니다. (F12로 확인)
        console.log('✅ 인식 성공: ' + transcript);
    };

    // 2. 에러가 발생했을 때
    recognition.onerror = (event) => {
        console.error('❌ 인식 에러 발생:', event.error);
        if (event.error === 'not-allowed') {
            alert('마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
        }
    };
    
    // 3. 인식 서비스가 끝났을 때
    recognition.onend = () => {
        console.log('음성 인식이 중지되었습니다.');
        // continuous: true 로 설정해도 인식이 끊기면 다시 시작하도록 할 수 있으나, 
        // 여기서는 수동 중지만 처리합니다.
    }

    // --- 버튼 이벤트 리스너 ---
    startButton.onclick = () => {
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        console.log('--- 🎙️ 음성 인식 시작 ---');
    };

    stopButton.onclick = () => {
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    };
}
