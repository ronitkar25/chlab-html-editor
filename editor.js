document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

let filesToProcess = [];

function handleFileSelect(event) {
    filesToProcess = event.target.files;
}

function processFiles() {
    if (filesToProcess.length === 0) {
        alert('Please select files first.');
        return;
    }

    const editedFiles = [];
    const fileReaderPromises = [];

    for (let file of filesToProcess) {
        fileReaderPromises.push(readFileContent(file).then(content => {
            const { editedContent, newFileName } = editFileContent(content, file.name);
            editedFiles.push(new File([editedContent], newFileName, { type: 'text/html' }));
        }));
    }

    Promise.all(fileReaderPromises).then(() => {
        downloadEditedFiles(editedFiles);
    });
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
    });
}

function editFileContent(content, fileName) {
    const replacements = {
        'href="/"': 'href="index.html"',
        'href="/research"': 'href="CHLab - Research.html"',
        'href="/publications"': 'href="CHLab - Publications.html"',
        'href="/news"': 'href="CHLab - News.html"',
        'href="/outreach"': 'href="CHLab - Outreach.html"',
        'href="/members"': 'href="CHLab - Members.html"',
        'href="/contact"': 'href="CHLab - Contact.html"',
        'href="/biomaterial-chemistry"': 'href="Biomaterial Chemistry.html"',
        'href="/scaffold-fabrication"': 'href="Scaffold Fabrication.html"',
        'href="/ech"': 'href="ECH.html"'
    };

    for (let [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
    }

    let newFileName = fileName;
    if (fileName === 'CHLab - Home.html') {
        newFileName = 'index.html';
    }

    // Preserve YouTube iframes by ensuring they are not altered
    content = content.replace(/(<iframe[^>]+src="https:\/\/www\.youtube\.com\/embed\/[^>]+><\/iframe>)/g, '$1');

    return { editedContent: content, newFileName: newFileName };
}

function downloadEditedFiles(files) {
    const zip = new JSZip();
    files.forEach(file => zip.file(file.name, file));

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.getElementById('downloadLink');
        link.href = URL.createObjectURL(content);
        link.download = 'edited_files.zip';
        link.style.display = 'block';
        link.innerText = 'Download Edited Files';
    });
}
