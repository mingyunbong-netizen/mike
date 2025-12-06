// Web Speech API 객체 생성
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("죄송합니다. 사용하시는 브라우저가 Web Speech API를 지원하지 않습니다. (Chrome, Edge 등 사용 권장)");
} else {
    const recognition = new SpeechRecognition();
    const output = document.getElementById('output');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    // 설정
    recognition.continuous = true; 
    recognition.lang = 'ko-KR';   
    recognition.interimResults = false; 

    // 결과 처리
    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        
        // 텍스트 영역에 결과 추가
        output.value += transcript + ' '; 
        console.log('Recognized: ' + transcript);
    };

    // 에러 처리
    recognition.onerror = (event) => {
        console.error('Recognition error: ' + event.error);
        if (event.error === 'not-allowed') {
            alert('마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
        }
    };

    // 시작/중지 버튼 이벤트 리스너
    startButton.onclick = () => {
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        console.log('음성 인식 시작됨.');
    };

    stopButton.onclick = () => {
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
        console.log('음성 인식 중지됨.');
    };

    // 초기 상태 설정
    stopButton.disabled = true;
}