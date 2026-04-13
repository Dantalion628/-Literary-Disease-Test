(() => {
  const btnDownload = document.getElementById('btnDownload');
  const btnShare    = document.getElementById('btnShare');
  const shareCard   = document.getElementById('shareCard');

  async function capture() {
    return html2canvas(shareCard, {
      backgroundColor: '#161b22',
      scale: 2,
      useCORS: true,
      logging: false,
    });
  }

  // Download as PNG
  btnDownload.addEventListener('click', async () => {
    btnDownload.textContent = '生成中…';
    btnDownload.disabled = true;
    try {
      const canvas = await capture();
      const link = document.createElement('a');
      link.download = `文艺病-${RESULT_KEYWORD}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('截图失败，请尝试截图分享');
    } finally {
      btnDownload.textContent = '保存结果图';
      btnDownload.disabled = false;
    }
  });

  // Share via Web Share API or copy URL
  btnShare.addEventListener('click', async () => {
    const url = window.location.href;
    const text = `我做了文艺病自测，结果是「${RESULT_KEYWORD}」，快来试试你是哪种？`;

    if (navigator.share) {
      try {
        // Try to share with image
        const canvas = await capture();
        canvas.toBlob(async (blob) => {
          const file = new File([blob], `文艺病-${RESULT_KEYWORD}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: '文艺病自测', text, url, files: [file] });
          } else {
            await navigator.share({ title: '文艺病自测', text, url });
          }
        }, 'image/png');
      } catch (e) {
        // Fallback: copy URL
        copyURL(url);
      }
    } else {
      copyURL(url);
    }
  });

  function copyURL(url) {
    navigator.clipboard.writeText(url).then(() => {
      const orig = btnShare.textContent;
      btnShare.textContent = '链接已复制';
      setTimeout(() => { btnShare.textContent = orig; }, 2000);
    }).catch(() => {
      prompt('复制此链接分享：', url);
    });
  }
})();
