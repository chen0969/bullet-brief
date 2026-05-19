const saveDanmuToLocalStorage = () => {
  const htmlString = document.getElementById('htmlInput').value;

  if (!htmlString.trim()) {
    alert('No HTML input found');
    return;
  }

  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // 嘗試更寬鬆抓取
  const allLi = [...doc.querySelectorAll('#sub_list li')];

  console.log('Total LI found:', allLi.length);

  const data = allLi
    .map((li, index) => {
      const timeEl =
        li.querySelector('b') ||
        li.querySelector('.time');

      const contentEl =
        li.querySelector('.sub_content span') ||
        li.querySelector('.sub_content') ||
        li.querySelector('span');

      const time = timeEl?.textContent?.trim() || '';
      const content = contentEl?.textContent?.trim() || '';

      return {
        id: index,
        time,
        content
      };
    })
    .filter(item => item.time && item.content);

  console.log('Danmu parsed:', data.length);

  // 避免 localStorage 太大報錯
  try {
    localStorage.setItem(
      'danmuData',
      JSON.stringify(data)
    );
  } catch (err) {
    console.error('localStorage failed:', err);
    alert(
      `Storage failed. Parsed ${data.length} items. ` +
      `Data may exceed localStorage limit.`
    );
    return;
  }

  // 顯示前 50 筆避免頁面卡死
  document.getElementById('result').textContent =
    JSON.stringify(data.slice(0, 50), null, 2) +
    `\n\nTotal items: ${data.length}`;

  alert(`Saved ${data.length} danmu items to localStorage`);
};

document
  .getElementById('saveBtn')
  .addEventListener('click', saveDanmuToLocalStorage);