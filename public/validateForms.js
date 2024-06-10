(() => {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validateform');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            const fileInput = document.getElementById('formFileMultiple');
            const errorMsgContainer = document.getElementById('error-message');

            // Custom file validation
            const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
            const maxFiles = 3; // Maximum number of files
            const files = fileInput.files;
            let fileValidationError = false;

            errorMsgContainer.textContent = '';

            if (files.length > maxFiles) {
                errorMsgContainer.textContent = `You can upload a maximum of ${maxFiles} files.`;
                fileValidationError = true;
            }

            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                    errorMsgContainer.textContent = `Each file should be less than ${maxSize / (1024 * 1024)} MB.`;
                    fileValidationError = true;
                }
            }

            if (!form.checkValidity() || fileValidationError) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();
