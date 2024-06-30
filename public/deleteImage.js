(() => {
    document.addEventListener('DOMContentLoaded', function () {
        const deleteButtons = document.querySelectorAll('.delete-button');

        deleteButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                // Prevent the event from propagating to the carousel controls
                event.preventDefault();
                event.stopPropagation();

                const index = this.getAttribute('data-index');
                const form = document.getElementById(`deleteForm${index}`);

                fetch(form.getAttribute('action'), {
                    method: 'DELETE',
                }).then(response => {
                    if (response.ok) {
                        const carouselItem = this.closest('.carousel-item');
                        carouselItem.remove();

                        // Update carousel items
                        const remainingItems = document.querySelectorAll('.carousel-item');
                        if (remainingItems.length > 0) {
                            // Ensure the first item is always active
                            remainingItems.forEach((item, i) => {
                                if (i === 0) {
                                    item.classList.add('active');
                                } else {
                                    item.classList.remove('active');
                                }
                            });
                        } else {
                            // If no items remain, hide the carousel controls
                            document.querySelector('.carousel-control-prev').style.display = 'none';
                            document.querySelector('.carousel-control-next').style.display = 'none';
                        }
                    } else {
                        console.error('Failed to delete the image');
                    }
                }).catch(error => {
                    console.error('Error:', error);
                });
            });
        });

        document.querySelector('.carousel-control-prev').addEventListener('click', function (event) {
            if (!event.target.closest('.delete-icon')) {
                $('#carousel').carousel('prev');
            }
            event.preventDefault();
        });

        document.querySelector('.carousel-control-next').addEventListener('click', function (event) {
            if (!event.target.closest('.delete-icon')) {
                $('#carousel').carousel('next');
            }
            event.preventDefault();
        });
    });
})();
