$(document).ready(function () {

    "use strict";

    // Smooth scroll to inner links

    $('.inner-link').smoothScroll({
        offset: -59,
        speed: 800
    });

    // Add scrolled class to nav

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('nav').addClass('scrolled');
        } else {
            $('nav').removeClass('scrolled');
        }
    });

    // Set nav container height for fixed nav

    if (!$('nav').hasClass('transparent')) {
        $('.nav-container').css('min-height', $('nav').outerHeight());
    }

    // Mobile toggle

    $('.mobile-toggle').click(function () {
        $('nav').toggleClass('nav-open');
    });

    $('.menu li a').click(function () {
        if ($(this).closest('nav').hasClass('nav-open')) {
            $(this).closest('nav').removeClass('nav-open');
        }
    });

    // Append .background-image-holder <img>'s as CSS backgrounds

    $('.background-image-holder').each(function () {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', '50% 50%');
    });

    // Fade in background images

    setTimeout(function () {
        $('.background-image-holder').each(function () {
            $(this).addClass('fadeIn');
        });
        $('.header.fadeContent').each(function () {
            $(this).addClass('fadeIn');
        });
    }, 200);


    // Parallax scrolling

    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        if (window.requestAnimationFrame) {
            parallaxBackground();
            $(window).scroll(function () {
                requestAnimationFrame(parallaxBackground);
            });
        }
    } else {
        $('.parallax').removeClass('parallax');
    }

    // Sliders

    $('.image-slider').flexslider({
        directionNav: false
    });

    // Radio box controls

    $('.radio-holder').click(function () {
        $(this).siblings().find('input').prop('checked', false);
        $(this).find('input').prop('checked', true);
        $(this).closest('.radio-group').find('.radio-holder').removeClass('checked');
        $(this).addClass('checked');
    });

    $('form input[type="radio"]').each(function () {
        var valueText = $(this).closest('.radio-holder').find('span').text();
        $(this).attr('value', convertToSlug(valueText));
    });

    $('form input[type="text"]').each(function () {
        var attrText = $(this).attr('placeholder');
        $(this).attr('name', convertToSlug(attrText));
    });

    // Contact form code

    $('form.form-email').submit(function (e) {

        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        var thisForm = $(this).closest('form.form-email'),
            error = 0,
            originalError = thisForm.attr('original-error'),
            loadingSpinner, iFrame, userEmail, userFullName, userFirstName, userLastName;


        if (typeof originalError !== typeof undefined && originalError !== false) {
            thisForm.find('.form-error').text(originalError);
        }


        error = validateFields(thisForm);


        if (error === 1) {
            $(this).closest('form').find('.form-error').fadeIn(200);
            setTimeout(function () {
                $(thisForm).find('.form-error').fadeOut(500);
            }, 3000);
        } else {
            // Hide the error if one was shown
            $(this).closest('form').find('.form-error').fadeOut(200);
            // Create a new loading spinner while hiding the submit button.
            loadingSpinner = jQuery('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
            $(thisForm).find('input[type="submit"]').hide();

            var form = thisForm[0];
            var message = {
                message_html: thisForm.serialize(),
                name: form['tu-nombrenombres'].value,
                attending: form['rsvp'].value,
                foods: form['comidas-a-evitar'].value,
            };
            emailjs.send("gmail", "template_dseEVZtn", message)
                .then(function (response) {
                    console.log("SUCCESS. status=%d, text=%s", response.status, response.text);

                    $(thisForm).find('.form-loading').remove();
                    $(thisForm).find('input[type="submit"]').show();

                    thisForm.find('.form-success').fadeIn(1000);
                    thisForm.find('.form-error').fadeOut(1000);
                    setTimeout(function () {
                        thisForm.find('.form-success').fadeOut(500);
                    }, 5000);

                }, function (err) {
                    console.log("FAILED. error=", err);

                    // Keep the current error text in a data attribute on the form
                    thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                    // Show the error with the returned error text.
                    thisForm.find('.form-error').text(err).fadeIn(1000);
                    thisForm.find('.form-success').fadeOut(1000);
                    $(thisForm).find('.form-loading').remove();
                    $(thisForm).find('input[type="submit"]').show();
                });
        }
        return false;
    });

    $('.validate-required, .validate-email').on('blur change', function () {
        validateFields($(this).closest('form'));
    });

    $('form').each(function () {
        if ($(this).find('.form-error').length) {
            $(this).attr('original-error', $(this).find('.form-error').text());
        }
    });

    function validateFields(form) {
        var name, error, originalErrorMessage;

        $(form).find('.validate-required[type="checkbox"]').each(function () {
            if (!$('[name="' + $(this).attr('name') + '"]:checked').length) {
                error = 1;
                name = $(this).attr('name').replace('[]', '');
                form.find('.form-error').text('Please tick at least one ' + name + ' box.');
            }
        });

        $(form).find('.validate-required').each(function () {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-email').each(function () {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        if (!form.find('.field-error').length) {
            form.find('.form-error').fadeOut(1000);
        }

        return error;
    }

});

function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

function parallaxBackground() {
    $('.parallax').each(function () {
        var element = $(this);
        var scrollTop = $(window).scrollTop();
        var scrollBottom = scrollTop + $(window).height();
        var elemTop = element.offset().top;
        var elemBottom = elemTop + element.outerHeight();

        if ((scrollBottom > elemTop) && (scrollTop < elemBottom)) {
            if (element.is('section:first-of-type')) {
                var value = (scrollTop / 6);
                $(element).find('.background-image-holder').css({
                    transform: 'translateY(' + value + 'px)'
                });
            } else {
                var value = ((scrollBottom - elemTop) / 6);
                $(element).find('.background-image-holder').css({
                    transform: 'translateY(' + value + 'px)'
                });
            }

        }
    });

}

(function(){
    emailjs.init("user_qs6dnswcpcz3BWqWkX5Kk");
})();

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-82463714-1', 'auto');
ga('send', 'pageview');