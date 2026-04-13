(() => {
  let current = 0;
  const answers = [];

  const qText      = document.getElementById('qText');
  const optionsEl  = document.getElementById('options');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const card       = document.getElementById('questionCard');

  function render(index) {
    const q = QUESTIONS[index];

    // Update progress
    const pct = Math.round(((index) / QUESTIONS.length) * 100);
    progressBar.style.width = Math.max(pct, 2) + '%';
    progressLabel.textContent = `${index + 1} / ${QUESTIONS.length}`;

    // Swap content
    qText.textContent = q.text;
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => choose(i));
      optionsEl.appendChild(btn);
    });
  }

  function choose(optionIndex) {
    // Highlight selected
    const btns = optionsEl.querySelectorAll('.option');
    btns.forEach(b => b.disabled = true);
    btns[optionIndex].classList.add('selected');

    answers.push(optionIndex);

    setTimeout(() => {
      if (current + 1 < QUESTIONS.length) {
        // Fade out → update → fade in
        card.classList.add('fade-out');
        setTimeout(() => {
          current++;
          render(current);
          card.classList.remove('fade-out');
          card.classList.add('fade-in');
          // Remove class after animation ends
          card.addEventListener('animationend', () => {
            card.classList.remove('fade-in');
          }, { once: true });
        }, 300);
      } else {
        // All answered — submit
        submit();
      }
    }, 350);
  }

  async function submit() {
    progressBar.style.width = '100%';
    progressLabel.textContent = '计算中…';
    card.classList.add('fade-out');

    try {
      const res = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (e) {
      progressLabel.textContent = '出了点问题，请刷新重试';
      card.classList.remove('fade-out');
    }
  }

  // Init
  render(0);
})();
