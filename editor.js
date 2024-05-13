document.getElementById('startButton').addEventListener('click', async () => {
    const input = document.getElementById('fileInput');
    const files = input.files;

    if (files.length === 0) {
        alert('Please select a folder containing HTML files.');
        return;
    }

    const filePromises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filePromises.push(file.text().then(text => ({ name: file.name, content: text })));
    }

    const filesData = await Promise.all(filePromises);

    const zip = new JSZip();
    const folderName = "CHLab_Edited";

    filesData.forEach(file => {
        let text = file.content;
        text = text.replace(/href="\//g, 'href="');
        text = text.replace(/href="\/research"/g, 'href="CHLab - Research.html"');
        text = text.replace(/href="\/publications"/g, 'href="CHLab - Publications.html"');
        text = text.replace(/href="\/news"/g, 'href="CHLab - News.html"');
        text = text.replace(/href="\/outreach"/g, 'href="CHLab - Outreach.html"');
        text = text.replace(/href="\/members"/g, 'href="CHLab - Members.html"');
        text = text.replace(/href="\/contact"/g, 'href="CHLab - Contact.html"');
        text = text.replace(/href="\/biomaterial-chemistry"/g, 'href="Biomaterial Chemistry.html"');
        text = text.replace(/href="\/scaffold-fabrication"/g, 'href="Scaffold Fabrication.html"');
        text = text.replace(/href="\/ech"/g, 'href="ECH.html"');

        let fileName = file.name;
        if (fileName === 'index.html') {
            fileName = 'CHLab - Home.html';
        }

        zip.folder(folderName).file(fileName, text);
    });

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(content);
            downloadLink.download = `${folderName}.zip`;
            downloadLink.style.display = 'block';
            downloadLink.click();
        })
        .catch(error => {
            console.error('Error generating zip file:', error);
        });
});
