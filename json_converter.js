    const saveDanmuToLocalStorage = () => {
      const htmlString = document.getElementById('htmlInput').value;

      // Create temporary DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const data = [...doc.querySelectorAll('#sub_list li.sub-list-li')]
        .map(li => ({
          time: li.querySelector('b')?.textContent.trim() || '',
          content: li.querySelector('.sub_content span')?.textContent.trim() || ''
        }))
        .filter(item => item.time && item.content);

      localStorage.setItem('danmuData', JSON.stringify(data));

      // Show result
      document.getElementById('result').textContent =
        JSON.stringify(data, null, 2);

      alert(`Saved ${data.length} danmu items to localStorage`);
    };

    document.getElementById('saveBtn')
      .addEventListener('click', saveDanmuToLocalStorage);