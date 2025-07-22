

    // Dummy data for appointments


    document.querySelector('.toggle1').addEventListener('click', function() {
        var appointmentDiv1 = document.querySelector('#appointments-section');
        var appointmentDiv2 = document.querySelector('#chat-section');
        var appointmentDiv3 = document.querySelector('#payments-section');
        var appointmentDiv4 = document.querySelector('.meeting-section');

        if (appointmentDiv1.style.display === 'none' || appointmentDiv1.style.display === '') {
            appointmentDiv1.style.display = 'block';
            appointmentDiv2.style.display='none';
            appointmentDiv3.style.display='block';
            appointmentDiv4.style.display='none';
        } else {
            appointmentDiv1.style.display = 'none';
        }
      
    });

    document.querySelector('.toggle4').addEventListener('click', function() {
        var appointmentDiv1 = document.querySelector('#appointments-section');
        var appointmentDiv2 = document.querySelector('#chat-section');
        var appointmentDiv3 = document.querySelector('#payments-section');
        var appointmentDiv4 = document.querySelector('.meeting-section');

        if (appointmentDiv1.style.display === 'none' || appointmentDiv1.style.display === '') {
            appointmentDiv1.style.display = 'block';
            appointmentDiv2.style.display='none';
            appointmentDiv3.style.display='none';
            appointmentDiv4.style.display='none';
        } else {
            appointmentDiv1.style.display = 'none';
        }
      
    });
    document.querySelector('.toggle5').addEventListener('click', function() {
        
        var appointmentDiv1 = document.querySelector('#chat-section');
        var appointmentDiv2 = document.querySelector('#appointments-section');
        var appointmentDiv3 = document.querySelector('#payments-section');
        var appointmentDiv4 = document.querySelector('.meeting-section');

        if (appointmentDiv1.style.display === 'none' || appointmentDiv1.style.display === '') {
            appointmentDiv1.style.display = 'block';
            appointmentDiv2.style.display='none';
            appointmentDiv3.style.display='none';
            appointmentDiv4.style.display='none';
        } else {
            appointmentDiv1.style.display = 'none';
        }
    });
    document.querySelector('.toggle6').addEventListener('click', function() {
        var appointmentDiv1 = document.querySelector('#payments-section');
        var appointmentDiv2 = document.querySelector('#chat-section');
        var appointmentDiv3 = document.querySelector('#appointments-section');
        var appointmentDiv4 = document.querySelector('.meeting-section');
        
        if (appointmentDiv1.style.display === 'none' || appointmentDiv1.style.display === '') {
            appointmentDiv1.style.display = 'block';
            appointmentDiv2.style.display='none';
            appointmentDiv3.style.display='none';
            appointmentDiv4.style.display='none';
        } else {
            appointmentDiv1.style.display = 'none';
        }
      
    });


    document.querySelector('.toggle7').addEventListener('click', function() {
        var appointmentDiv1 = document.querySelector('#payments-section');
        var appointmentDiv2 = document.querySelector('#chat-section');
        var appointmentDiv3 = document.querySelector('#appointments-section');
        var appointmentDiv4 = document.querySelector('.meeting-section');
        
        if (appointmentDiv4.style.display === 'none' || appointmentDiv1.style.display === '') {
            appointmentDiv4.style.display = 'block';
            appointmentDiv2.style.display='none';
            appointmentDiv3.style.display='none';
            appointmentDiv1.style.display='none';
        } else {
            appointmentDiv4.style.display = 'none';
        }
      
    });

    //---------
   
  
  



