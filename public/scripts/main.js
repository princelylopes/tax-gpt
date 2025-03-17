class TaxChatUI {
    constructor() {
        this.elements = {
            input: $('#questionInput'),
            output: $('#conversationLog'),
            submitButton: $('#submitBtn'),
            clearButton: $('#clearBtn')
        };
        
        this.bindEvents();
        this.loadPreviousConversations();
    }

    bindEvents() {
        this.elements.submitButton.on('click', () => this.handleSubmission());
        this.elements.clearButton.on('click', () => this.handleClear());
        this.elements.input.on('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmission();
            }
        });
    }

    async loadPreviousConversations() {
        try {
            const response = await $.ajax({
                url: '/api/conversations',
                method: 'GET'
            });
            
            if (response.length > 0) {
                const conversationsHtml = response.map(conv => 
                    this.createMessageElement(
                        conv.question, 
                        conv.answer, 
                        new Date(conv.created_at)
                    )
                ).join('');
                
                this.elements.output.html(conversationsHtml);
                this.scrollToTop();
            }
        } catch (error) {
            console.error('Error loading previous conversations:', error);
            this.showError('Failed to load previous conversations.');
        }
    }

    async handleSubmission() {
        const question = this.elements.input.val().trim();
        if (!question) {
            this.showError('Please enter a tax-related question.');
            return;
        }

        try {
            const response = await this.submitQuestion(question);
            this.displayConversation(question, response.answer);
            this.elements.input.val('');
        } catch (error) {
            console.error('Error:', error);
            this.showError('An error occurred while processing your request.');
        }
    }

    async submitQuestion(question) {
        return $.ajax({
            url: '/api/askTax',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ question })
        });
    }

    displayConversation(question, answer) {
        const messageHtml = this.createMessageElement(question, answer, new Date());
        this.elements.output.prepend(messageHtml);
        this.scrollToTop();
    }

    createMessageElement(question, answer, timestamp) {
        return `
            <div class="message-box">
                <div class="message-meta">${this.formatTimestamp(timestamp)}</div>
                <div class="message-content">
                    <strong>Question:</strong> ${this.escapeHtml(question)}
                </div>
                <hr class="message-divider">
                <div class="message-response">${this.escapeHtml(answer)}</div>
            </div>
        `;
    }

    formatTimestamp(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return date.toLocaleString('en-US', options);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToTop() {
        const outputElement = this.elements.output[0];
        outputElement.scrollTop = 0;
    }

    handleClear() {
        this.elements.input.val('');
        this.elements.output.empty();
    }

    showError(message) {
        alert(message);
    }
}

// Initialize the application when the document is ready
$(document).ready(() => {
    new TaxChatUI();
}); 