(() => {
  let current = 0;
  const answers = [];   // answers[i] = chosen option index for question i

  const qText       = document.getElementById('qText');
  const optionsEl   = document.getElementById('options');
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const card        = document.getElementById('questionCard');
  const btnBack     = document.getElementById('btnBack');

  // ── Render a question ──────────────────────
  function render(index, direction) {
    const q = QUESTIONS[index];

    // Progress
    const pct = Math.round((index / QUESTIONS.length) * 100);
    progressBar.style.width = Math.max(pct, 2) + '%';
    progressLabel.textContent = `${index + 1} / ${QUESTIONS.length}`;

    // Back button: hide on first question
    btnBack.style.display = index === 0 ? 'none' : 'inline-block';

    // Content
    qText.textContent = q.text;
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = opt.text;
      // Highlight previously chosen answer if re-visiting
      if (answers[index] === i) btn.classList.add('selected');
      btn.addEventListener('click', () => choose(i));
      optionsEl.appendChild(btn);
    });
  }

  // ── Animate transition then render ─────────
  function transition(nextIndex, direction) {
    card.classList.add('fade-out');
    setTimeout(() => {
      current = nextIndex;
      render(current, direction);
      card.classList.remove('fade-out');
      card.classList.add('fade-in');
      card.addEventListener('animationend', () => card.classList.remove('fade-in'), { once: true });
    }, 280);
  }

  // ── Choose an option ───────────────────────
  function choose(optionIndex) {
    const btns = optionsEl.querySelectorAll('.option');
    btns.forEach(b => b.disabled = true);
    btns[optionIndex].classList.add('selected');

    // Record (overwrite if returning to a previous question)
    answers[current] = optionIndex;

    setTimeout(() => {
      if (current + 1 < QUESTIONS.length) {
        transition(current + 1, 'forward');
      } else {
        submit();
      }
    }, 320);
  }

  // ── Back button ────────────────────────────
  btnBack.addEventListener('click', () => {
    if (current === 0) return;
    transition(current - 1, 'back');
  });

  // ── Submit ─────────────────────────────────
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
