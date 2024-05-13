document.getElementById('startButton').addEventListener('click', async () => {
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const urls = [
        'https://chlabtest.webflow.io/index.html',
        'https://chlabtest.webflow.io/research.html',
        'https://chlabtest.webflow.io/publications.html',
        'https://chlabtest.webflow.io/outreach.html',
        'https://chlabtest.webflow.io/news.html',
        'https://chlabtest.webflow.io/members.html',
        'https://chlabtest.webflow.io/contact.html',
        'https://chlabtest.webflow.io/biomaterial-chemistry.html',
        'https://chlabtest.webflow.io/scaffold-fabrication.html',
        'https://chlabtest.webflow.io/ech.html'
    ];

    try {
        let files = await Promise.all(urls.map(url => fetch(corsProxy + url).then(response => response.text())));

        const zip = new JSZip();
        const folderName = "CHLab_Edited";

        urls.forEach((url, index) => {
            let text = files[index];
            text = text.replace(/href="\//g, 'href="');
            text = text.replace(/href="\/research"/g, 'href="research.html"');
            text = text.replace(/href="\/publications"/g, 'href="publications.html"');
            text = text.replace(/href="\/news"/g, 'href="news.html"');
            text = text.replace(/href="\/outreach"/g, 'href="outreach.html"');
            text = text.replace(/href="\/members"/g, 'href="members.html"');
            text = text.replace(/href="\/contact"/g, 'href="contact.html"');
            text = text.replace(/href="\/biomaterial-chemistry"/g, 'href="biomaterial-chemistry.html"');
            text = text.replace(/href="\/scaffold-fabrication"/g, 'href="scaffold-fabrication.html"');
            text = text.replace(/href="\/ech"/g, 'href="ech.html"');

            let fileName = url.split('/').pop();
            zip.folder(folderName).file(fileName, text);
        });

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `${folderName}.zip`;
                downloadLink.style.display = 'block';
                downloadLink.click();
            });
    } catch (error) {
        console.error('Error fetching or processing files:', error);
    }
});
