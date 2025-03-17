# Tax GPT - Deloitte Enterprise Chat UI

An intelligent tax assistant powered by Google's Gemini API that helps with tax-related queries and provides accurate, contextual responses in a modern chat interface.

## Features

- 🤖 AI-powered tax assistance using Google Gemini
- 💬 Interactive chat interface with conversation history
- 🎨 Modern Deloitte-themed UI design
- 📝 Persistent storage of conversations using PostgreSQL
- ⚡ Real-time responses with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Google Cloud Platform account with Gemini API access

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd Tax_GPT
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```sql
   -- Connect to PostgreSQL and run:
   CREATE DATABASE tax_gpt;
   \c tax_gpt

   CREATE TABLE tax_responses (
       id SERIAL PRIMARY KEY,
       question TEXT NOT NULL,
       answer TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/tax_gpt
   GOOGLE_API_KEY=your_gemini_api_key
   PORT=3000
   ```

   Replace:
   - `username` and `password` with your PostgreSQL credentials
   - `your_gemini_api_key` with your Google Gemini API key

## Running the Application

1. **Start the Server**
   ```bash
   npm start
   ```

2. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`
   - The application should display the Deloitte Enterprise Chat UI

## Usage

1. **Asking Questions**
   - Enter your tax-related question in the input area
   - Click the "Send" button or press Enter to submit
   - The AI will process your question and provide a response

2. **Managing Conversations**
   - Previous conversations are automatically loaded and displayed in reverse chronological order
   - Use the "Cancel" button to clear the current conversation display
   - All conversations are permanently stored in the database

## Expected Results

1. **User Interface**
   - Clean, professional Deloitte-branded interface
   - Responsive design that works on all screen sizes
   - Smooth animations for new messages

2. **Functionality**
   - Real-time AI responses to tax queries
   - Persistent conversation history
   - Automatic scrolling to latest messages
   - Error handling for invalid inputs or API issues

3. **Performance**
   - Quick response times (typically 2-5 seconds)
   - Smooth scrolling and animations
   - Efficient database operations

## Troubleshooting

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database and table are created

2. **API Response Errors**
   - Verify Google API key is valid
   - Check internet connectivity
   - Review API quota limits

3. **Application Not Starting**
   - Check Node.js version
   - Verify all dependencies are installed
   - Review server logs for errors
