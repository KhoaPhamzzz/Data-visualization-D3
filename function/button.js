
    document.addEventListener('DOMContentLoaded', function() {
      var link = document.querySelector('a.home-button');
      
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default behavior of the link
        
        var targetElement = document.querySelector(link.getAttribute('href'));
        
        // Scroll smoothly to the target element
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
