document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const uploadContainer = document.getElementById('upload-container');
  const imageComparison = document.getElementById('image-comparison');
  const originalImage = document.getElementById('original-image');
  const compressedImage = document.getElementById('compressed-image');
  const originalSizeEl = document.getElementById('original-size');
  const compressedSizeEl = document.getElementById('compressed-size');
  const sizeReductionEl = document.getElementById('size-reduction');
  const compressionLevel = document.getElementById('compression-level');
  const compressionValue = document.getElementById('compression-value');
  const compressBtn = document.getElementById('compress-btn');
  const downloadBtn = document.getElementById('download-btn');

  // Variables to store image data
  let originalFile = null;
  let compressedBlob = null;
  let compressedFileName = '';

  // Setup drag and drop functionality
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    uploadArea.classList.add('highlight');
  }

  function unhighlight() {
    uploadArea.classList.remove('highlight');
  }

  // Handle file drop
  uploadArea.addEventListener('drop', handleDrop, false);
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  // Handle file input change
  fileInput.addEventListener('change', function() {
    handleFiles(this.files);
  });

  // Click on upload area should trigger file input
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      alert('Please select a valid JPG or PNG image');
      return;
    }

    originalFile = file;
    displayOriginalImage(file);
    resetCompressedView();

    // Show image comparison section
    uploadContainer.style.display = 'none';
    imageComparison.classList.remove('hidden');
  }

  // Display the original image
  function displayOriginalImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalImage.src = e.target.result;
      
      // Display the original file size
      const fileSizeInKB = (file.size / 1024).toFixed(2);
      originalSizeEl.textContent = fileSizeInKB + ' KB';
    };
    reader.readAsDataURL(file);
  }

  // Reset compressed view
  function resetCompressedView() {
    compressedImage.src = '';
    compressedSizeEl.textContent = '0 KB';
    sizeReductionEl.textContent = '0%';
    downloadBtn.disabled = true;
    compressedBlob = null;
  }

  // Update compression value display when slider changes
  compressionLevel.addEventListener('input', function() {
    compressionValue.textContent = this.value + '%';
  });

  // Handle compression action
  compressBtn.addEventListener('click', async () => {
    if (!originalFile) return;

    try {
      compressBtn.disabled = true;
      compressBtn.textContent = 'Compressing...';

      const quality = parseInt(compressionLevel.value) / 100;
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: originalFile.type,
        quality: quality
      };

      // Compress the image
      const compressedFile = await imageCompression(originalFile, options);
      compressedBlob = compressedFile;
      
      // Generate a file name
      const originalName = originalFile.name;
      const extension = originalName.split('.').pop();
      const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
      compressedFileName = `${baseName}-compressed.${extension}`;

      // Display the compressed image
      const reader = new FileReader();
      reader.onload = function(e) {
        compressedImage.src = e.target.result;
        
        // Display the compressed file size
        const fileSizeInKB = (compressedFile.size / 1024).toFixed(2);
        compressedSizeEl.textContent = fileSizeInKB + ' KB';
        
        // Calculate and display size reduction percentage
        const originalSize = originalFile.size;
        const compressedSize = compressedFile.size;
        const reductionPercent = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        sizeReductionEl.textContent = reductionPercent + '%';
        
        // Enable download button
        downloadBtn.disabled = false;
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error compressing image. Please try again.');
    } finally {
      compressBtn.disabled = false;
      compressBtn.textContent = 'Compress';
    }
  });

  // Handle download button click
  downloadBtn.addEventListener('click', () => {
    if (!compressedBlob) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedBlob);
    link.download = compressedFileName;
    link.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  });

  // Reset button to upload a new image
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Upload New Image';
  resetButton.className = 'primary-btn';
  resetButton.style.marginTop = '1rem';
  
  resetButton.addEventListener('click', () => {
    uploadContainer.style.display = 'block';
    imageComparison.classList.add('hidden');
    resetCompressedView();
    fileInput.value = '';
    originalFile = null;
  });
  
  imageComparison.appendChild(resetButton);
}); 