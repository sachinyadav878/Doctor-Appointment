document.addEventListener('DOMContentLoaded', () => {
    const playPauseButton = document.getElementById('togglePlayPauseButton');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const botImage = document.getElementById('botImage');
    const speakingGif = document.getElementById('speakingGif');
    const loadingSpinner = document.getElementById('loadingSpinner'); 
    const outputDiv = document.getElementById('output');
    
    let isPlaying = false;
    let speechSynthesisUtterance;
    let voices = [];

    // Wait for voices to be loaded
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        console.log(voices); 
    };

    document.getElementById('patientForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        loadingSpinner.style.display = 'block';

        const name = document.getElementById('name').value;
        const symptoms = document.getElementById('symptoms').value;
        const duration = document.getElementById('duration').value;
        const medicine = document.getElementById('medicine').value;
        const language = document.getElementById('language').value;

        try {
            const response = await fetch('http://localhost:3000/getResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, symptoms, duration, medicine, language })
            });
           

            if (!response.ok) {
                const errorText = await response.text();
                alert(`Error: ${response.status} - ${errorText}`);
                
                return;
            }
            

            const data = await response.json();
            document.getElementById('output').innerText = data.response;
           

            loadingSpinner.style.display = 'none';

            setupTextToSpeech(data.response, language);

        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred while processing your request. Please try again later.');

            loadingSpinner.style.display = 'none';
        }
    });

    // Function to set up text-to-speech
    function setupTextToSpeech(text, language) {
        if (text) {
       
            speechSynthesisUtterance = new SpeechSynthesisUtterance(text)
            const selectedVoice = voices.find(voice => voice.lang === language);

            if (selectedVoice) {
                speechSynthesisUtterance.voice = selectedVoice;
            } else {
                speechSynthesisUtterance.voice = voices.find(voice => voice.lang === "en-US");
            }

            speechSynthesisUtterance.lang = language;  
            speechSynthesisUtterance.onend = () => {
                handleSpeechEnd();
            };
            speechSynthesisUtterance.onpause = () => {
                handleSpeechPause();
            };
        }
    }

    playPauseButton.onclick = function() {
        if (!isPlaying) {
            
            window.speechSynthesis.speak(speechSynthesisUtterance);

           
            speakingGif.style.display = 'block';
            botImage.style.display = 'none';
            
         
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';

            isPlaying = true;
        } else {
          
            window.speechSynthesis.pause();
            speakingGif.style.display = 'none';
            botImage.style.display = 'block';
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';

            isPlaying = false;
        }
    }
    function handleSpeechEnd() {
        isPlaying = false;
        speakingGif.style.display = 'none'; // Hide GIF
        botImage.style.display = 'block';   // Show bot image

        playIcon.style.display = 'inline-block';
        pauseIcon.style.display = 'none';
    }

    function handleSpeechPause() {
        isPlaying = false;
        speakingGif.style.display = 'none'; 
        botImage.style.display = 'block';  
        playIcon.style.display = 'inline-block';
        pauseIcon.style.display = 'none';
    }
});


