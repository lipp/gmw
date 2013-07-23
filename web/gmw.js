$(function() {
    var jetInstance;
    var isDefined = function(x) {
        return typeof x !== 'undefined' && x !== null;
    };

    $('#jet-address').val(window.document.domain);

    $('form#jet-config').submit(function(event) {
        var address = $('#jet-address').val();
        var port = $('#jet-port').val();
        var jetWsUrl = 'ws://' + address + ':' + port;
        if (jetInstance) {
            $('#status').text('Disconnecting');
            unfetch = null;
            jetInstance.close();
        }
        $('#status').text('Connecting');
        jetInstance = Jet.create(jetWsUrl, {
            onclose: function() {
                $('#status').text('Disconnected');
            },
            onopen: function() {
                $('#status').text('Connected');
            }
        });
        event.preventDefault();
    });

    $('form#jet-config').submit();
    

    var steer = 0;
    var setSteer = function(s) {
        s = Math.min(s, 100);
        s = Math.max(s, -100);
        if (steer !== s) {
            if (jetInstance) {
                steer = s;
                jetInstance.set('steer', s);
                $('#steer').val(steer);
            }
        }
    };



    var dragZone = document.getElementById('drag');

    Hammer(dragZone).on('drag', function(e) {
        e.gesture.preventDefault();
        setSteer(e.gesture.deltaY);
    });

    Hammer(dragZone).on('drag', function(e) {
        e.gesture.preventDefault();
        setSteer(e.gesture.deltaY);
    });

    Hammer(dragZone).on('release', function(e) {
        steer = 0;
        $('#steer').val(0);
        if (jetInstance) {
            jetInstance.set('steer', 0);
        }
    });


    Hammer(dragZone).on("tap", function(event) {
        alert('hello!');
    });

    document.body.addEventListener('touchmove', function(e) {
        // Cancel the event
        e.preventDefault();
    }, false);

    var initialX = null;
    var initialY = null;

    function handleOrientationEvent(event) {

        var x = event.beta ? event.beta : event.y * 90;
        var y = event.gamma ? event.gamma : event.x * 90;

        window.console && console.info('Raw position: x, y: ', x, y);

        if (!initialX && !initialY) {

            initialX = x;
            initialY = y;

        } else {

            var positionX = initialX - x;
            var positionY = initialY - y;
            
//            ball.style.top = (90 + positionX * 5) + 'px';
//            ball.style.left = (90 + positionY * 5) + 'px';
            $('#info').text(positionX);            
            jetInstance.set('speed', x*3);
        }
    }

    // Webkit en Mozilla variant beide registreren.
    window.addEventListener("MozOrientation", handleOrientationEvent, true);
    window.addEventListener("deviceorientation", handleOrientationEvent, true);
    
})
