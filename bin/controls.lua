local tinker = require'tinker'
local ev = require'ev'
local jet = require'jet'

local peer = jet.peer.new()
local ipcon = tinker.ipcon()
local servo = ipcon:servo(3)
local lcd = ipcon:lcd_20x4(2)

servo:enable(0)

servo:set_pulse_width(0,1000,2000)
servo:set_output_voltage(6000)
servo:set_position(0,0)--tonumber(arg[1]))
lcd:backlight_on()
lcd:clear_display()

set_steer = function(pos)
   if pos < 0 then
      pos = 3300 / 100 * -pos
   else
      pos = -4000 / 100 * pos
   end
   print(pos)
   servo:set_position(0,pos)
--   lcd:write_line(0,0,string.format('%4d',pos))
end

peer:state
{
   path = 'steer',
   value = 0,
   set = set_steer
}

peer:state
{
   path = 'speed',
   value = 0,
   set = set_steer
}


peer:loop()
--servo:disable(0)
-- lcd:backlight_on()
-- lcd:button_pressed( 
--    function(index)
--       lcd:clear_display()
--       lcd:write_line(index,0,'button '..index..' pressed')
--    end)
-- lcd:button_released( 
--    function(index)
--       lcd:clear_display()
--       lcd:write_line(index,0,'button '..index..' released')
--    end)

-- local sock = ipcon:event_socket()

-- local io = ev.IO.new(
--    function()
--       ipcon:dispatch_events()
--    end,sock:getfd(),ev.READ)

-- io:start(ev.Loop.default)
-- ev.Loop.default:loop()
