document.getElementById('startButton').addEventListener('click', async () => {
    const urls = [
        'https://chlabtest.webflow.io/index.html',
        'https://chlabtest.webflow.io/CHLab - Research.html',
        'https://chlabtest.webflow.io/CHLab - Publications.html',
        'https://chlabtest.webflow.io/CHLab - Outreach.html',
        'https://chlabtest.webflow.io/CHLab - News.html',
        'https://chlabtest.webflow.io/CHLab - Members.html',
        'https://chlabtest.webflow.io/CHLab - Contact.html',
        'https://chlabtest.webflow.io/Biomaterial Chemistry.html',
        'https://chlabtest.webflow.io/Scaffold Fabrication.html',
        'https://chlabtest.webflow.io/ECH.html'
    ];

    let files = await Promise.all(urls.map(url => fetch(url).then(response => response.text())));

    const zip = new JSZip();
    const folderName = "CHLab_Edited";

    urls.forEach((url, index) => {
        let text = files[index];
        text = text.replace(/href="\//g, 'href="');
        text = text.replace(/href="research"/g, 'href="CHLab - Research.html"');
        text = text.replace(/href="publications"/g, 'href="CHLab - Publications.html"');
        text = text.replace(/href="news"/g, 'href="CHLab - News.html"');
        text = text.replace(/href="outreach"/g, 'href="CHLab - Outreach.html"');
        text = text.replace(/href="members"/g, 'href="CHLab - Members.html"');
        text = text.replace(/href="contact"/g, 'href="CHLab - Contact.html"');
        text = text.replace(/href="biomaterial-chemistry"/g, 'href="Biomaterial Chemistry.html"');
        text = text.replace(/href="scaffold-fabrication"/g, 'href="Scaffold Fabrication.html"');
        text = text.replace(/href="ech"/g, 'href="ECH.html"');

        let fileName = url.split('/').pop();
        zip.folder(folderName).file(fileName, text);
    });

    zip.generateAsync({type:"blob"})
        .then(function(content) {
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = `${folderName}.zip`;
            downloadLink.style.display = 'block';
            downloadLink.click();
        });
});
