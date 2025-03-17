$(document).ready(function() {
    const $promptInput = $('#prompt-input');
    const $responseArea = $('#response-area');
    const $sendBtn = $('.send-btn');
    const $cancelBtn = $('.cancel-btn');

    function formatTimestamp(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function createChatEntry(question, answer) {
        const timestamp = formatTimestamp(new Date());
        return `
            <div class="chat-entry">
                <div class="timestamp">${timestamp}</div>
                <div class="question"><strong>Question:</strong> ${question}</div>
                <hr>
                <div class="answer">${answer}</div>
            </div>
        `;
    }

    $sendBtn.on('click', async function() {
        const question = $promptInput.val().trim();
        if (!question) {
            alert('Please enter a tax-related question.');
            return;
        }

        try {
            const response = await $.ajax({
                url: '/api/askTax',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ question })
            });

            const chatEntry = createChatEntry(question, response.answer);
            $responseArea.append(chatEntry);
            $promptInput.val('');
            
            // Scroll to the bottom of the response area
            $responseArea.scrollTop($responseArea[0].scrollHeight);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
    });

    $cancelBtn.on('click', function() {
        $promptInput.val('');
        $responseArea.empty();
    });
}); 