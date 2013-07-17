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
        setSteer(e.gesture.deltaX);
    });

    Hammer(dragZone).on('drag', function(e) {
        e.gesture.preventDefault();
        setSteer(e.gesture.deltaX);
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
    })

})
