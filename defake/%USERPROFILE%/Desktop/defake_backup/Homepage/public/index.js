  /*// ✅ Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// ✅ Main Script Logic
document.addEventListener('DOMContentLoaded', function () {
  console.log('Script starting...');

  const checkButton = document.getElementById('checkButton');
  const newsInput = document.getElementById('newsInput');
  const verdictMessage = document.getElementById('verdictMessage');
  const credibilityScore = document.getElementById('credibilityScore');

  if (!checkButton || !newsInput || !verdictMessage || !credibilityScore) {
    console.error('❌ Required elements not found!');
    return;
  }

  // 🧠 Function to update credibility section dynamically
  function updateCredibilityScore(score, fakeProb, realProb, explanation) {
    if (!score) {
      credibilityScore.innerHTML = '';
      return;
    }

    const scoreHtml = `
      <div class="score-display">
        <div class="score-circle">${score}%</div>
        <div>
          <h3>Confidence Level</h3>
          <p>${explanation}</p>
        </div>
      </div>
      <div class="score-factors">
        <h4>Probability Breakdown:</h4>
        <ul>
          <li>🟥 Fake Probability: <strong>${fakeProb || 0}%</strong></li>
          <li>🟩 Real Probability: <strong>${realProb || 0}%</strong></li>
        </ul>
      </div>
    `;
    credibilityScore.innerHTML = scoreHtml;
  }

  // 🧩 Check News Handler
  checkButton.addEventListener('click', async function (e) {
    e.preventDefault();
    console.log('🔘 Check button clicked');

    const input = newsInput.value.trim();
    if (!input) {
      verdictMessage.textContent = 'Please enter some text to check.';
      verdictMessage.style.color = '#DC2626';
      updateCredibilityScore(null, 0, 0, '');
      return;
    }

    try {
      // 🚀 Send to Node (which talks to Flask)
      console.log('➡️ Sending request to /factcheck');
      const response = await fetch('/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });

      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('✅ Flask response received:', data);

      // 🎯 Display Flask result
      verdictMessage.textContent = data.prediction || data.message || "Unknown response";
      verdictMessage.style.color =
        (data.prediction && data.prediction.toLowerCase().includes("fake")) ||
        (data.message && data.message.toLowerCase().includes("fake"))
          ? "#DC2626"
          : "#059669";

      updateCredibilityScore(
        data.confidence || data.score || 0,
        data.fake_probability || 0,
        data.real_probability || 0,
        data.explanation || (data.factors ? data.factors.join(', ') : 'No explanation provided')
      );

    } catch (error) {
      console.error('❌ Error:', error);
      verdictMessage.textContent = 'Error checking news. Please try again.';
      verdictMessage.style.color = '#DC2626';
      updateCredibilityScore(null, 0, 0, '');
    }
  });

  console.log('✅ Setup complete');
});
*/

// ✅ Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('ServiceWorker registration successful with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// ✅ Main Script Logic
document.addEventListener('DOMContentLoaded', function () {
  console.log('🧠 Script starting...');

  const checkButton = document.getElementById('checkButton');
  const clearButton = document.getElementById('clearButton');
  const newsInput = document.getElementById('newsInput');
  const verdictMessage = document.getElementById('verdictMessage');
  const credibilityScore = document.getElementById('credibilityScore');
  const loader = document.getElementById('loader');

  if (!checkButton || !newsInput || !verdictMessage || !credibilityScore) {
    console.error('❌ Required elements not found!');
    return;
  }

  // 🔄 Button & Loader Control
  function setLoading(state) {
    loader.style.display = state ? 'block' : 'none';
    checkButton.disabled = state;
    clearButton.disabled = state;

    if (state) {
      checkButton.textContent = 'Analyzing...';
      checkButton.style.backgroundColor = '#4b5563';
      checkButton.style.cursor = 'wait';
    } else {
      checkButton.textContent = 'Check News';
      checkButton.style.backgroundColor = '#2563eb';
      checkButton.style.cursor = 'pointer';
    }
  }

  // 🧠 Function to update credibility section dynamically
  function updateCredibilityScore(score, fakeProb, realProb, explanation) {
    if (!score) {
      credibilityScore.innerHTML = '';
      return;
    }

    const scoreHtml = `
      <div class="score-display fade-in">
        <div class="score-circle">${score}%</div>
        <div>
          <h3>Confidence Level</h3>
          <p>${explanation}</p>
        </div>
      </div>
      <div class="score-factors fade-in">
        <h4>Probability Breakdown:</h4>
        <ul>
          <li>🟥 Fake Probability: <strong>${fakeProb || 0}%</strong></li>
          <li>🟩 Real Probability: <strong>${realProb || 0}%</strong></li>
        </ul>
      </div>
    `;
    credibilityScore.innerHTML = scoreHtml;
  }

  // 🧩 Check News Handler
  checkButton.addEventListener('click', async function (e) {
    e.preventDefault();
    console.log('🔘 Check button clicked');

    const input = newsInput.value.trim();
    if (!input) {
      verdictMessage.textContent = 'Please enter some text to check.';
      verdictMessage.style.color = '#DC2626';
      updateCredibilityScore(null, 0, 0, '');
      return;
    }

    setLoading(true);
    verdictMessage.textContent = 'Analyzing...';
    verdictMessage.style.color = '#6B7280';
    credibilityScore.innerHTML = '';

    try {
      console.log('➡️ Sending request to /factcheck');
      const response = await fetch('/factcheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });

      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('✅ Flask response received:', data);

      // 🎯 Display Flask result
      verdictMessage.textContent = data.prediction || data.message || "Unknown response";
      verdictMessage.style.color =
        (data.prediction && data.prediction.toLowerCase().includes("fake")) ||
        (data.message && data.message.toLowerCase().includes("fake"))
          ? "#DC2626"
          : "#059669";

      updateCredibilityScore(
        data.confidence || data.score || 0,
        data.fake_probability || 0,
        data.real_probability || 0,
        data.explanation || (data.factors ? data.factors.join(', ') : 'No explanation provided')
      );

    } catch (error) {
      console.error('❌ Error:', error);
      verdictMessage.textContent = 'Error checking news. Please try again.';
      verdictMessage.style.color = '#DC2626';
      updateCredibilityScore(null, 0, 0, '');
    } finally {
      setLoading(false);
    }
  });

  // 🧹 CLEAR Button Logic
  clearButton.addEventListener('click', function () {
    newsInput.value = '';
    verdictMessage.textContent = '';
    credibilityScore.innerHTML = '';

    // 🎬 Fade-out + re-enable smooth
    clearButton.classList.add('fade-out');
    setTimeout(() => clearButton.classList.remove('fade-out'), 300);
  });

  // ✨ Auto-show Clear Button when typing
  newsInput.addEventListener('input', () => {
    clearButton.style.opacity = newsInput.value ? '1' : '0.5';
  });

  console.log('✅ Setup complete');
});
