



    $(document).ready(function() {

   
        $('#calendar').fullCalendar({
            defaultView: 'agendaWeek',
            eventLimit: false,
            allDaySlot: false,
            events: [{
        title:"",
        start: '14:00', // a start time (10am in this example)
        end: '15:00', // an end time (6pm in this example)
        dow: [ 3, 7 ] // Repeat monday and thursday
    },
    {
        title:"",
        start: '10:00', // a start time (10am in this example)
        end: '11:00', // an end time (6pm in this example)
        dow: [ 1, 4 ] // Repeat monday and thursday
    },
        {
        title:"",
        start: '11:00', // a start time (10am in this example)
        end: '12:00', // an end time (6pm in this example)
        dow: [ 5, 6 ] // Repeat monday and thursday
    },
        {
        title:"",
        start: '15:00', // a start time (10am in this example)
        end: '16:00', // an end time (6pm in this example)
        dow: [4]
    }
],
eventColor: 'green',
            columnFormat: 'ddd',
            timezone: false,
            selectOverlap: false,
            eventOverlap: false,
            selectable: true,
            header : {
                left : '',
                center: '',
                right : ''
                    }
            })  
        });


 


