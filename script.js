document.addEventListener('DOMContentLoaded', function () {

    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    const hiddenElements = document.querySelectorAll('.hidden-fade, .hidden-left, .hidden-right');
    hiddenElements.forEach((el) => observer.observe(el));

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const counters = document.querySelectorAll('.counter');
        let hasCounted = false;
        const countUp = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText;
                    const increment = target / 200;
                    if (count < target) {
                        counter.innerText = `${Math.ceil(count + increment)}`;
                        setTimeout(updateCount, 1);
                    } else { counter.innerText = target; }
                };
                updateCount();
            });
        };
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    countUp();
                    hasCounted = true;
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    const thankYouPopup = document.getElementById('popup-message');
    const thankYouCloseBtn = thankYouPopup ? thankYouPopup.querySelector('.close-button') : null;
    const allForms = document.querySelectorAll('form[action*="formspree.io"]');

    allForms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const submissionIdInput = form.querySelector('#submissionID');
            let submissionID = null;

            if (submissionIdInput) {
                submissionID = 'MVG-' + Date.now();
                submissionIdInput.value = submissionID;
            }

            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    if (thankYouPopup) {
                        const popupText = thankYouPopup.querySelector('p');
                        if (submissionID) {
                            popupText.innerHTML = 'Your submission is complete. <br>Your Unique Code is: <strong>' + submissionID + '</strong><br>Please send this code to us on WhatsApp.';
                        } else {
                            popupText.innerHTML = 'Thank you for your message! We will get back to you shortly.';
                        }
                        thankYouPopup.classList.add('show');
                    }
                    form.reset();
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            }).catch(error => {
                alert('Oops! A network error occurred.');
            }).finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    });

    if (thankYouCloseBtn) {
        thankYouCloseBtn.addEventListener('click', () => {
            thankYouPopup.classList.remove('show');
        });
    }
    window.addEventListener('click', (event) => {
        if (event.target === thankYouPopup) {
            thankYouPopup.classList.remove('show');
        }
    });
});
