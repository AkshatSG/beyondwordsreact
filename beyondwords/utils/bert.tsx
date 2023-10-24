export const TextSummarization = async(originalText: String) => {
    try {
      const textToSummarize = originalText; // Get the text from a TextInput or any source

      const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({
          inputs: textToSummarize,
        }),
      });

      if (!response.ok) {
        // Handle API error, e.g., response.status contains the HTTP status code
        console.error('API error:', response.status);
        return 'ERROR';
      }

      const data = await response.json();

      // Set the summary received from the API
      return (data[0].summary_text);
    } catch (error) {
      console.error('Error:', error);
    }
  };
