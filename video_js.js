const video = document.getElementById('video');
        const danmuLayer = document.getElementById('danmu-layer');
        const status = document.getElementById('status');

        // Load JSON from localStorage
        const danmuData =
            JSON.parse(localStorage.getItem('danmuData')) || [];

        status.textContent =
            `Loaded ${danmuData.length} danmu items`;

        // Convert 0:00:05 → seconds
        const timeToSeconds = (timeStr) => {
            const parts = timeStr.split(':').map(Number);

            if (parts.length === 3) {
                const [h, m, s] = parts;
                return h * 3600 + m * 60 + s;
            }

            if (parts.length === 2) {
                const [m, s] = parts;
                return m * 60 + s;
            }

            return 0;
        };

        // Preprocess timestamps
        const danmuQueue = danmuData.map(item => ({
            ...item,
            seconds: timeToSeconds(item.time),
            shown: false
        }));

        // Upload video
        document
            .getElementById('videoUpload')
            .addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const url = URL.createObjectURL(file);
                video.src = url;
            });

        // Create danmu
        const createDanmu = (text) => {
            const danmu = document.createElement('div');
            danmu.className = 'danmu';
            danmu.textContent = text;

            // random vertical position (ensuring text doesn't overflow bottom)
            const maxHeight =
                danmuLayer.clientHeight - 40;

            danmu.style.top =
                `${Math.max(10, Math.random() * maxHeight)}px`;

            // random speed
            const duration =
                (Math.random() * 4 + 6).toFixed(1);

            danmu.style.animationDuration =
                `${duration}s`;

            danmuLayer.appendChild(danmu);

            danmu.addEventListener(
                'animationend',
                () => danmu.remove()
            );
        };

        // Show danmu at correct timing
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;

            danmuQueue.forEach(item => {
                if (
                    !item.shown &&
                    currentTime >= item.seconds &&
                    currentTime < item.seconds + 1 // Ensures it triggers reasonably close to time
                ) {
                    createDanmu(item.content);
                    item.shown = true;
                }
            });
        });

        // Reset when replay or skip
        video.addEventListener('seeked', () => {
            const currentTime = video.currentTime;

            danmuQueue.forEach(item => {
                item.shown =
                    item.seconds < currentTime;
            });
        });